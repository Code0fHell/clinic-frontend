import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Card, Button, LoadingSpinner } from "./components/ui";
import { createWeeklySchedule } from "../../api/work-schedule.api";
import { getAllStaff } from "../../api/staff.api";

const CreateWorkSchedule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    staff_id: searchParams.get("staff_id") || "",
    working_days: [],
    start_time: "08:00",
    end_time: "17:00",
    slot_duration: 30,
  });

  useEffect(() => {
    fetchAllStaff();
    // If date is provided in query params, pre-select that day
    const preSelectedDate = searchParams.get("date");
    if (preSelectedDate) {
      const date = new Date(preSelectedDate);
      const dayOfWeek = date.getDay();
      const dayMap = {
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
        0: "sunday",
      };
      if (dayMap[dayOfWeek]) {
        setFormData((prev) => ({
          ...prev,
          working_days: [dayMap[dayOfWeek]],
        }));
      }
    }
  }, []);

  const fetchAllStaff = async () => {
    try {
      const staffList = await getAllStaff();
      setAllStaff(staffList.filter((s) => s.user && s.user.user_role !== "PATIENT"));
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.staff_id) {
      newErrors.staff_id = "Vui lòng chọn nhân viên";
    }

    if (formData.working_days.length === 0) {
      newErrors.working_days = "Vui lòng chọn ít nhất một ngày làm việc";
    }

    if (!formData.start_time || !formData.end_time) {
      newErrors.time = "Vui lòng nhập đầy đủ giờ làm việc";
    }

    if (formData.start_time >= formData.end_time) {
      newErrors.time = "Giờ kết thúc phải sau giờ bắt đầu";
    }

    if (formData.slot_duration < 15 || formData.slot_duration > 120) {
      newErrors.slot_duration = "Thời lượng slot phải từ 15 đến 120 phút";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Vui lòng kiểm tra lại thông tin!", "error");
      return;
    }

    try {
      setLoading(true);

      // Calculate the dates for selected days of the week
      const currentWeek = getCurrentWeekDates();
      const dayMapping = {
        monday: 0,
        tuesday: 1,
        wednesday: 2,
        thursday: 3,
        friday: 4,
        saturday: 5,
        sunday: 6,
      };

      const working_dates = formData.working_days.map((day) => {
        const offset = dayMapping[day];
        const date = new Date(currentWeek.monday);
        date.setDate(date.getDate() + offset);
        return date.toISOString().split("T")[0];
      });

      const payload = {
        staff_id: formData.staff_id,
        working_dates,
        start_time: formData.start_time,
        end_time: formData.end_time,
        slot_duration: parseInt(formData.slot_duration),
      };

      await createWeeklySchedule(payload);
      showToast("Tạo lịch làm việc thành công!");
      setTimeout(() => {
        navigate(`/admin/work-schedule/staff-detail?staff_id=${formData.staff_id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating schedule:", error);
      showToast(error.response?.data?.message || "Lỗi khi tạo lịch làm việc!", "error");
    } finally {
      setLoading(false);
    }
  };

  function getCurrentWeekDates() {
    const curr = new Date();
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));
    return { monday };
  }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(""), 3000);
  };

  const weekDays = [
    { id: "monday", label: "Thứ 2" },
    { id: "tuesday", label: "Thứ 3" },
    { id: "wednesday", label: "Thứ 4" },
    { id: "thursday", label: "Thứ 5" },
    { id: "friday", label: "Thứ 6" },
    { id: "saturday", label: "Thứ 7" },
    { id: "sunday", label: "Chủ nhật" },
  ];

  // Calculate preview slots
  const calculateSlots = () => {
    if (!formData.start_time || !formData.end_time || !formData.slot_duration) {
      return [];
    }

    const [startHour, startMin] = formData.start_time.split(":").map(Number);
    const [endHour, endMin] = formData.end_time.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = parseInt(formData.slot_duration);

    const slots = [];
    let current = startMinutes;

    while (current + duration <= endMinutes) {
      const slotStartHour = Math.floor(current / 60);
      const slotStartMin = current % 60;
      const slotEndHour = Math.floor((current + duration) / 60);
      const slotEndMin = (current + duration) % 60;

      slots.push({
        start: `${String(slotStartHour).padStart(2, "0")}:${String(slotStartMin).padStart(2, "0")}`,
        end: `${String(slotEndHour).padStart(2, "0")}:${String(slotEndMin).padStart(2, "0")}`,
      });

      current += duration;
    }

    return slots;
  };

  const previewSlots = calculateSlots();

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <Header />
      </div>

      <div className="flex flex-1 pt-16 overflow-y-auto">
        {/* Sidebar */}
        <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
          <SideBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-24 flex flex-col">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
            <div className="mx-auto max-w-5xl space-y-6">
              {/* Page Title */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    Tạo lịch làm việc
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Tạo lịch làm việc nhanh chóng cho nhân viên
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/admin/work-schedule")}
                  variant="secondary"
                >
                  ← Quay lại
                </Button>
              </div>

              {/* Toast */}
              {toast && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${
                    toast.type === "error"
                      ? "border-red-100 bg-red-50 text-red-700"
                      : "border-emerald-100 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {toast.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Staff Selection */}
                <Card>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    1. Chọn nhân viên
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nhân viên <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.staff_id}
                      onChange={(e) =>
                        setFormData({ ...formData, staff_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {allStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.user.full_name || staff.user.username} -{" "}
                          {staff.department || "N/A"} - {staff.position || "N/A"}
                        </option>
                      ))}
                    </select>
                    {errors.staff_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.staff_id}</p>
                    )}
                  </div>
                </Card>

                {/* Working Days Selection */}
                <Card>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    2. Chọn ngày làm việc trong tuần
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                    {weekDays.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleDayToggle(day.id)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          formData.working_days.includes(day.id)
                            ? "bg-blue-600 text-white shadow-lg scale-105"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.working_days && (
                    <p className="text-red-500 text-sm mt-2">{errors.working_days}</p>
                  )}
                  {formData.working_days.length > 0 && (
                    <p className="text-sm text-slate-600 mt-3">
                      Đã chọn: {formData.working_days.length} ngày
                    </p>
                  )}
                </Card>

                {/* Working Time */}
                <Card>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    3. Thiết lập giờ làm việc
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Giờ bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) =>
                          setFormData({ ...formData, start_time: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Giờ kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({ ...formData, end_time: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Thời lượng slot (phút) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="120"
                        step="5"
                        value={formData.slot_duration}
                        onChange={(e) =>
                          setFormData({ ...formData, slot_duration: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-2">{errors.time}</p>
                  )}
                  {errors.slot_duration && (
                    <p className="text-red-500 text-sm mt-2">{errors.slot_duration}</p>
                  )}
                </Card>

                {/* Preview */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    📅 Xem trước lịch làm việc
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-slate-600 mb-2">
                        <strong>Tổng số slot mỗi ngày:</strong> {previewSlots.length} slot
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        <strong>Tổng số ngày làm việc:</strong>{" "}
                        {formData.working_days.length} ngày
                      </div>
                      <div className="text-sm text-slate-600">
                        <strong>Tổng số slot trong tuần:</strong>{" "}
                        {previewSlots.length * formData.working_days.length} slot
                      </div>
                    </div>

                    {previewSlots.length > 0 && (
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm font-medium text-slate-700 mb-2">
                          Danh sách slot mẫu:
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                          {previewSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg"
                            >
                              {slot.start} - {slot.end}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    onClick={() => navigate("/admin/work-schedule")}
                    variant="secondary"
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : "✅ Tạo lịch làm việc"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateWorkSchedule;

