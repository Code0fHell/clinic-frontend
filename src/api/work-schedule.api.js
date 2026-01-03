import axiosClient from "./axiosClient";

// Tạo work schedule cho một ngày
export const addWorkSchedule = async (data) => {
  const res = await axiosClient.post("/work-schedule", data);
  return res.data;
};

// Tạo work schedule detail (slot)
export const addWorkScheduleDetail = async (data) => {
  const res = await axiosClient.post("/work-schedule/detail", data);
  return res.data;
};

// Lấy lịch làm việc của tất cả nhân viên trong tuần
export const getWeeklySchedule = async ({ start_date, end_date, department, doctor_type }) => {
  const params = { start_date, end_date };
  if (department) params.department = department;
  if (doctor_type) params.doctor_type = doctor_type;
  const res = await axiosClient.get("/work-schedule/weekly", { params });
  return res.data;
};

// Lấy lịch làm việc chi tiết của một nhân viên trong tuần
export const getStaffWeeklySchedule = async ({ staff_id, start_date, end_date }) => {
  const params = { staff_id, start_date, end_date };
  const res = await axiosClient.get("/work-schedule/staff-weekly", { params });
  return res.data;
};

// Tạo lịch làm việc cho cả tuần với auto-generated slots
export const createWeeklySchedule = async (data) => {
  const res = await axiosClient.post("/work-schedule/create-weekly", data);
  return res.data;
};

// Sao chép lịch từ tuần trước
export const copyFromPreviousWeek = async ({ staff_id, target_week_start }) => {
  const params = { staff_id, target_week_start };
  const res = await axiosClient.post("/work-schedule/copy-previous-week", null, { params });
  return res.data;
};

// Cập nhật work schedule
export const updateWorkSchedule = async (id, data) => {
  const res = await axiosClient.put(`/work-schedule/${id}`, data);
  return res.data;
};

// Xóa work schedule
export const deleteWorkSchedule = async (id) => {
  const res = await axiosClient.delete(`/work-schedule/${id}`);
  return res.data;
};

