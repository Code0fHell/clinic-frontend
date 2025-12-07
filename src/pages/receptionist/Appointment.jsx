import React, { useState, useMemo, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import CreateVisitForm from "./components/CreateVisitForm";
import { getTodayAppointments } from "../../api/appointment.api";
import { createVisit } from "../../api/visit.api";
import { createMedicalTicket } from "../../api/medical-ticket.api";
import { createBill } from "../../api/bill.api";
import { createVietQRPayment } from "../../api/payment.api";
import Toast from "../../components/modals/Toast";

export default function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creatingVisit, setCreatingVisit] = useState(false);
    const [ticketModal, setTicketModal] = useState(null);
    const [billInfo, setBillInfo] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getTodayAppointments();
            if (Array.isArray(res)) {
                setAppointments(res);
            } else if (res?.data) {
                setAppointments(res.data);
            } else {
                throw new Error("Dữ liệu không hợp lệ");
            }
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải lịch hẹn:", err);
            setError("Không thể tải danh sách lịch hẹn");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleCreateVisit = async (dataVisit) => {
        try {
            setCreatingVisit(true);
            const visitResponse = await createVisit(dataVisit);
            const visitEntity = visitResponse?.id ? visitResponse : visitResponse?.data;
            if (!visitEntity?.id) {
                throw new Error("Không xác định được ID lượt khám vừa tạo");
            }
            const ticket = await createMedicalTicket(visitEntity.id);
            setTicketModal(ticket);
            setBillInfo(null);
            setPaymentInfo(null);
            showToast("Đã tạo lượt khám và phiếu khám thành công");
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

    const handleCreateBillFromTicket = async () => {
        if (!ticketModal) return;
        try {
            const bill = await createBill({
                bill_type: "CLINICAL",
                patient_id: ticketModal.patient_id,
                medical_ticket_id: ticketModal.ticket_id,
            });
            setBillInfo(bill);
            showToast("Đã tạo hóa đơn khám", "success");
        } catch (err) {
            console.error("Lỗi tạo hóa đơn:", err);
            const message = err?.response?.message || err?.message || "Không thể tạo hóa đơn";
            showToast(message, "error");
        }
    };

    const handleCreatePaymentFromBill = async () => {
        if (!ticketModal || !billInfo) return;
        try {
            const amount =
                Number(ticketModal.clinical_fee) ||
                Number(billInfo.total) ||
                0;
            if (!amount) {
                throw new Error("Phí khám chưa được thiết lập");
            }
            const payment = await createVietQRPayment({
                bill_id: billInfo.id,
                amount,
            });
            setPaymentInfo(payment);
            showToast("Đã tạo mã QR thanh toán", "success");
        } catch (err) {
            console.error("Lỗi tạo QR:", err);
            const message = err?.response?.message || err?.message || "Không thể tạo mã QR";
            showToast(message, "error");
        }
    };

    // --- Bộ lọc tìm kiếm, phân trang ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const pageSizeOptions = [5, 10, 25, 50, 100];

    const filteredData = useMemo(() => {
        return appointments.filter((item) =>
            (item.patient?.patient_full_name || "Không có tên")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [appointments, searchTerm]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
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
        const date = new Date(isoString);
        return date.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    /* ---------- RENDER ---------- */
    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16 overflow-hidden">
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-6">
                    <div className="flex-1 p-6 mt-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <h2 className="text-3xl font-bold text-gray-700 mb-5 text-left">Danh sách lịch hẹn hôm nay</h2>

                        <div className="mb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên bệnh nhân"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <div className="flex flex-col items-center justify-start flex-1 overflow-hidden bg-gray-50">
                            <div className="w-[100%] overflow-y-auto h-[650px] scrollbar-hidden rounded-lg shadow-sm bg-white">
                                {loading ? (
                                    <div className="text-center py-10 text-gray-500 text-xl">Đang tải dữ liệu...</div>
                                ) : error ? (
                                    <div className="text-center py-10 text-red-500 text-xl">{error}</div>
                                ) : (
                                    <table className="min-w-full text-center border-collapse">
                                        <thead className="bg-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-2xl text-left font-bold text-gray-700">Tên bệnh nhân</th>
                                                <th className="px-6 py-4 text-2xl text-left font-bold text-gray-700">Bác sĩ</th>
                                                <th className="px-6 py-4 text-2xl text-left font-bold text-gray-700">Thời gian</th>
                                                <th className="px-6 py-4 text-2xl text-left font-bold text-gray-700">Lý do</th>
                                                <th className="px-6 py-4 text-2xl text-left font-bold text-gray-700">Hành động</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedData.length > 0 ? (
                                                paginatedData.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 transition duration-200">
                                                        <td className="px-8 py-5 text-left text-xl text-gray-700">
                                                            {item.patient?.user.full_name || "Chưa có tên"}
                                                        </td>
                                                        <td className="px-8 py-5 text-left text-xl text-gray-700">
                                                            {item.doctor?.user.full_name || "Không rõ"}
                                                        </td>
                                                        <td className="px-8 py-5 text-left text-xl text-gray-700">
                                                            {formatDateTime(item.scheduled_date)}{" "}
                                                            <span className="text-gray-500 text-base italic">
                                                                ({item.session === "MORNING" ? "Sáng" : "Chiều"})
                                                            </span>
                                                        </td>

                                                        <td className="px-8 py-5 text-left text-xl text-gray-700">
                                                            {item.reason || "—"}
                                                        </td>
                                                        <td>
                                                            {item.status !== 'pending' ? (
                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedAppointment({
                                                                            ...item,
                                                                            patient_name: item.patient?.user?.full_name || "Không rõ",
                                                                            doctor_name: item.doctor?.user?.full_name || "Không rõ",
                                                                            patient_id: item.patient?.id,
                                                                            doctor_id: item.doctor?.id,
                                                                            appointment_id: item.id, // thêm dòng này
                                                                        })
                                                                    }
                                                                    className="bg-[#008080] hover:bg-teal-600 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md text-base"
                                                                >
                                                                    Thêm vào thăm khám
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-500 font-medium">Đã thêm vào thăm khám</span>
                                                            )}


                                                        </td>

                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-12 text-center text-gray-500 text-base">
                                                        Không có lịch hẹn nào hôm nay.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {selectedAppointment && (
                            <CreateVisitForm
                                onSubmit={handleCreateVisit}
                                onClose={() => setSelectedAppointment(null)}
                                appointment={selectedAppointment} // <-- dữ liệu thực từ hàng được chọn
                                availableDoctors={selectedAppointment.doctor ? [selectedAppointment.doctor] : []} // hoặc có thể bỏ nếu form không cần danh sách
                                isSubmitting={creatingVisit}
                            />
                        )}

                        {/* --- PHÂN TRANG --- */}
                        <div className="border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl text-gray-700">Hiển thị:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008080] cursor-pointer"
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
                                        className={`flex items-center justify-center w-10 h-10 text-base font-semibold transition rounded-md
                                            ${currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {getPageNumbers().map((page, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => typeof page === "number" && goToPage(page)}
                                            disabled={page === "..."}
                                            className={`w-10 h-10 text-base font-semibold flex items-center justify-center transition rounded-md
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
                                        className={`flex items-center justify-center w-10 h-10 text-base font-semibold transition rounded-md
                                            ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
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
