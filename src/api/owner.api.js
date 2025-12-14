import axiosClient from "./axiosClient";

// Lấy doanh thu và có thể lọc theo thời gian
export const getRevenue = async ({ startDate, endDate, timeframe = "DAY" }) => {
    try {
        const res = await axiosClient.get("/owner/revenue", {
            params: {
                startDate,
                endDate,
                timeframe,
            },
        });

        return res.data.data;
    } catch (err) {
        console.error("Lỗi khi lấy doanh thu:", err.response?.data || err);
        return [];
    }
};

// Lấy dữ liệu cho div doanh thu theo nhóm (Khám bệnh & thuốc)
export const getRevenueService_Breakdown = async () => {
    try {
        const res = await axiosClient.get("/owner/service-breakdown");

        return res.data.data;
    } catch (err) {
        console.error("Lỗi khi lấy doanh thu theo nhóm:", err.response?.data || err);
        return [];
    }
}

