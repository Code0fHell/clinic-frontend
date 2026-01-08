import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import CreateVisitForm from "./components/CreateVisitForm";
import { getTodayAppointments } from "../../api/appointment.api";
import { createVisit } from "../../api/visit.api";
import Toast from "../../components/modals/Toast";
import { createPortal } from "react-dom";
import { getAvailableDoctorToday } from "../../api/patient.api";

export default function Appointment() {
    const getVietnamDateString = () => {
        const now = new Date();
        const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        return vnTime.toISOString().split("T")[0];
    };
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creatingVisit, setCreatingVisit] = useState(false);
    const dateInputRef = useRef(null);
    const [visitFilter, setVisitFilter] = useState("all");
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState(() => getVietnamDateString()); // yyyy-mm-dd
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const pageSizeOptions = [5, 10, 25, 50, 100];
    const debounceRef = useRef(null); // Tránh gọi API liên tục khi tìm kiếm

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 2000);
    };

    // Dùng phục vụ nếu bác sĩ nghỉ
    useEffect(() => {
        const fetchDoctorAvailable = async () => {
            try {
                const data = await getAvailableDoctorToday();
                setAvailableDoctors(data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu bác sĩ trống lịch:", err);
            }
        };
        fetchDoctorAvailable();
    }, []);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getTodayAppointments({
                date: dateFilter, // yyyy-mm-dd
                keyword: searchTerm,
                visitFilter,
                page: currentPage,
                limit: itemsPerPage,
            });

            setAppointments(res.data || []);
            setTotalPages(res.pagination?.totalPages);
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải lịch hẹn:", err);
            setError("Không thể tải danh sách lịch hẹn");
        } finally {
            setLoading(false);
        }
    }, [dateFilter, searchTerm, visitFilter, currentPage, itemsPerPage]);

    const openDatePicker = () => {
        if (!dateInputRef.current) return;

        if (dateInputRef.current.showPicker) {
            // Chrome, Edge
            dateInputRef.current.showPicker();
        } else {
            // Firefox fallback
            dateInputRef.current.focus();
        }
    };

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchAppointments();
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
        fetchAppointments();
    }, [dateFilter, visitFilter, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleCreateVisit = async (dataVisit) => {
        try {
            setCreatingVisit(true);
            const visitResponse = await createVisit(dataVisit);
            const visitEntity = visitResponse?.id ? visitResponse : visitResponse?.data;
            if (!visitEntity?.id) {
                throw new Error("Không xác định được ID lượt khám vừa tạo");
            }
            showToast("Thêm thăm khám trong ngày thành công", "success");
            setSelectedAppointment(null);
            await fetchAppointments();
        } catch (err) {
            console.error("Lỗi tạo visit:", err);
            const message = err?.response?.message || err?.message || "Không thể tạo thăm khám";
            showToast(message, "error");
        } finally {
            setCreatingVisit(false);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    // --- Xử lý format ngày giờ ---
    const formatDateTime = (isoString) => {
        if (!isoString) return "—";

        // Chuyển đổi chuỗi ISO thành đối tượng Date
        const date = new Date(isoString);

        // Cộng thêm 7 giờ để lấy giờ Việt Nam
        const utcOffset = 7 * 60;
        const localTime = new Date(date.getTime() + utcOffset * 60 * 1000);

        const datePart = localTime.toISOString().slice(0, 10).split("-").reverse().join("-");
        const timePart = localTime.toISOString().slice(11, 16);

        return `${datePart} ${timePart}`;
    };


    /* ---------- RENDER ---------- */
    return (
        <div className="h-screen bg-gray-50 font-sans flex flex-col overflow-hidden">
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16 overflow-hidden">
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                <main className="flex-1 ml-24 flex flex-col overflow-hidden">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-700 mb-3 text-left">Danh sách lịch hẹn</h2>

                        <div className="mb-2 flex items-center gap-4">
                            {/* Date filter */}
                            <div className="flex items-center">
                                <div
                                    onClick={openDatePicker}
                                    className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700 cursor-pointer hover:bg-gray-50">

                                    <svg
                                        className="w-5 h-5 mr-2 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>

                                    <span className="mr-2 select-none">
                                        {new Date(dateFilter).toLocaleDateString("vi-VN")}
                                    </span>

                                    <input
                                        max={getVietnamDateString()}
                                        ref={dateInputRef}
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => {
                                            setDateFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Search input */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        // setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base
                                               focus:outline-none focus:ring-2 focus:ring-[#008080] transition
                                               placeholder:text-gray-400"
                                />
                                <svg
                                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* --- Bảng hiển thị dữ liệu --- */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden flex-1 bg-white">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 text-xl">
                                    Đang tải dữ liệu...
                                </div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500 text-xl">
                                    {error}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <div className="relative max-h-[450px] overflow-y-scroll scrollbar-hidden">
                                        <table className="min-w-full table-fixed text-sm border-collapse">
                                            {/* ===== THEAD ===== */}
                                            <thead>
                                                <tr>
                                                    <th className="w-12 px-2 py-2 text-right bg-gray-100 text-sm font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        STT
                                                    </th>

                                                    <th className="w-[180px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Bệnh nhân
                                                    </th>

                                                    <th className="w-[90px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Giới tính
                                                    </th>

                                                    <th className="w-[130px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Số ĐT
                                                    </th>

                                                    <th className="w-[130px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Địa chỉ
                                                    </th>

                                                    <th className="w-[160px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Bác sĩ
                                                    </th>

                                                    <th className="w-[180px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Thời gian
                                                    </th>

                                                    <th className="w-[200px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                                sticky top-0 z-10 border-b border-r border-gray-200">
                                                        Lý do
                                                    </th>

                                                    <th className="w-[180px] px-3 py-2 bg-gray-100 font-semibold text-gray-700
               sticky top-0 z-10 border-b border-gray-200">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span>Thao tác</span>

                                                            <select
                                                                value={visitFilter}
                                                                onChange={(e) => {
                                                                    setVisitFilter(e.target.value);
                                                                    setCurrentPage(1);
                                                                }}
                                                                className="w-[90px] border border-gray-300 rounded-md 
                                                                            px-1 py-[2px] text-xs
                                                                            focus:outline-none focus:ring-1 focus:ring-blue-400">
                                                                <option value="all">Tất cả</option>
                                                                <option value="added">Đã thêm thăm khám</option>
                                                                <option value="not_added">Chưa thêm thăm khám</option>
                                                            </select>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>

                                            {/* ===== TBODY ===== */}
                                            <tbody className="text-gray-700 divide-y divide-gray-200">
                                                {appointments.length > 0 ? (
                                                    appointments.map((item, index) => (
                                                        <tr
                                                            key={item.id}
                                                            className="text-[15px] hover:bg-gray-50 transition-colors"
                                                        >
                                                            {/* STT */}
                                                            <td className="w-12 px-2 py-2 text-right border-r border-gray-200">
                                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                                            </td>

                                                            {/* Bệnh nhân */}
                                                            <td className="w-[180px] px-3 py-2 truncate border-r border-gray-200">
                                                                {item.patient?.name || "Chưa có tên"}
                                                            </td>

                                                            {/* Giới tính */}
                                                            <td className="w-[90px] px-3 py-2 border-r border-gray-200">
                                                                {item.patient?.gender === "NAM" ? "Nam" : "Nữ" || "—"}
                                                            </td>

                                                            {/* Số ĐT */}
                                                            <td className="w-[130px] px-3 py-2 border-r border-gray-200">
                                                                {item.patient?.phone || "—"}
                                                            </td>

                                                            {/* Địa chỉ */}
                                                            <td className="w-[130px] px-3 py-2 border-r border-gray-200">
                                                                {item.patient?.address || "—"}
                                                            </td>

                                                            {/* Bác sĩ */}
                                                            <td className="w-[160px] px-3 py-2 truncate border-r border-gray-200">
                                                                {item.doctor?.name + " " || "Không rõ"}
                                                                (<span
                                                                    className={`text-sm italic ${item.doctor?.is_available === false
                                                                        ? "text-red-500"
                                                                        : "text-green-600"
                                                                        }`}
                                                                >
                                                                    {item.doctor?.is_available === false
                                                                        ? "Nghỉ phép"
                                                                        : item.doctor?.is_available === true
                                                                            ? "Đang làm việc"
                                                                            : "Không xác định"}
                                                                </span>)
                                                            </td>

                                                            {/* Thời gian */}
                                                            <td className="w-[180px] px-3 py-2 border-r border-gray-200">
                                                                {formatDateTime(item.scheduled_date)}{" "}
                                                                <span className="text-gray-500 italic text-sm">
                                                                    ({item.session === "MORNING" ? "Sáng" : "Chiều"})
                                                                </span>
                                                            </td>

                                                            {/* Lý do */}
                                                            <td
                                                                className="w-[200px] px-3 py-2 border-r border-gray-200"
                                                                style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word'
                                                                }}
                                                            >
                                                                {item.reason || "—"}
                                                            </td>

                                                            {/* Thao tác */}
                                                            <td className="w-[180px] px-3 py-2">
                                                                {item.status === "CANCELLED" ? (
                                                                    <span
                                                                        className="inline-block w-full text-center px-3 py-2
                       rounded-lg text-sm font-semibold
                       bg-red-100 text-red-600 cursor-not-allowed"
                                                                    >
                                                                        Đã hủy
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedAppointment({
                                                                                ...item,
                                                                                patient_name: item.patient?.name || "Không rõ",
                                                                                doctor_name: item.doctor?.name || "Không rõ",
                                                                                patient_id: item.patient?.id,
                                                                                doctor_id: item.doctor?.id,
                                                                                appointment_id: item.id,
                                                                                is_available: item.doctor?.is_available
                                                                            })
                                                                        }
                                                                        disabled={item.status !== "PENDING"}
                                                                        className={`
                w-full px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition
                ${item.status !== "PENDING"
                                                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                                                : "bg-[#008080] text-white hover:bg-teal-600 cursor-pointer"}
            `}
                                                                    >
                                                                        Thêm vào thăm khám
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={8}
                                                            className="px-3 py-6 text-center text-gray-500 text-base"
                                                        >
                                                            Không có dữ liệu
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>


                        {selectedAppointment && (
                            <CreateVisitForm
                                onSubmit={handleCreateVisit}
                                onClose={() => setSelectedAppointment(null)}
                                appointment={selectedAppointment} // <-- dữ liệu thực từ hàng được chọn
                                availableDoctors={selectedAppointment.doctor?.is_available === false
                                    ? availableDoctors
                                    : []} // hoặc có thể bỏ nếu form không cần danh sách
                                isSubmitting={creatingVisit}
                            />
                        )}

                        {/* --- PHÂN TRANG --- */}
                        <div className="border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Hiển thị:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008080] cursor-pointer"
                                    >
                                        {pageSizeOptions.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* --- Nút chuyển trang --- */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center justify-center w-6 h-6 text-sm font-semibold transition rounded-md
                                            ${currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {getPageNumbers().map((page, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => typeof page === "number" && goToPage(page)}
                                            disabled={page === "..."}
                                            className={`w-6 h-6 text-sm font-semibold flex items-center justify-center transition rounded-md
                                                ${page === currentPage
                                                    ? "bg-[#008080] text-white border border-[#008080]"
                                                    : page === "..."
                                                        ? "text-gray-500 cursor-default"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center justify-center w-6 h-6 text-sm font-semibold transition rounded-md
                                            ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Toast */}
            {toast &&
                createPortal(
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />,
                    document.body
                )
            }
        </div>
    );
}
