import axiosClient from "./axiosClient";

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

// Tạo phiếu thăm khám
export const createVisit = async (dto) => {
    const res = await axiosClient.post("/visit/create", dto);
    return res.data;
};
