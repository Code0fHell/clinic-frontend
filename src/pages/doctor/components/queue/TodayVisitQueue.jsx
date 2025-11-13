import React, { useEffect, useState, useRef } from "react";
import {
    getTodayVisitQueue,
    updateVisitStatus,
} from "../../../../api/visit.api";
import { updateAppointmentStatus } from "../../../../api/appointment.api";
import dayjs from "dayjs";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import CreateIndicationPage from "../../../indication/CreateIndicationPage";
import PrescriptionPage from "../../../prescription/PrescriptionPage";

const columns = [
    { label: "Giờ", key: "time", className: "w-[8%] text-center" },
    { label: "Họ và tên", key: "patient", className: "w-[22%]" },
    { label: "Giới tính", key: "gender", className: "w-[8%] text-center" },
    { label: "Năm sinh", key: "dob", className: "w-[10%] text-center" },
    { label: "Lý do khám", key: "reason", className: "w-[28%]" },
    { label: "Trạng thái", key: "status", className: "w-[14%] text-center" },
    { label: "Thao tác", key: "action", className: "w-[10%] text-center" },
];

const statusMap = {
    CHECKED_IN: { label: "Chờ khám", color: "bg-yellow-100 text-yellow-700" },
    DOING: { label: "Đang khám", color: "bg-green-100 text-green-700" },
    COMPLETED: { label: "Đã khám xong", color: "bg-blue-100 text-blue-700" },
};

const TodayVisitQueue = () => {
    const [queue, setQueue] = useState([]);
    const [openAction, setOpenAction] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedPatient, setSelectedPatient] = useState();
    const [selectedPrescriptionVisit, setSelectedPrescriptionVisit] =
        useState(null);
    const tableRef = useRef(null);

    const fetchQueue = async () => {
        try {
            const data = await getTodayVisitQueue();
            setQueue(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách chờ khám:", err);
        }
    };

    useEffect(() => {
        fetchQueue();

        const handleClickOutside = (e) => {
            if (!tableRef.current?.contains(e.target)) setOpenAction(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleStartVisit = async (visitId) => {
        await updateVisitStatus(visitId, "DOING");
        setQueue((prev) =>
            prev.map((v) =>
                v.id === visitId ? { ...v, visit_status: "DOING" } : v
            )
        );
    };

    const handleCompleteVisit = async (visitId, appointmentId) => {
        await updateVisitStatus(visitId, "COMPLETED");
        if (appointmentId)
            await updateAppointmentStatus(appointmentId, "COMPLETED");
        setQueue((prev) =>
            prev.map((v) =>
                v.id === visitId
                    ? {
                          ...v,
                          visit_status: "COMPLETED",
                          appointment: {
                              ...v.appointment,
                              status: "COMPLETED",
                          },
                      }
                    : v
            )
        );
    };

    const handleOpenMenu = (event, id) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            x: rect.right - 160,
            y: rect.bottom + window.scrollY + 4,
        });
        setOpenAction(openAction === id ? null : id);
    };

    return (
        <div className="w-full max-w-[95%] mx-auto py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                    Danh sách khám hôm nay
                </h2>
                <button
                    onClick={fetchQueue}
                    className="text-sm text-blue-600 font-medium hover:underline"
                >
                    Làm mới
                </button>
            </div>

            {/* Table */}
            <div
                ref={tableRef}
                className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100 relative"
            >
                <table className="w-full text-sm text-gray-700 border-collapse table-fixed">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`py-3 px-4 font-semibold text-gray-800 text-left ${
                                        col.className || ""
                                    }`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {queue.length > 0 ? (
                            queue.map((v) => {
                                const patient = v.patient || {};
                                console.log("patient", patient);
                                const time = v.appointment
                                    ? dayjs(
                                          v.appointment.scheduled_date
                                      ).format("HH:mm")
                                    : "--";
                                const gender =
                                    patient.gender === "MALE"
                                        ? "Nam"
                                        : patient.gender === "FEMALE"
                                        ? "Nữ"
                                        : "";
                                const dob = patient.patient_dob
                                    ? dayjs(patient.patient_dob).format("YYYY")
                                    : "";
                                const reason =
                                    v.appointment?.reason ||
                                    v.visit_type ||
                                    "--";
                                const status = statusMap[v.visit_status] || {
                                    label: v.visit_status,
                                    color: "",
                                };

                                return (
                                    <tr
                                        key={v.id}
                                        className="border-b hover:bg-blue-50 transition"
                                    >
                                        <td className="py-2 px-3 text-center font-medium text-gray-800">
                                            {time}
                                        </td>
                                        <td className="py-2 px-3 font-semibold text-gray-900 truncate">
                                            {patient.patient_full_name}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            {gender}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            {dob}
                                        </td>
                                        <td className="py-2 px-3 truncate">
                                            {reason}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 text-center relative">
                                            <button
                                                onClick={(e) =>
                                                    handleOpenMenu(e, v.id)
                                                }
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <ChevronDownIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-6 text-center text-gray-400"
                                >
                                    Không có bệnh nhân trong hàng chờ hôm nay
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Dropdown menu (hiển thị nổi, không đẩy bảng) */}
                {openAction && (
                    <div
                        style={{
                            position: "fixed",
                            top: `${menuPosition.y}px`,
                            left: `${menuPosition.x}px`,
                        }}
                        className="w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] animate-fadeIn"
                    >
                        <button
                            onClick={() => {
                                const visit = queue.find(
                                    (item) => item.id === openAction
                                );
                                setSelectedPatient(visit);
                                setOpenAction(null);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                        >
                            🧾 Tạo phiếu chỉ định
                        </button>
                        <button
                            onClick={() => {
                                const visit = queue.find(
                                    (item) => item.id === openAction
                                );
                                setSelectedPrescriptionVisit(visit);
                                setOpenAction(null);
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                        >
                            💊 Kê đơn
                        </button>
                        {queue.find((v) => v.id === openAction)
                            ?.visit_status === "CHECKED_IN" && (
                            <button
                                onClick={() => {
                                    handleStartVisit(openAction);
                                    setOpenAction(null);
                                }}
                                className="block w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-600 font-medium"
                            >
                                ▶️ Bắt đầu khám
                            </button>
                        )}
                        {queue.find((v) => v.id === openAction)
                            ?.visit_status === "DOING" && (
                            <button
                                onClick={() => {
                                    const visit = queue.find(
                                        (v) => v.id === openAction
                                    );
                                    handleCompleteVisit(
                                        visit.id,
                                        visit.appointment?.id
                                    );
                                    setOpenAction(null);
                                }}
                                className="block w-full px-4 py-2 text-left hover:bg-blue-50 text-green-600 font-medium"
                            >
                                ✅ Đã khám xong
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal tạo phiếu chỉ định */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full">
                        <CreateIndicationPage visit={selectedPatient} />
                        <button
                            className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedPatient(null)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Modal kê đơn thuốc */}
            {selectedPrescriptionVisit && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full">
                        <PrescriptionPage visit={selectedPrescriptionVisit} />
                        <button
                            className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedPrescriptionVisit(null)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodayVisitQueue;
