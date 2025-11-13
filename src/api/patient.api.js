import axiosClient from "./axiosClient";

// Lấy ra tất cả bệnh nhân
export const getAllPatient = async () => {
    try {
        const res = await axiosClient.get("/patient/all-patient");
        return res.data.data;
    } catch (err) {
        console.error("Lỗi khi lấy bệnh nhân:", err.response?.data || err);
        return [];
    }
}

// Tạo mới bệnh nhân khi bệnh nhân chưa có tài khoản và lần đầu đến khám
export const createPatient = async (data) => {
    try {
        const res = await axiosClient.post("/patient/create", data);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi khi lấy bệnh nhân:", err.response?.data || err);
        throw err;
    }
}

// Lấy dữ liệu bác sĩ trống lịch để tạo visit cho bệnh nhân chưa có appointment
export const getAvailableDoctorToday = async () => {
    try {
        const res = await axiosClient.get("/patient/doctor-available-today");
        return res.data;
    } catch (err) {
        console.error("Lỗi khi khi lấy bác sĩ:", err.response?.data || err);
        return [];
    }
}