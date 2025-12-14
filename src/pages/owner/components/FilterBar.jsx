import React from "react";
import { Card } from "./ui";
import { DATE_PRESETS, TIMEFRAMES } from "../ownerConstants";

const FilterBar = ({
    startDate,
    endDate,
    onChangeStart,
    onChangeEnd,
    timeframe,
    onTimeframeChange,
    onPreset,
    onExportPDF,
    onManualDateChange,
}) => (
    <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="mt-1 text-3xl font-bold text-gray-700">Quản lý doanh thu & lượt khám</h1>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            onChangeStart(e.target.value);
                            onManualDateChange();
                        }}
                        className="hover:cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                    />
                    <span className="text-sm text-slate-500">→</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            onChangeEnd(e.target.value);
                            onManualDateChange();
                        }}
                        className="hover:cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                    />
                    {DATE_PRESETS.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => onPreset(p.key)}
                            className="hover:cursor-pointer rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {TIMEFRAMES.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => onTimeframeChange(item.key)}
                            className={`hover:cursor-pointer rounded-full px-3 py-2 text-xs font-semibold transition ${timeframe === item.key
                                ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-teal-700"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className="mx-2 h-6 w-px bg-slate-200" />
                    <button
                        onClick={onExportPDF}
                        className="hover:cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                        Xuất PDF doanh thu
                    </button>
                </div>
            </div>
        </div>
    </Card>
);

export default FilterBar;

