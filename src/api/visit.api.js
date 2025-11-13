import axiosClient from "./axiosClient";

// Tạo phiếu thăm khám
export const createVisit = async (data) => {
    try {
        const res = await axiosClient.post("/visit/create", data);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tạo visit:", err.response?.data || err);
        throw err;
    }
};

// Lấy danh sách thăm khám trong ngày
export const getTodayVisit = async () => {
    try {
        const res = await axiosClient.get("/visit/queue");
        return res.data;
    } catch (err) {
        console.error("Lỗi khi khi lấy Visit:", err.response?.data || err);
        return [];
    }
}

// Lấy chi tiết Visit để tạo bill
export const getDetailVisit = async (visitId) => {
    try {
        const res = await axiosClient.get(`/visit/${visitId}`, {});
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy visit:', error.response?.data || error.message);
        throw error;
    }
}
// Lấy danh sách bệnh nhân trong hàng chờ khám hôm nay
export const getTodayVisitQueue = async () => {
  const res = await axiosClient.get("/visit/queue");
  return res.data;
};

// Cập nhật trạng thái của visit (ví dụ: khi "Bắt đầu khám")
export const updateVisitStatus = async (visitId, newStatus) => {
  const res = await axiosClient.put(`/visit/${visitId}/status`, {
    visit_status: newStatus,
  });
  return res.data;
};
