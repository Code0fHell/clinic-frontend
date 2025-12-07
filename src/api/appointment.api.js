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

// DS lịch hôm nay
export const getTodayAppointments = async () => {
  const res = await axiosClient.get("/appointment/today");
  return res.data;
};

// Tất cả lịch hẹn
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/appointment/all");
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
