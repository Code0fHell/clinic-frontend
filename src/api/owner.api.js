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

//Lấy lịch làm việc của lễ tân, dược sĩ, bác sĩ
export const getWeeklyScheduleOwner = async ({
    start_date,
    roleType = "all",
    cursor = null,
    limit = 10,
    search = undefined,
} = {}) => {
    try {
        const params = {
            start_date, // YYYY-MM-DD
            roleType,
            limit,
        };

        // chỉ gửi cursor khi load page tiếp theo
        if (cursor !== null && cursor !== undefined) {
            params.cursor = cursor;
        }

        if (search !== undefined && search !== null && String(search).trim() !== '') {
            params.search = String(search).trim();
        }

        const res = await axiosClient.get("/owner/weekly", { params });

        return {
            data: res.data.data || [],
            nextCursor: res.data.nextCursor ?? null,
        };
    } catch (err) {
        console.error(
            "Lỗi khi lấy lịch làm việc tuần:",
            err.response?.data || err.message
        );

        return {
            data: [],
            nextCursor: null,
        };
    }
};

// Lấy chi tiết lịch làm việc của bác sĩ trong 1 ngày
export const getDoctorDailySchedule = async (scheduleId) => {
    try {
        const res = await axiosClient.get(`/owner/work-schedules/${scheduleId}`);

        return {
            data: res.data || [],
        };
    } catch (err) {
        console.error(
            "Lỗi khi lấy chi tiết lịch làm việc của bác sĩ trong 1 ngày:",
            err.response?.data || err.message
        );

        return {
            data: []
        };
    }
};

// Xuất excel bảng chi tiết doanh thu
export const exportRevenueExcel = async ({
    startDate,
    endDate,
    timeframe,
}) => {
    const res = await axiosClient.get('/owner/export/revenue-detail', {
        params: {
            start: startDate,   // YYYY-MM-DD
            end: endDate,       // YYYY-MM-DD
            timeframe,          // DAY | WEEK | MONTH | QUARTER
        },
        responseType: 'blob',
    });

    // Tạo file download
    const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `doanh_thu_${timeframe}_${startDate}_den_${endDate}_${today}.xlsx`;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

// Lấy số lượng bán theo thuốc trong khoảng thời gian (FE gọi endpoint BE)
export const getMedicineSales = async ({ startDate, endDate } = {}) => {
    try {
        const res = await axiosClient.get('/owner/medicine-sales', {
            params: {
                startDate,
                endDate,
            },
        });

        return res.data.data || [];
    } catch (err) {
        console.error('Lỗi khi lấy số lượng bán theo thuốc:', err.response?.data || err);
        return [];
    }
};


