import axiosClient from "./axiosClient";

// Lấy ra danh sách bệnh nhân, tìm kiếm
export const getAllPatient = async ({
    visitFilter = 'all',
    keyword = "",
    page = 1,
    limit = 10
} = {}) => {
    try {
        const res = await axiosClient.get("/patient/all-patient", {
            params: {
                visitFilter,
                keyword,
                page,
                limit
            },
        });

        return res.data;
    } catch (err) {
        console.error(
            "Lỗi khi lấy danh sách bệnh nhân:",
            err.response?.data || err
        );
        return {
            data: [],
            pagination: {
                total: 0,
                page,
                limit,
                offset: 0,
                totalPages: 0
            },
        };
    }
};

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

export const updatePatientVitals = async (patientId, payload) => {
    const res = await axiosClient.patch(`/patient/${patientId}/vitals`, payload);
    return res.data;
};

// Xuất excel
export const exportPatientExcel = async ({
    visitFilter = 'all',
    keyword = ""
} = {}) => {
    const res = await axiosClient.get('/patient/export-excel', {
        params: {
            keyword,
            visitFilter,
        },
        responseType: 'blob',
    });

    // Tạo file download
    const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    if (visitFilter === 'all') link.download = `danh_sach_benh_nhan_${new Date().toISOString().slice(0, 10)}.xlsx`;
    if (visitFilter === 'added') link.download = `danh_sach_benh_nhan_da_them_${new Date().toISOString().slice(0, 10)}.xlsx`;
    if (visitFilter === 'not_added') link.download = `danh_sach_benh_nhan_chua_them_${new Date().toISOString().slice(0, 10)}.xlsx`;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};


