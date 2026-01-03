import axiosClient from "./axiosClient";

// Tạo kết quả xét nghiệm mới
export const createLabTestResult = async (dto) => {
  const res = await axiosClient.post("/lab-test-result", dto);
  return res.data;
};

// Lấy kết quả xét nghiệm theo bệnh nhân
export const getLabTestResultsByPatient = async (patientId) => {
  const res = await axiosClient.get(`/lab-test-result/patient/${patientId}`);
  return res.data;
};

// Lấy kết quả xét nghiệm theo phiếu chỉ định
export const getLabTestResultsByIndication = async (indicationId) => {
  const res = await axiosClient.get(`/lab-test-result/indication/${indicationId}`);
  return res.data;
};

// Lấy danh sách kết quả xét nghiệm đã hoàn thành hôm nay
export const getTodayCompletedResults = async () => {
  const res = await axiosClient.get("/lab-test-result/today/completed");
  return res.data;
};

// Lấy danh sách kết quả xét nghiệm đã hoàn thành với filter và pagination
export const getCompletedResultsWithFilter = async (params = {}) => {
  const { filter_type = "all", page = 1, limit = 10 } = params;
  const res = await axiosClient.get("/lab-test-result/completed", {
    params: {
      filter_type,
      page,
      limit,
    },
  });
  return res.data;
};

