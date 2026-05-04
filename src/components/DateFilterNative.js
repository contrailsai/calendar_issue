"use client"

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export function DateFilterNative({ title, onApply, initialFrom, initialTo }) {
    const [open, setOpen] = useState(false);
    
    // For native inputs, working with ISO string format YYYY-MM-DD and HH:mm is easiest
    const [dateRange, setDateRange] = useState({
        from: initialFrom ? new Date(initialFrom) : undefined,
        to: initialTo ? new Date(initialTo) : undefined,
    });
    
    const [appliedRange, setAppliedRange] = useState({
        from: initialFrom ? new Date(initialFrom) : undefined,
        to: initialTo ? new Date(initialTo) : undefined,
    });

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

    // Helper to get YYYY-MM-DD
    const getDateString = (date) => {
        if (!date) return '';
        return format(date, 'yyyy-MM-dd');
    };

    // Helper to get HH:mm
    const getTimeString = (date) => {
        if (!date) return '';
        return format(date, 'HH:mm');
    };

    const handleDateChange = (type, val) => {
        if (!val) return;
        setDateRange(prev => {
            const newDate = parseISO(val);
            const currentTarget = prev[type];
            if (currentTarget) {
                newDate.setHours(currentTarget.getHours(), currentTarget.getMinutes(), 0, 0);
            } else if (type === 'to') {
                newDate.setHours(23, 30, 0, 0);
            }
            return { ...prev, [type]: newDate };
        });
    };

    const handleTimeChange = (type, val) => {
        if (!val || !dateRange[type]) return;
        const [h, m] = val.split(':').map(Number);
        setDateRange(prev => {
            const updated = new Date(prev[type]);
            updated.setHours(h, m, 0, 0);
            return { ...prev, [type]: updated };
        });
    };

    return (
        <div className="relative w-full">
            <button 
                type="button"
                onClick={() => setOpen(!open)}
                className="flex h-9 w-full items-center justify-start rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-normal shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-950"
            >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
                {appliedRange?.from ? (
                    appliedRange.to ? (
                        <span className="truncate text-slate-900">
                            {format(appliedRange.from, "LLL dd")} - {format(appliedRange.to, "LLL dd")}
                        </span>
                    ) : (
                        <span className="truncate text-slate-900">{format(appliedRange.from, "LLL dd, y")}</span>
                    )
                ) : (
                    <span className="truncate text-slate-500">{title}</span>
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-[400px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:w-auto">
                    <div className="mb-4">
                        <span className="text-lg font-semibold text-slate-900">{title}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* FROM SECTION */}
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                            <span className="mb-2 block text-xs font-bold uppercase text-slate-500">Start Date & Time</span>
                            <div className="flex gap-2">
                                <input 
                                    type="date" 
                                    value={getDateString(dateRange.from)}
                                    onChange={(e) => handleDateChange('from', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                />
                                <input 
                                    type="time" 
                                    value={getTimeString(dateRange.from)}
                                    disabled={!dateRange.from}
                                    onChange={(e) => handleTimeChange('from', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* TO SECTION */}
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                            <span className="mb-2 block text-xs font-bold uppercase text-slate-500">End Date & Time</span>
                            <div className="flex gap-2">
                                <input 
                                    type="date" 
                                    value={getDateString(dateRange.to)}
                                    onChange={(e) => handleDateChange('to', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                />
                                <input 
                                    type="time" 
                                    value={getTimeString(dateRange.to)}
                                    disabled={!dateRange.to}
                                    onChange={(e) => handleTimeChange('to', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={handleClear}
                                className="flex h-9 w-full items-center justify-center rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
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
            )}
        </div>
    );
}
