import React, { useState, useEffect, useCallback } from "react";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import { getMyAppointments, cancelMyAppointment } from "../../api/appointment.api";
import { vietnameseSearch } from "../../utils/vietnameseSearch";
import {
    parseUTCDate,
    formatUTCTime,
    formatUTCDateOnly,
} from "../../utils/dateUtils";
import Toast from "../../components/modals/Toast";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// Component tiêu đề
const PageTitle = () => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Danh sách lịch hẹn
        </h1>
        <p className="text-gray-600 text-lg">
            Quản lý và xem chi tiết các lịch hẹn của bạn
        </p>
    </div>
);

// Component chuyển đổi view (bảng/lịch)
const ViewToggle = ({ view, onViewChange }) => (
    <div className="flex gap-2 mb-6 justify-center">
        <button
            onClick={() => onViewChange("table")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
                view === "table"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
            }`}
        >
            <i className="fas fa-table mr-2"></i>
            Dạng bảng
        </button>
        <button
            onClick={() => onViewChange("calendar")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
                view === "calendar"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
            }`}
        >
            <i className="fas fa-calendar-alt mr-2"></i>
            Dạng lịch
        </button>
    </div>
);

// Component tìm kiếm và lọc (cho dạng bảng)
const TableFilters = ({
    searchQuery,
    onSearchChange,
    dateFilter,
    onDateFilterChange,
}) => (
    <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên bác sĩ..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onDateFilterChange("day")}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                        dateFilter === "day"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                    }`}
                >
                    Hôm nay
                </button>
                <button
                    onClick={() => onDateFilterChange("week")}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                        dateFilter === "week"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                    }`}
                >
                    Tuần này
                </button>
                <button
                    onClick={() => onDateFilterChange("month")}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                        dateFilter === "month"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                    }`}
                >
                    Tháng này
                </button>
                <button
                    onClick={() => onDateFilterChange("upcoming")}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                        dateFilter === "upcoming"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                    }`}
                >
                    Lịch hẹn sắp tới
                </button>
                <button
                    onClick={() => onDateFilterChange("all")}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                        dateFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                    }`}
                >
                    Tất cả
                </button>
            </div>
        </div>
    </div>
);

// Component bảng lịch hẹn
const AppointmentTable = ({
    appointments,
    currentPage,
    itemsPerPage,
    onPageChange,
    onCancel,
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAppointments = appointments.slice(startIndex, endIndex);
    const totalPages = Math.ceil(appointments.length / itemsPerPage);

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: {
                label: "Chờ xử lý",
                color: "bg-yellow-100 text-yellow-800",
            },
            CONFIRMED: {
                label: "Đã xác nhận",
                color: "bg-blue-100 text-blue-800",
            },
            CHECKED_IN: {
                label: "Đã đến",
                color: "bg-green-100 text-green-800",
            },
            COMPLETED: {
                label: "Hoàn thành",
                color: "bg-purple-100 text-purple-800",
            },
            CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
        };
        const statusInfo = statusMap[status] || {
            label: status,
            color: "bg-gray-100 text-gray-800",
        };
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
                {statusInfo.label}
            </span>
        );
    };

    const canCancelAppointment = (appointment) => {
        if (!appointment.scheduled_date) return false;
        if (appointment.status !== "PENDING") return false;
        const now = dayjs();
        const scheduled = dayjs(appointment.scheduled_date);
        const cutoff = scheduled.subtract(1, "day");
        return now.isBefore(cutoff);
    };

    if (appointments.length === 0) {
        return (
            <div className="text-center py-12">
                <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">Không có lịch hẹn nào</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Thời gian
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Bác sĩ
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Lý do khám
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedAppointments.map((appointment) => {
                            const scheduledDate = dayjs(appointment.scheduled_date);
                            return (
                                <tr
                                    key={appointment.id}
                                    className="hover:bg-blue-50 transition"
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatUTCDateOnly(scheduledDate)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatUTCTime(scheduledDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {appointment.doctor?.user
                                                ?.avatar && (
                                                <img
                                                    src={`http://localhost:3000${appointment.doctor.user.avatar}`}
                                                    alt={
                                                        appointment.doctor.user
                                                            .full_name
                                                    }
                                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/assets/doctor-default.jpg";
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {appointment.doctor?.user
                                                        ?.full_name || "N/A"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {appointment.doctor
                                                        ?.specialty ||
                                                        appointment.doctor
                                                            ?.department ||
                                                        ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {appointment.reason || "Không có"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(appointment.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {canCancelAppointment(appointment) ? (
                                            <button
                                                onClick={() => onCancel(appointment)}
                                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                                            >
                                                Hủy lịch
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">
                                                Không thể hủy
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Hiển thị {startIndex + 1} -{" "}
                        {Math.min(endIndex, appointments.length)} trong tổng số{" "}
                        {appointments.length} lịch hẹn
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-400 transition font-medium"
                        >
                            <i className="fas fa-chevron-left mr-1"></i>
                            Trước
                        </button>
                        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                            Trang {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-400 transition font-medium"
                        >
                            Sau
                            <i className="fas fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Component lịch tuần
const AppointmentCalendar = ({ appointments, currentDate, onDateChange }) => {
    const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8h → 18h
    const weekdays = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "CN",
    ];

    const getWeekDates = (date) => {
        const startOfWeek = dayjs(date).startOf("week").add(1, "day"); // Bắt đầu từ Thứ 2
        return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    };

    const weekDates = getWeekDates(currentDate);

    const getAppointmentsByDayHour = (date, hour) => {
        return appointments.filter((a) => {
            if (!a.scheduled_date) return false;
            const appt = dayjs(a.scheduled_date);
            if (!appt.isValid()) return false;
            return appt.isSame(date, "day") && appt.hour() === hour;
        });
    };

    const getStatusColor = (status) => {
        const colorMap = {
            PENDING: "bg-yellow-500",
            CONFIRMED: "bg-blue-500",
            CHECKED_IN: "bg-green-500",
            COMPLETED: "bg-purple-500",
            CANCELLED: "bg-red-500",
        };
        return colorMap[status] || "bg-gray-400";
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b bg-blue-50">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() =>
                            onDateChange(dayjs(currentDate).subtract(1, "week"))
                        }
                        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {weekDates[0].format("DD/MM/YYYY")} -{" "}
                        {weekDates[6].format("DD/MM/YYYY")}
                    </h3>
                    <button
                        onClick={() =>
                            onDateChange(dayjs(currentDate).add(1, "week"))
                        }
                        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-lg min-w-[900px]">
                    <div className="grid grid-cols-8 text-xs">
                        {/* Header */}
                        <div className="bg-gray-100 font-semibold text-center border-r border-b py-2">
                            Giờ
                        </div>
                        {weekDates.map((date, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-100 font-semibold text-center border-r border-b py-2"
                            >
                                {weekdays[idx]}{" "}
                                <span className="text-gray-500">
                                    {date.format("DD/MM")}
                                </span>
                            </div>
                        ))}

                        {/* Body */}
                        {hours.map((hour) => (
                            <React.Fragment key={hour}>
                                <div className="text-center border-r border-b py-2 text-gray-600 bg-gray-50">
                                    {hour}:00
                                </div>
                                {weekDates.map((date, idx) => {
                                    const appts = getAppointmentsByDayHour(
                                        date,
                                        hour
                                    );
                                    return (
                                        <div
                                            key={idx}
                                            className="relative border-r border-b h-[80px] p-1"
                                        >
                                            {appts.map((a) => {
                                                const start = dayjs(a.scheduled_date);
                                                const end = start.add(30, "minute");
                                                const color = getStatusColor(
                                                    a.status
                                                );
                                                return (
                                                    <div
                                                        key={a.id}
                                                        className={`absolute top-1 left-1 right-1 rounded ${color} text-white text-xs px-2 py-1 cursor-pointer hover:shadow-lg transition group relative`}
                                                    >
                                                        <div className="font-medium truncate">
                                                            {formatUTCTime(
                                                                start
                                                            )}{" "}
                                                            -{" "}
                                                            {formatUTCTime(
                                                                end
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] truncate">
                                                            {a.doctor?.user
                                                                ?.full_name ||
                                                                "N/A"}
                                                        </div>
                                                        {/* Tooltip on hover */}
                                                        <div className="absolute z-20 hidden group-hover:block bg-white border-2 border-blue-500 rounded-lg shadow-xl p-4 min-w-[250px] top-full left-0 mt-2">
                                                            <div className="font-semibold text-gray-800 mb-1">
                                                                {formatUTCTime(
                                                                    start
                                                                )}{" "}
                                                                -{" "}
                                                                {formatUTCTime(
                                                                    end
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mb-1">
                                                                <i className="fas fa-user-md mr-2"></i>
                                                                {a.doctor?.user
                                                                    ?.full_name ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <i className="fas fa-stethoscope mr-2"></i>
                                                                {a.reason ||
                                                                    "Không có lý do"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppointmentListPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [view, setView] = useState("table");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [calendarDate, setCalendarDate] = useState(dayjs());
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
    });
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await getMyAppointments();
            const appointmentsData = response.data || response || [];
            setAppointments(appointmentsData);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setToast({
                show: true,
                message:
                    "Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = useCallback(() => {
        let filtered = [...appointments];

        // Filter by date
        const now = dayjs();
        if (dateFilter === "day") {
            const today = now.startOf("day");
            filtered = filtered.filter((a) => {
                if (!a.scheduled_date) return false;
                const apptDate = dayjs(a.scheduled_date);
                return apptDate.isSame(today, "day");
            });
        } else if (dateFilter === "week") {
            const weekStart = now.startOf("week").add(1, "day");
            const weekEnd = now.endOf("week").subtract(1, "day");
            filtered = filtered.filter((a) => {
                if (!a.scheduled_date) return false;
                const apptDate = dayjs(a.scheduled_date);
                return (
                    apptDate.isAfter(weekStart.subtract(1, "day")) &&
                    apptDate.isBefore(weekEnd.add(1, "day"))
                );
            });
        } else if (dateFilter === "month") {
            const monthStart = now.startOf("month");
            const monthEnd = now.endOf("month");
            filtered = filtered.filter((a) => {
                if (!a.scheduled_date) return false;
                const apptDate = dayjs(a.scheduled_date);
                return (
                    apptDate.isAfter(monthStart.subtract(1, "day")) &&
                    apptDate.isBefore(monthEnd.add(1, "day"))
                );
            });
        } else if (dateFilter === "upcoming") {
            filtered = filtered.filter((a) => {
                if (!a.scheduled_date) return false;
                const apptDate = dayjs(a.scheduled_date);
                return apptDate.isAfter(now) && a.status !== "CANCELLED";
            });
        }

        // Filter by search query (doctor name)
        if (searchQuery.trim()) {
            filtered = filtered.filter((a) => {
                const doctorName = a.doctor?.user?.full_name || "";
                return vietnameseSearch(doctorName, searchQuery);
            });
        }

        // Sort by scheduled date (handle null values)
        filtered.sort((a, b) => {
            const dateA = a.scheduled_date ? dayjs(a.scheduled_date) : null;
            const dateB = b.scheduled_date ? dayjs(b.scheduled_date) : null;

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return dateA.valueOf() - dateB.valueOf();
        });

        setFilteredAppointments(filtered);
        setCurrentPage(1);
    }, [appointments, searchQuery, dateFilter]);

    useEffect(() => {
        filterAppointments();
    }, [filterAppointments]);

    const handleCancelAppointment = async (appointment) => {
        const confirm = window.confirm(
            "Bạn có chắc muốn hủy lịch hẹn này? Bạn chỉ được phép hủy trước ít nhất 1 ngày so với thời gian khám."
        );
        if (!confirm) return;

        try {
            await cancelMyAppointment(appointment.id);
            setToast({
                show: true,
                message: "Hủy lịch hẹn thành công.",
                type: "success",
            });
            fetchAppointments();
        } catch (error) {
            console.error("Error canceling appointment:", error);
            const message =
                error.response?.data?.message ||
                "Không thể hủy lịch hẹn. Vui lòng thử lại sau.";
            setToast({
                show: true,
                message,
                type: "error",
            });
        }
    };

    return (
        <RoleBasedLayout>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <PageTitle />
                    <ViewToggle view={view} onViewChange={setView} />

                    {view === "table" && (
                        <>
                            <TableFilters
                                searchQuery={searchQuery}
                                onSearchChange={(value) => {
                                    setSearchQuery(value);
                                    setCurrentPage(1);
                                }}
                                dateFilter={dateFilter}
                                onDateFilterChange={(filter) => {
                                    setDateFilter(filter);
                                    setCurrentPage(1);
                                }}
                            />
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <p className="mt-4 text-gray-600">
                                        Đang tải...
                                    </p>
                                </div>
                            ) : (
                                <AppointmentTable
                                    appointments={filteredAppointments}
                                    currentPage={currentPage}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onCancel={handleCancelAppointment}
                                />
                            )}
                        </>
                    )}

                    {view === "calendar" && (
                        <>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <p className="mt-4 text-gray-600">
                                        Đang tải...
                                    </p>
                                </div>
                            ) : (
                                <AppointmentCalendar
                                    appointments={filteredAppointments}
                                    currentDate={calendarDate}
                                    onDateChange={setCalendarDate}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </RoleBasedLayout>
    );
};

export default AppointmentListPage;
