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

// Lấy các khung giờ trống trong lịch làm việc
export const getAvailableSlots = async (scheduleId) => {
  const res = await axiosClient.get(`/appointment/work-schedule/${scheduleId}/slots`);
  return res.data;
};

// Đặt lịch khám (bệnh nhân đã đăng nhập)
export const bookAppointment = async (dto) => {
  const res = await axiosClient.post("/appointment/book", dto);
  return res.data;
};

// Đặt lịch khám (khách chưa đăng nhập)
export const guestBookAppointment = async (dto) => {
  const res = await axiosClient.post("/appointment/guest-book", dto);
  return res.data;
};

// Lấy danh sách lịch hẹn hôm nay
export const getTodayAppointments = async () => {
  const res = await axiosClient.get("/appointment/today");
  return res.data;
};

// Lấy tất cả lịch hẹn
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/appointment/all");
  return res.data;
};

// Lấy lịch hẹn trong tuần
export const getAppointmentsThisWeek = async () => {
  const res = await axiosClient.get("/appointment/week");
  return res.data;
};

export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  const res = await axiosClient.put(`/appointment/${appointmentId}/status`, {
    appointment_status: newStatus,
  });
  return res.data;
};

