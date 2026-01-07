import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Card, Button, LoadingSpinner, EmptyState } from "./components/ui";
import Toast from "../../components/modals/Toast";
import { getWeeklySchedule } from "../../api/work-schedule.api";
import { getAllStaff } from "../../api/staff.api";

const WeeklyScheduleOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
    doctor_type: "",
  });
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(new Date()));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAllStaff();
  }, []);

  useEffect(() => {
    fetchWeeklySchedule();
  }, [currentWeek, filters.department, filters.doctor_type]);

  // Lấy danh sách nhân viên để hiển thị đầy đủ
  const fetchAllStaff = async () => {
    try {
      const staffList = await getAllStaff();
      setAllStaff(staffList);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchWeeklySchedule = async () => {
    try {
      setLoading(true);
      const response = await getWeeklySchedule({
        start_date: currentWeek.start,
        end_date: currentWeek.end,
        department: filters.department || undefined,
        doctor_type: filters.doctor_type || undefined,
      });
      setScheduleData(response);
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
      showToast("Lỗi khi tải lịch làm việc!", "error");
    } finally {
      setLoading(false);
    }
  };

  function getWeekDates(date) {
    const curr = new Date(date);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(curr.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
      mondayDate: new Date(monday),
    };
  }

  const getDayOfWeek = (offset) => {
    const date = new Date(currentWeek.mondayDate);
    date.setDate(date.getDate() + offset);
    return date.toISOString().split("T")[0];
  };

  const getScheduleForStaffAndDay = (staffId, dayOffset) => {
    const dayDate = getDayOfWeek(dayOffset);
    const staffData = scheduleData.find((s) => s.staff.id === staffId);
    if (!staffData) return null;
    return staffData.schedules.find((sch) => sch.work_date.split("T")[0] === dayDate);
  };

  const handleCellClick = (staffId, dayOffset) => {
    const dayDate = getDayOfWeek(dayOffset);
    navigate(`/admin/work-schedule/staff-detail?staff_id=${staffId}&date=${dayDate}`);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
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
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Merge staff from schedule data and all staff to ensure everyone is shown
  const displayStaff = React.useMemo(() => {
    const staffMap = new Map();
    
    // Add all staff first
    allStaff.forEach(s => {
      if (s.user && s.user.user_role !== 'PATIENT') {
        staffMap.set(s.id, {
          id: s.id,
          full_name: s.user.full_name || s.user.username,
          department: s.department,
          position: s.position,
          doctor_type: s.doctor_type,
        });
      }
    });

    // Apply filters
    let filtered = Array.from(staffMap.values());
    if (filters.department) {
      filtered = filtered.filter(s => s.department === filters.department);
    }
    if (filters.doctor_type) {
      filtered = filtered.filter(s => s.doctor_type === filters.doctor_type);
    }

    return filtered;
  }, [allStaff, filters]);

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

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
                    Lịch làm việc theo tuần
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Xem và quản lý lịch làm việc của nhân viên
                  </p>
                </div>
                <Button onClick={() => navigate("/admin/work-schedule/create")}>
                  ➕ Tạo lịch làm việc
                </Button>
              </div>

              {/* Toast removed from inline position - now floating */}

              {/* Filters */}
              <Card>
                <div className="space-y-4">
                  {/* Week Picker */}
                  <div className="flex items-center gap-4">
                    <Button onClick={previousWeek} variant="secondary">
                      ← Tuần trước
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-lg font-semibold text-slate-700">
                        {formatDate(currentWeek.start)} → {formatDate(currentWeek.end)}
                      </span>
                    </div>
                    <Button onClick={nextWeek} variant="secondary">
                      Tuần sau →
                    </Button>
                  </div>

                  {/* Department & Doctor Type Filters */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Khoa/Phòng
                      </label>
                      <select
                        value={filters.department}
                        onChange={(e) =>
                          setFilters({ ...filters, department: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="Nội khoa">Nội khoa</option>
                        <option value="Ngoại khoa">Ngoại khoa</option>
                        <option value="Nhi khoa">Nhi khoa</option>
                        <option value="Sản khoa">Sản khoa</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Loại bác sĩ
                      </label>
                      <select
                        value={filters.doctor_type}
                        onChange={(e) =>
                          setFilters({ ...filters, doctor_type: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="CLINICAL">Lâm sàng</option>
                        <option value="DIAGNOSTIC">Chẩn đoán</option>
                        <option value="TEST">Xét nghiệm</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Schedule Table */}
              <Card>
                {loading ? (
                  <LoadingSpinner />
                ) : displayStaff.length === 0 ? (
                  <EmptyState message="Không có nhân viên nào." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-300">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50 sticky left-0 z-10 min-w-[200px]">
                            Nhân viên
                          </th>
                          {weekDays.map((day, index) => (
                            <th
                              key={index}
                              className="text-center py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50 min-w-[120px]"
                            >
                              <div>{day}</div>
                              <div className="text-xs font-normal text-slate-500 mt-1">
                                {formatDate(getDayOfWeek(index))}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayStaff.map((staff) => (
                          <tr
                            key={staff.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4 sticky left-0 bg-white z-10">
                              <div className="text-sm font-medium text-slate-800">
                                {staff.full_name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {staff.department || "-"} • {staff.position || "-"}
                              </div>
                            </td>
                            {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                              const schedule = getScheduleForStaffAndDay(staff.id, dayOffset);
                              return (
                                <td
                                  key={dayOffset}
                                  className="py-3 px-2 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                                  onClick={() => handleCellClick(staff.id, dayOffset)}
                                >
                                  {schedule ? (
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium text-blue-700">
                                        {formatTime(schedule.start_time)} -{" "}
                                        {formatTime(schedule.end_time)}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {schedule.booked_slots}/{schedule.total_slots} đã đặt
                                      </div>
                                      {schedule.booked_slots === schedule.total_slots && (
                                        <div className="text-xs text-red-600 font-medium">
                                          Full
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-slate-400">Off</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default WeeklyScheduleOverview;

