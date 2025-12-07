import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { getPendingPrescriptions, approvePrescription } from "../../api/prescription.api";
import Toast from "../../components/modals/Toast";
import { CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react";
import PrescriptionDetailModal from "./components/PrescriptionDetailModal";

export default function PharmacistPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [approvingId, setApprovingId] = useState(null);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const res = await getPendingPrescriptions();
            const data = res?.data || res || [];
            setPrescriptions(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách đơn thuốc:", err);
            showToast("Không thể tải danh sách đơn thuốc", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (prescription) => {
        setSelectedPrescription(prescription);
        setIsDetailModalOpen(true);
    };

    const handleApprove = async (prescriptionId) => {
        if (!window.confirm("Bạn có chắc chắn muốn duyệt đơn thuốc này? Tồn kho sẽ được cập nhật.")) {
            return;
        }

        try {
            setApprovingId(prescriptionId);
            await approvePrescription(prescriptionId);
            showToast("Duyệt đơn thuốc thành công", "success");
            await fetchPrescriptions();
        } catch (err) {
            console.error("Lỗi khi duyệt đơn thuốc:", err);
            const message = err?.response?.data?.message || err?.message || "Không thể duyệt đơn thuốc";
            showToast(message, "error");
        } finally {
            setApprovingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount || 0);
    };

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
                            <h2 className="text-3xl font-bold text-gray-700">Đơn thuốc chờ duyệt</h2>
                            <button
                                onClick={fetchPrescriptions}
                                className="bg-[#008080] hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                Làm mới
                            </button>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 text-xl">
                                    Đang tải dữ liệu...
                                </div>
                            ) : prescriptions.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 text-xl">
                                    Không có đơn thuốc nào chờ duyệt
                                </div>
                            ) : (
                                <table className="min-w-full text-center border-collapse">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Mã đơn</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Bệnh nhân</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Bác sĩ</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Ngày tạo</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Tổng tiền</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {prescriptions.map((prescription) => (
                                            <tr key={prescription.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-left">
                                                    <span className="font-mono text-sm text-gray-600">
                                                        {prescription.id.substring(0, 8)}...
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-left text-gray-700">
                                                    {prescription.patient?.user?.full_name || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-left text-gray-700">
                                                    {prescription.doctor?.user?.full_name || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-left text-gray-700">
                                                    {formatDate(prescription.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-left text-gray-700 font-semibold">
                                                    {formatCurrency(prescription.total_fee)}
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(prescription)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(prescription.id)}
                                                            disabled={approvingId === prescription.id}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition disabled:opacity-50"
                                                            title="Duyệt đơn"
                                                        >
                                                            {approvingId === prescription.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                                            ) : (
                                                                <CheckCircle size={18} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Prescription Detail Modal */}
            {isDetailModalOpen && selectedPrescription && (
                <PrescriptionDetailModal
                    prescription={selectedPrescription}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedPrescription(null);
                    }}
                    onApprove={() => {
                        handleApprove(selectedPrescription.id);
                        setIsDetailModalOpen(false);
                    }}
                    isApproving={approvingId === selectedPrescription?.id}
                />
            )}

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


