export const TIMEFRAMES = [
    { key: "DAY", label: "Ngày" },
    { key: "WEEK", label: "Tuần" },
    { key: "MONTH", label: "Tháng" },
    { key: "QUARTER", label: "Quý" },
];

export const DATE_PRESETS = [
    { key: "7d", label: "7 ngày" },
    { key: "30d", label: "30 ngày" },
    { key: "quarter", label: "Quý hiện tại" },
];

export const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
