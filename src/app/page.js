"use client"
import { DateFilterPopover } from "@/components/DateFilterPopover";
import { DateFilterPopoverFixed } from "@/components/DateFilterPopoverFixed";
import { DateFilterReactCalendar } from "@/components/DateFilterReactCalendar";
import { DateFilterReactDatepicker } from "@/components/DateFilterReactDatepicker";
import { DateFilterNative } from "@/components/DateFilterNative";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans p-8 overflow-y-auto">
      <main className="flex flex-col items-center w-full max-w-2xl gap-8 py-10 px-4 text-black">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Calendar Alternatives</h1>
          <p className="text-zinc-600">Testing different libraries to resolve clickability issues.</p>
        </div>
        
        {/* Variation 1: Original Radix + React Day Picker */}
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 relative z-50">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">1. Original </h2>
          <DateFilterPopover 
            title="Select Date Range" 
            onApply={(range) => console.log("Applied Original:", range)} 
          />
        </div>

        {/* Variation 1.5: FIXED Radix + React Day Picker */}
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 relative z-40">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">1.5 FIXED (potentially)</h2>
          <p className="text-xs text-slate-500 mb-2">Uses useMemo + endOfDay for disabled prop, and handles activeModifiers.</p>
          <DateFilterPopoverFixed 
            title="Select Date Range" 
            onApply={(range) => console.log("Applied Fixed:", range)} 
          />
        </div>

        {/* Variation 2: React Calendar */}
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 relative z-30">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">2. Alternative </h2>
          <DateFilterReactCalendar 
            title="Select Date Range" 
            onApply={(range) => console.log("Applied react-calendar:", range)} 
          />
        </div>

        {/* Variation 3: React Datepicker */}
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 relative z-20">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">3. Alternative </h2>
          <DateFilterReactDatepicker 
            title="Select Date Range" 
            onApply={(range) => console.log("Applied react-datepicker:", range)} 
          />
        </div>

        {/* Variation 4: Native Inputs */}
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2 relative z-10">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">4. Alternative </h2>
          <DateFilterNative 
            title="Select Date Range" 
            onApply={(range) => console.log("Applied Native:", range)} 
          />
        </div>

      </main>
    </div>
  );
}
