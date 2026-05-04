Looking at your code carefully, I can spot the likely culprit. Before recommending a provider switch, let me show you what's wrong — it's fixable.

## The Root Cause: `onSelect` Signature Mismatch

React-day-picker v8's `mode="range"` calls `onSelect` with this signature:

```js
onSelect(range, selectedDay, activeModifiers, e)
```

But your handler is:

```js
const handleDateSelect = (newRange, selectedDay) => {
    if (!selectedDay) return;  // ← THIS is the problem
```

**The `selectedDay` in react-day-picker is NEVER undefined** when the user clicks a valid day. However, your custom logic completely **ignores `newRange`** and reimplements range logic manually. This is the real fragility.

---

## Why Only Some Clients?

The `disabled={{ after: new Date() }}` prop is almost certainly the trigger. Here's what happens:

- `new Date()` is evaluated at **render time**
- If a client's system clock is slightly off (even by seconds), or their timezone differs, the "today" boundary shifts
- On some machines, clicking "today" or dates near the boundary hits the `disabled` modifier → react-day-picker calls `onSelect` with `selectedDay = undefined` for disabled days, which your early `return` catches silently — so nothing happens
- Navigation (prev/next month buttons) doesn't involve `onSelect`, so that always works fine

---

## The Fix

```jsx
const handleDateSelect = (newRange, selectedDay, activeModifiers) => {
    // Bail out if the day is disabled (e.g., future date boundary)
    if (!selectedDay || activeModifiers?.disabled) return;

    if (!dateRange?.from || (dateRange?.from && dateRange?.to)) {
        const newFrom = new Date(selectedDay);
        newFrom.setHours(
            dateRange?.from ? dateRange.from.getHours() : 0,
            dateRange?.from ? dateRange.from.getMinutes() : 0,
            0, 0
        );
        setDateRange({ from: newFrom, to: undefined });
        return;
    }

    let rawFrom = dateRange.from;
    let rawTo = new Date(selectedDay); // ← always use a fresh copy

    const dayFrom = new Date(rawFrom).setHours(0, 0, 0, 0);
    const dayTo = new Date(rawTo).setHours(0, 0, 0, 0);

    if (dayTo < dayFrom) {
        [rawFrom, rawTo] = [rawTo, rawFrom];
    }

    setDateRange({
        from: (() => {
            const d = new Date(rawFrom);
            d.setHours(
                rawFrom === dateRange.from ? dateRange.from.getHours() : 0,
                rawFrom === dateRange.from ? dateRange.from.getMinutes() : 0,
                0, 0
            );
            return d;
        })(),
        to: (() => {
            const d = new Date(rawTo);
            d.setHours(23, 30, 0, 0);
            return d;
        })(),
    });
};
```

Also fix the `disabled` prop to be timezone-safe:

```jsx
// Before (fragile - re-evaluates to exact ms on every render)
disabled={{ after: new Date() }}

// After (stable boundary - disables anything strictly after today)
disabled={{ 
    after: (() => { 
        const today = new Date(); 
        today.setHours(23, 59, 59, 999); 
        return today; 
    })() 
}}
```

Or memoize it:

```jsx
const disabledDays = useMemo(() => ({ after: endOfDay(new Date()) }), []);
// then: disabled={disabledDays}
```

---

## Should You Switch Providers?

No. The library isn't the problem — the custom `onSelect` re-implementation fighting against the library's built-in range logic is. React-day-picker is solid and well-maintained. A provider switch would carry the same risk of subtle bugs in edge cases.

The `activeModifiers?.disabled` guard + the `endOfDay` boundary fix should resolve this for all clients.