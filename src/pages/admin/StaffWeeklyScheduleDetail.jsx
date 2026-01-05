import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Card, Button, LoadingSpinner, EmptyState, Badge } from "./components/ui";
import {
  getStaffWeeklySchedule,
  copyFromPreviousWeek,
  deleteWorkSchedule,
} from "../../api/work-schedule.api";
import { getAllStaff } from "../../api/staff.api";

const StaffWeeklyScheduleDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(searchParams.get("staff_id") || "");
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "");
  const [currentWeek, setCurrentWeek] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchAllStaff();
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      // Calculate week from selected date or use current date
      const baseDate = selectedDate ? new Date(selectedDate) : new Date();
      setCurrentWeek(getWeekDates(baseDate));
    }
  }, [selectedStaffId, selectedDate]);

  useEffect(() => {
    if (selectedStaffId && currentWeek) {
      fetchStaffWeeklySchedule();
    }
  }, [selectedStaffId, currentWeek]);

  const fetchAllStaff = async () => {
    try {
      const staffList = await getAllStaff();
      setAllStaff(staffList.filter((s) => s.user && s.user.user_role !== "PATIENT"));
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchStaffWeeklySchedule = async () => {
    try {
      setLoading(true);
      const response = await getStaffWeeklySchedule({
        staff_id: selectedStaffId,
        start_date: currentWeek.start,
        end_date: currentWeek.end,
      });
      setScheduleData(response);
    } catch (error) {
      console.error("Error fetching staff weekly schedule:", error);
      showToast("Lỗi khi tải lịch làm việc!");
    } finally {
      setLoading(false);
    }
  };

  function getWeekDates(date) {
    const curr = new Date(date);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
      mondayDate: new Date(monday),
    };
  }

  const handleCopyFromPreviousWeek = async () => {
    if (!selectedStaffId || !currentWeek) return;
    
    const confirm = window.confirm(
      "Bạn có chắc muốn sao chép lịch từ tuần trước? Lịch hiện tại (nếu có) sẽ được giữ nguyên."
    );
    if (!confirm) return;

    try {
      await copyFromPreviousWeek({
        staff_id: selectedStaffId,
        target_week_start: currentWeek.start,
      });
      showToast("Sao chép lịch thành công!");
      fetchStaffWeeklySchedule();
    } catch (error) {
      console.error("Error copying schedule:", error);
      showToast(error.response?.data?.message || "Lỗi khi sao chép lịch!");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    const confirm = window.confirm(
      "Bạn có chắc muốn xóa lịch làm việc này? Lưu ý: Chỉ có thể xóa nếu chưa có slot nào được đặt."
    );
    if (!confirm) return;

    try {
      await deleteWorkSchedule(scheduleId);
      showToast("Xóa lịch thành công!");
      fetchStaffWeeklySchedule();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      showToast(error.response?.data?.message || "Lỗi khi xóa lịch!");
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeek.mondayDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(getWeekDates(newDate));
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek.mondayDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(getWeekDates(newDate));
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDayOfWeek = (offset) => {
    if (!currentWeek) return "";
    const date = new Date(currentWeek.mondayDate);
    date.setDate(date.getDate() + offset);
    return date.toISOString().split("T")[0];
  };

  const getScheduleForDay = (dayOffset) => {
    if (!scheduleData) return null;
    const dayDate = getDayOfWeek(dayOffset);
    return scheduleData.schedules.find((sch) => sch.work_date.split("T")[0] === dayDate);
  };

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

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
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Page Title */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    Lịch làm việc chi tiết
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Xem và quản lý lịch làm việc của từng nhân viên
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate("/admin/work-schedule")}
                    variant="secondary"
                  >
                    ← Quay lại
                  </Button>
                  <Button onClick={handleCopyFromPreviousWeek} variant="success">
                    📋 Sao chép tuần trước
                  </Button>
                  <Button onClick={() => navigate("/admin/work-schedule/create")}>
                    ➕ Tạo lịch mới
                  </Button>
                </div>
              </div>

              {/* Toast */}
              {toast && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                  {toast}
                </div>
              )}

              {/* Staff Selector & Week Picker */}
              <Card>
                <div className="space-y-4">
                  {/* Staff Selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Chọn nhân viên
                    </label>
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {allStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.user.full_name || staff.user.username} -{" "}
                          {staff.department || "N/A"} - {staff.position || "N/A"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Week Picker */}
                  {currentWeek && (
                    <div className="flex items-center gap-4">
                      <Button onClick={previousWeek} variant="secondary">
                        ← Tuần trước
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-lg font-semibold text-slate-700">
                          {currentWeek.start} → {currentWeek.end}
                        </span>
                      </div>
                      <Button onClick={nextWeek} variant="secondary">
                        Tuần sau →
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Weekly Calendar View */}
              {loading ? (
                <Card>
                  <LoadingSpinner />
                </Card>
              ) : !selectedStaffId ? (
                <Card>
                  <EmptyState message="Vui lòng chọn nhân viên để xem lịch làm việc." />
                </Card>
              ) : !scheduleData ? (
                <Card>
                  <EmptyState message="Không có dữ liệu lịch làm việc." />
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {weekDays.map((dayName, dayOffset) => {
                    const schedule = getScheduleForDay(dayOffset);
                    const dayDate = getDayOfWeek(dayOffset);
                    const hasBookedSlots = schedule?.slots?.some((s) => s.is_booked);

                    return (
                      <Card
                        key={dayOffset}
                        className={`${
                          schedule
                            ? "border-2 border-blue-300 bg-blue-50/30"
                            : "border-slate-200"
                        }`}
                      >
                        {/* Day Header */}
                        <div className="border-b border-slate-200 pb-3 mb-3">
                          <div className="text-lg font-bold text-slate-800">
                            {dayName}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {dayDate.split("-").slice(1).join("/")}
                          </div>
                        </div>

                        {/* Schedule Info */}
                        {schedule ? (
                          <div className="space-y-3">
                            {/* Working Time */}
                            <div className="bg-blue-100 rounded-lg p-3">
                              <div className="text-xs font-medium text-blue-800 mb-1">
                                Giờ làm việc
                              </div>
                              <div className="text-sm font-bold text-blue-900">
                                {formatTime(schedule.start_time)} -{" "}
                                {formatTime(schedule.end_time)}
                              </div>
                            </div>

                            {/* Slots */}
                            <div>
                              <div className="text-xs font-medium text-slate-700 mb-2">
                                Danh sách slot ({schedule.slots?.length || 0})
                              </div>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {schedule.slots?.map((slot) => (
                                  <div
                                    key={slot.id}
                                    className={`text-xs p-2 rounded-lg border ${
                                      slot.is_booked
                                        ? "bg-red-50 border-red-200 text-red-700"
                                        : "bg-green-50 border-green-200 text-green-700"
                                    }`}
                                  >
                                    <div className="font-medium">
                                      {formatTime(slot.slot_start)} -{" "}
                                      {formatTime(slot.slot_end)}
                                    </div>
                                    <div className="text-xs mt-1">
                                      {slot.is_booked ? "Đã đặt" : "Còn trống"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 border-t border-slate-200">
                              <Button
                                onClick={() => handleDeleteSchedule(schedule.id)}
                                variant="danger"
                                className="w-full text-xs"
                                disabled={hasBookedSlots}
                              >
                                {hasBookedSlots ? "Có slot đã đặt" : "🗑️ Xóa lịch"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-slate-400 text-sm mb-3">Nghỉ</div>
                            <Button
                              onClick={() =>
                                navigate(
                                  `/admin/work-schedule/create?staff_id=${selectedStaffId}&date=${dayDate}`
                                )
                              }
                              variant="secondary"
                              className="w-full text-xs"
                            >
                              ➕ Thêm lịch
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Staff Info Summary */}
              {scheduleData && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800">
                        {scheduleData.staff.full_name}
                      </h3>
                      <div className="flex gap-3 mt-2">
                        <Badge variant="info">{scheduleData.staff.department || "N/A"}</Badge>
                        <Badge variant="default">{scheduleData.staff.position || "N/A"}</Badge>
                        {scheduleData.staff.doctor_type && (
                          <Badge variant="success">
                            {scheduleData.staff.doctor_type === "CLINICAL"
                              ? "Lâm sàng"
                              : scheduleData.staff.doctor_type === "DIAGNOSTIC"
                              ? "Chẩn đoán"
                              : "Xét nghiệm"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">
                        {scheduleData.schedules.length}/7
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Ngày làm việc trong tuần
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffWeeklyScheduleDetail;

