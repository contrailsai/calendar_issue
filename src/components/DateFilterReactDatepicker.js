"use client"

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock2Icon, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from "@/lib/utils";

// Generate ["00:00", "00:30", "01:00" ... "23:30"]
const halfHourOptions = Array.from({ length: 48 }).map((_, i) => {
    const totalMinutes = i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
});

const get24HourString = (date) => {
    if (!date) return "00:00";
    const d = new Date(date);
    return format(d, "HH:mm");
};

function CustomTimePicker({ date, onChange, disabled }) {
    const [open, setOpen] = useState(false);
    const time24 = get24HourString(date);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateDate = (newTime24) => {
        if (!date) return;
        const [h, m] = newTime24.split(':').map(Number);
        const updated = new Date(date);
        updated.setHours(h, m, 0, 0);
        onChange(updated);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:opacity-50",
                    !date && "text-slate-500"
                )}
            >
                <div className="flex items-center gap-2">
                    <Clock2Icon className="h-4 w-4 opacity-50" />
                    {date ? time24 : "Select time"}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            
            {open && (
                <div className="absolute z-50 mt-1 flex h-[200px] w-32 flex-col overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-md">
                    {halfHourOptions.map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={cn(
                                "flex h-8 shrink-0 items-center justify-center rounded-sm px-2 py-1 text-sm font-normal hover:bg-slate-100",
                                time24 === t && "bg-slate-600 text-white hover:bg-slate-700"
                            )}
                            onClick={() => updateDate(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function DateFilterReactDatepicker({ title, onApply, initialFrom, initialTo }) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef(null);
    const [dateRange, setDateRange] = useState({
        from: initialFrom ? new Date(initialFrom) : undefined,
        to: initialTo ? new Date(initialTo) : undefined,
    });
    const [appliedRange, setAppliedRange] = useState({
        from: initialFrom ? new Date(initialFrom) : undefined,
        to: initialTo ? new Date(initialTo) : undefined,
    });

    useEffect(() => {
        setDateRange({
            from: initialFrom ? new Date(initialFrom) : undefined,
            to: initialTo ? new Date(initialTo) : undefined,
        });
        setAppliedRange({
            from: initialFrom ? new Date(initialFrom) : undefined,
            to: initialTo ? new Date(initialTo) : undefined,
        });
    }, [initialFrom, initialTo]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setDateRange({ ...appliedRange });
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, appliedRange]);

    const handleApply = () => {
        if (!dateRange.from || !dateRange.to) {
            setDateRange({ from: undefined, to: undefined });
            setAppliedRange({ from: undefined, to: undefined });
            onApply({ from: null, to: null });
        } else {
            setAppliedRange({ ...dateRange });
            onApply(dateRange);
        }
        setOpen(false);
    };

    const handleClear = () => {
        setDateRange({ from: undefined, to: undefined });
        setAppliedRange({ from: undefined, to: undefined });
        onApply({ from: null, to: null });
        setOpen(false);
    };

    const handleDateSelect = (dates) => {
        const [start, end] = dates;
        setDateRange(prev => {
            const newFrom = start ? new Date(start) : undefined;
            const newTo = end ? new Date(end) : undefined;
            
            if (newFrom && prev.from) newFrom.setHours(prev.from.getHours(), prev.from.getMinutes(), 0, 0);
            if (newTo && prev.to) newTo.setHours(prev.to.getHours(), prev.to.getMinutes(), 0, 0);
            else if (newTo) newTo.setHours(23, 30, 0, 0);

            return { from: newFrom, to: newTo };
        });
    };

    // Style overrides for react-datepicker to match Tailwind design
    const datepickerStyles = `
        .react-datepicker { font-family: inherit; border: none; }
        .react-datepicker__header { background-color: transparent; border-bottom: none; }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
            background-color: #0f172a !important; color: white;
        }
        .react-datepicker__day--keyboard-selected { background-color: transparent; }
        .react-datepicker__day:hover { background-color: #f1f5f9; border-radius: 0.375rem; }
    `;

    return (
        <div className="relative w-full" ref={popoverRef}>
            <style>{datepickerStyles}</style>
            <button 
                type="button"
                onClick={() => setOpen(!open)}
                className="flex h-9 w-full items-center justify-start rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-normal shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-950"
            >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
                {appliedRange?.from ? (
                    appliedRange.to ? (
                        <span className="truncate text-slate-500">
                            {format(appliedRange.from, "LLL dd")} - {format(appliedRange.to, "LLL dd")}
                        </span>
                    ) : (
                        <span className="truncate text-slate-500">{format(appliedRange.from, "LLL dd, y")}</span>
                    )
                ) : (
                    <span className="truncate text-slate-500">{title}</span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-[600px] rounded-xl border border-slate-200 bg-white p-0 shadow-lg sm:w-auto">
                    <div className="flex flex-col border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:gap-8 rounded-t-xl">
                        <div className="w-full text-xs">
                            <span className="text-slate-500">Filter by</span>
                            <br />
                            <span className="text-lg font-semibold text-slate-500">{title}</span>
                        </div>
                        <div className="mt-2 flex w-full items-center justify-start sm:mt-0 sm:justify-end">
                            <div className="flex flex-col gap-1 text-[11px]">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-medium uppercase tracking-wider text-slate-400">From:</span>
                                    <span className="font-bold text-slate-500">
                                        {dateRange?.from ? format(dateRange.from, "do MMM yyyy - HH:mm") : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-medium uppercase tracking-wider text-slate-400">To:</span>
                                    <span className="font-bold text-slate-500">
                                        {dateRange?.to ? format(dateRange.to, "do MMM yyyy - HH:mm") : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-4 sm:flex-row">
                        <div className="flex w-full flex-col gap-3 sm:w-[300px] items-center">
                            <DatePicker
                                selectsRange={true}
                                startDate={dateRange.from}
                                endDate={dateRange.to}
                                onChange={handleDateSelect}
                                maxDate={new Date()}
                                inline
                            />
                        </div>

                        <div className="flex w-full flex-col gap-4 border-t border-slate-100 pt-4 sm:w-[180px] sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-400">From Time</label>
                                <CustomTimePicker
                                    date={dateRange.from}
                                    disabled={!dateRange.from}
                                    onChange={(d) => setDateRange(prev => ({ ...prev, from: d }))}
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-slate-400">To Time</label>
                                <CustomTimePicker
                                    date={dateRange.to}
                                    disabled={!dateRange.to}
                                    onChange={(d) => setDateRange(prev => ({ ...prev, to: d }))}
                                />
                            </div>

                            <div className="mt-auto flex flex-col items-center gap-2 pt-4">
                                <button
                                    onClick={handleClear}
                                    className="flex h-8 w-full items-center justify-center rounded-md text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-500 transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="flex h-9 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
