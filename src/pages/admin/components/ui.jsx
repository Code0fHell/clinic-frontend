import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ title, value, subtitle, icon }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {icon && <div className="text-3xl text-slate-400">{icon}</div>}
    </div>
  </Card>
);

export const SkeletonBlock = ({ lines = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, idx) => (
      <div key={idx} className="h-3 w-full animate-pulse rounded bg-slate-200" />
    ))}
  </div>
);

export const EmptyState = ({ message = "Không có dữ liệu." }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-sm text-slate-600">
    {message}
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
  </div>
);

export const Button = ({ children, onClick, variant = "primary", disabled = false, className = "", type = "button" }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-slate-200 text-slate-700 hover:bg-slate-300 active:bg-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

