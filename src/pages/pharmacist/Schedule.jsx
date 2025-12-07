import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { getWorkSchedules } from "../../api/appointment.api";
import useAuth from "../../hooks/useAuth";
import Toast from "../../components/modals/Toast";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function PharmacistSchedule() {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staffId, setStaffId] = useState(null);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        // Try to get staff ID from user object or fetch it
        // For now, we'll need to get it from profile or create an API
        // Assuming user.staff_id exists or we need to fetch it
        if (user) {
            fetchStaffId();
        }
    }, [user]);

    useEffect(() => {
        if (staffId) {
            fetchSchedules();
        }
    }, [staffId]);

    const fetchStaffId = async () => {
        try {
            // Try to get staff ID from user object first
            let id = user?.staff_id || user?.staff?.id;
            
            // If not available, try to fetch from profile
            if (!id && user) {
                const { getUserProfile } = await import("../../api/profile.api");
                const profile = await getUserProfile();
                id = profile?.staff?.id || profile?.staff_id;
            }
            
            if (id) {
                setStaffId(id);
            } else {
                showToast("Không tìm thấy thông tin nhân viên. Vui lòng liên hệ quản trị viên.", "error");
                setLoading(false);
            }
        } catch (err) {
            console.error("Lỗi khi lấy thông tin nhân viên:", err);
            showToast("Không thể lấy thông tin nhân viên", "error");
            setLoading(false);
        }
    };

    const fetchSchedules = async () => {
        if (!staffId) return;
        try {
            setLoading(true);
            const res = await getWorkSchedules(staffId);
            const data = Array.isArray(res) ? res : res?.data || [];
            setSchedules(data);
        } catch (err) {
            console.error("Lỗi khi tải lịch làm việc:", err);
            showToast("Không thể tải lịch làm việc", "error");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const groupSchedulesByDate = (schedules) => {
        const grouped = {};
        schedules.forEach((schedule) => {
            const date = new Date(schedule.work_date).toLocaleDateString("vi-VN");
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(schedule);
        });
        return grouped;
    };

    const groupedSchedules = groupSchedulesByDate(schedules);
    const sortedDates = Object.keys(groupedSchedules).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-20 overflow-hidden">
                {/* Sidebar */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-6">
                    <div className="flex-1 p-6 mt-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-700">Lịch làm việc</h2>
                            <button
                                onClick={fetchSchedules}
                                className="bg-[#008080] hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                Làm mới
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500 text-xl">
                                Đang tải lịch làm việc...
                            </div>
                        ) : !staffId ? (
                            <div className="text-center py-10 text-red-500 text-xl">
                                Không tìm thấy thông tin nhân viên
                            </div>
                        ) : schedules.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 text-xl">
                                Chưa có lịch làm việc nào được thiết lập
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                {sortedDates.map((date) => (
                                    <div key={date} className="mb-6">
                                        <div className="bg-[#008080] text-white px-6 py-3 rounded-t-lg font-semibold text-lg">
                                            <Calendar className="inline mr-2" size={20} />
                                            {date}
                                        </div>
                                        <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                                            {groupedSchedules[date].map((schedule) => (
                                                <div
                                                    key={schedule.id}
                                                    className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50 transition"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Clock size={18} className="text-gray-500" />
                                                                <span className="font-semibold text-gray-800">
                                                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                                </span>
                                                            </div>
                                                            {schedule.details && schedule.details.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-600 mb-1">
                                                                        Các ca làm việc:
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {schedule.details.map((detail, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                                            >
                                                                                {formatTime(detail.start_time)} - {formatTime(detail.end_time)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}

