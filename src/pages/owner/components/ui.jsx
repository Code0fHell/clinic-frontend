import React from "react";

export const Card = ({ children, className = "" }) => (
    <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

export const StatCard = ({ title, value, subtitle }) => (
    <Card>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </Card>
);

export const SkeletonBlock = ({ lines = 4 }) => (
    <div className="space-y-2">
        {Array.from({ length: lines }).map((_, idx) => (
            <div key={idx} className="h-3 w-full animate-pulse rounded bg-slate-200" />
        ))}
    </div>
);

export const EmptyState = ({ message = "Không có dữ liệu trong khoảng đã chọn." }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-sm text-slate-600">
        {message}
    </div>
);

export const ProgressBar = ({ value, color = "bg-teal-600" }) => (
    <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
);

