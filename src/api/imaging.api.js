import axiosClient from "./axiosClient";

// Lấy danh sách chỉ định chẩn đoán hình ảnh cho bác sĩ chẩn đoán
export const getDiagnosticIndications = async () => {
    const res = await axiosClient.get("/imaging/indications");
    return res.data;
};

// Lấy chi tiết chỉ định chẩn đoán hình ảnh
export const getDiagnosticIndicationDetail = async (id) => {
    const res = await axiosClient.get(`/imaging/indications/${id}`);
    return res.data;
};

// Tạo kết quả chẩn đoán hình ảnh (upload ảnh và kết quả)
export const createImageResult = async (formData) => {
    const res = await axiosClient.post("/imaging/xray-result", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// Lấy kết quả chẩn đoán hình ảnh theo bệnh nhân
export const getImageResultsByPatient = async (patientId) => {
    const res = await axiosClient.get(`/imaging/patient/${patientId}/results`);
    return res.data;
};

// Lấy kết quả chẩn đoán hình ảnh theo chỉ định
export const getImageResultsByIndication = async (indicationId) => {
    const res = await axiosClient.get(
        `/imaging/indication/${indicationId}/results`
    );
    return res.data;
};

// Lấy danh sách kết quả đã hoàn thành cho bác sĩ chẩn đoán hình ảnh
export const getCompletedDiagnosticResults = async () => {
    const res = await axiosClient.get("/imaging/completed");
    return res.data;
};

export const getCompletedDiagnosticResultsWithFilter = async (params = {}) => {
    const { filter_type = "all", page = 1, limit = 10 } = params;
    const res = await axiosClient.get("/imaging/query/completed", {
        params: { filter_type, page, limit },
    });
    return res.data;
};

export const getTodayPendingImagingIndications = async () => {
    const res = await axiosClient.get("/imaging/indications/today/pending");
    return res.data;
};
