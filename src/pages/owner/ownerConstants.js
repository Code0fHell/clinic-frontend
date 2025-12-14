// Constants and helpers for the Owner dashboard

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


// export const MOCK_REVENUE = {
//     day: [
//         { label: "01/12", revenueClinic: 68_000_000, revenuePharma: 42_000_000, visits: 46 },
//         { label: "02/12", revenueClinic: 72_500_000, revenuePharma: 48_800_000, visits: 52 },
//         { label: "03/12", revenueClinic: 61_200_000, revenuePharma: 38_400_000, visits: 40 },
//         { label: "04/12", revenueClinic: 82_000_000, revenuePharma: 55_500_000, visits: 60 },
//         { label: "05/12", revenueClinic: 93_500_000, revenuePharma: 63_200_000, visits: 66 },
//         { label: "06/12", revenueClinic: 55_400_000, revenuePharma: 34_600_000, visits: 36 },
//         { label: "07/12", revenueClinic: 48_000_000, revenuePharma: 28_800_000, visits: 28 },
//         { label: "08/12", revenueClinic: 75_200_000, revenuePharma: 52_300_000, visits: 58 },
//         { label: "09/12", revenueClinic: 88_600_000, revenuePharma: 61_400_000, visits: 64 },
//         { label: "10/12", revenueClinic: 92_300_000, revenuePharma: 65_800_000, visits: 68 },
//         { label: "11/12", revenueClinic: 78_400_000, revenuePharma: 54_200_000, visits: 55 },
//     ],
//     week: [
//         { label: "T2", revenueClinic: 68_000_000, revenuePharma: 42_000_000, visits: 46 },
//         { label: "T3", revenueClinic: 72_500_000, revenuePharma: 48_800_000, visits: 52 },
//         { label: "T4", revenueClinic: 61_200_000, revenuePharma: 38_400_000, visits: 40 },
//         { label: "T5", revenueClinic: 82_000_000, revenuePharma: 55_500_000, visits: 60 },
//         { label: "T6", revenueClinic: 93_500_000, revenuePharma: 63_200_000, visits: 66 },
//         { label: "T7", revenueClinic: 55_400_000, revenuePharma: 34_600_000, visits: 36 },
//         { label: "CN", revenueClinic: 48_000_000, revenuePharma: 28_800_000, visits: 28 },
//     ],
//     month: [
//         { label: "Tuần 1", revenueClinic: 245_000_000, revenuePharma: 180_000_000, visits: 190 },
//         { label: "Tuần 2", revenueClinic: 268_000_000, revenuePharma: 205_000_000, visits: 210 },
//         { label: "Tuần 3", revenueClinic: 255_000_000, revenuePharma: 195_000_000, visits: 202 },
//         { label: "Tuần 4", revenueClinic: 292_000_000, revenuePharma: 230_000_000, visits: 225 },
//     ],
//     quarter: [
//         { label: "Tháng 1", revenueClinic: 920_000_000, revenuePharma: 680_000_000, visits: 720 },
//         { label: "Tháng 2", revenueClinic: 860_000_000, revenuePharma: 640_000_000, visits: 690 },
//         { label: "Tháng 3", revenueClinic: 1_010_000_000, revenuePharma: 720_000_000, visits: 760 },
//     ],
// };

// export const SERVICE_BREAKDOWN = [
//     { name: "Khám bệnh", revenue: 1_050_000_000, visits: 1_120 },
//     { name: "Cận lâm sàng", revenue: 420_000_000, visits: 540 },
//     { name: "Bán thuốc", revenue: 850_000_000, visits: 1_340 },
// ];