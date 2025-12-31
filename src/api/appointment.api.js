import axiosClient from "./axiosClient";

// Lấy danh sách bác sĩ lâm sàng
export const getClinicalDoctors = async () => {
  const res = await axiosClient.get("/staff/clinical-doctors");
  return res.data;
};

// Lấy lịch làm việc của bác sĩ
export const getWorkSchedules = async (doctorId) => {
  const res = await axiosClient.get(`/staff/${doctorId}/work-schedules`);
  return res.data;
};

// Lấy các slot trống
export const getAvailableSlots = async (scheduleId) => {
  const res = await axiosClient.get(`/appointment/work-schedule/${scheduleId}/slots`);
  return res.data;
};

// Đặt lịch (đã đăng nhập) — interceptor tự gắn token
export const bookAppointment = async (dto) => {
  const res = await axiosClient.post("/appointment/book", dto);
  return res.data;
};

// Đặt lịch (khách)
export const guestBookAppointment = async (dto) => {
  const res = await axiosClient.post("/appointment/guest-book", dto);
  return res.data;
};

// DS lịch hôm nay, lọc, phân trang, tìm kiếm
export const getTodayAppointments = async ({
  date = "",        // dd/MM/yyyy
  keyword = "",
  visitFilter = 'all',
  page = 1,
  limit = 10,
} = {}) => {
  try {
    const res = await axiosClient.get('/appointment/today', {
      params: {
        date,
        visitFilter,
        keyword,
        page,
        limit
      },
    });

    return res.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy danh sách lịch hẹn:",
      err.response?.data || err.message
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


// Tất cả lịch hẹn
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/appointment/all");
  return res.data;
};

// Lịch hẹn của bệnh nhân hiện tại
export const getMyAppointments = async () => {
  const res = await axiosClient.get("/appointment/my");
  return res.data;
};

// Lịch hẹn trong tuần
export const getAppointmentsThisWeek = async () => {
  const res = await axiosClient.get("/appointment/week");
  return res.data;
};

// Update trạng thái lịch hẹn
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  const res = await axiosClient.put(`/appointment/${appointmentId}/status`, {
    appointment_status: newStatus,
  });
  return res.data;
};

// Bệnh nhân hủy lịch hẹn của chính mình
export const cancelMyAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/appointment/${appointmentId}/cancel`);
  return res.data;
};
