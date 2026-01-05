import { useEffect, useRef, useState } from "react";
import { cancelAppointmentDashboard, getAppointmentDashboard } from "../../../api/appointment.api";
import Toast from "../../../components/modals/Toast";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import { createPortal } from "react-dom";

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [appointmentFilter, setAppointmentFilter] = useState("PENDING");

    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        appointmentId: null,
    });
    const [cancelLoading, setCancelLoading] = useState(false);
    const openCancelModal = (appointmentId) => {
        setConfirmModal({
            open: true,
            appointmentId,
        });
    };
    const closeCancelModal = () => {
        setConfirmModal({
            open: false,
            appointmentId: null,
        });
    };


    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [keyword]);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 2000);
    };

    const listRef = useRef(null);

    const fetchAppointments = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);

        const res = await getAppointmentDashboard({
            keyword,
            appointmentFilter,
            cursor: reset ? null : cursor,
            limit: 10,
        });

        setAppointments((prev) =>
            reset ? res.data : [...prev, ...res.data]
        );

        setCursor(res.meta.nextCursor);
        setHasMore(res.meta.hasMore);
        setLoading(false);
    };

    useEffect(() => {
        setCursor(null);
        setHasMore(true);
        setAppointments([]);
        fetchAppointments(true);
    }, [appointmentFilter, debouncedKeyword]);

    /* Cuộn quá khoảng cách sẽ gọi api*/
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            fetchAppointments();
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Đang chờ"
            case "CHECKED_IN":
                return "Đã đến"
            case "DOING":
                return "Đang khám"
            case "COMPLETED":
                return "Đã khám xong"
            case "CANCELLED":
                return "Đã hủy"
            default:
                return "Không xác định"
        }
    }

    const formatSession = (session) => {
        switch (session) {
            case "MORNING":
                return "Sáng"
            case "AFTERNOON":
                return "Chiều"
            default:
                return "Không xác định"
        }
    }

    const handleConfirmCancel = async () => {
        if (!confirmModal.appointmentId) return;

        try {
            setCancelLoading(true);

            const res = await cancelAppointmentDashboard(
                confirmModal.appointmentId
            );

            showToast(res.message || "Hủy lịch hẹn thành công", "success");

            closeCancelModal();

            // Reload lại danh sách
            setCursor(null);
            setHasMore(true);
            setAppointments([]);
            fetchAppointments(true);
        } catch (error) {
            showToast("Hủy lịch hẹn thất bại", "error");
        } finally {
            setCancelLoading(false);
        }
    };



    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">
                    Lịch hẹn hôm nay
                </h3>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-4">
                {/* Search */}
                <div className="relative flex-1">
                    <input
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
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

                {/* Filter */}
                <select
                    value={appointmentFilter}
                    onChange={(e) => setAppointmentFilter(e.target.value)}
                    className="w-[160px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-[#008080] bg-white"
                >
                    <option value="all">Tất cả</option>
                    <option value="PENDING">Đang chờ</option>
                    <option value="CHECKED_IN">Đã đến</option>
                    <option value="DOING">Đang khám</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                </select>
            </div>

            {/* List */}
            <div
                ref={listRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden hover:scrollbar-visible transition-all"
            >
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-1 gap-3"
                        >
                            {/* Left */}
                            <div className="flex items-start space-x-4 flex-1 min-w-0">
                                <div className="min-w-32 flex-shrink-0">
                                    <div className="text-base font-semibold text-gray-600">
                                        {new Date(apt.scheduled_date).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })} - {formatSession(apt.session)}
                                    </div>
                                    <div className="text-sm text-gray-500 italic mt-1">
                                        ( SĐT: {apt.patient.phone} )
                                    </div>
                                </div>

                                <div className="text-lg font-semibold text-gray-700 break-words">
                                    {apt.patient.name}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-teal-100 text-teal-700">
                                    {formatStatus(apt.status)}
                                </span>
                                {apt.status === "PENDING" && (
                                    <button
                                        onClick={() => openCancelModal(apt.id)}
                                        className="px-4 py-1.5 rounded-full text-sm font-bold 
                   bg-red-100 text-red-700 shadow-sm 
                   hover:bg-red-200 cursor-pointer transition-colors"
                                    >
                                        Hủy
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="text-center text-gray-400 py-2 text-sm">
                            Đang tải...
                        </div>
                    )}

                    {!hasMore && appointments.length > 0 && (
                        <div className="text-center text-gray-400 py-2 text-sm">
                            Đã hết dữ liệu
                        </div>
                    )}

                    {appointments.length === 0 && (
                        <div className="text-center text-gray-400 py-2 text-sm">
                            Không có dữ liệu
                        </div>
                    )}
                </div>
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
            {/* Confirm cancel modal */}
            {confirmModal.open &&
                createPortal(
                    <ConfirmModal
                        open={confirmModal.open}
                        title="Xác nhận hủy lịch hẹn"
                        message="Bạn có chắc chắn muốn hủy lịch hẹn này không?"
                        confirmText="Hủy lịch"
                        cancelText="Quay lại"
                        loading={cancelLoading}
                        onCancel={closeCancelModal}
                        onConfirm={handleConfirmCancel}
                    />,
                    document.body
                )
            }
        </div>
    );
}
