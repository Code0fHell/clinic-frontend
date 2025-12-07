import React from "react";
import { X, CheckCircle } from "lucide-react";

export default function PrescriptionDetailModal({ prescription, onClose, onApprove, isApproving }) {
    if (!prescription) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount || 0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn thuốc</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Patient & Doctor Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Bệnh nhân</h3>
                            <p className="text-gray-800">{prescription.patient?.user?.full_name || "—"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Bác sĩ kê đơn</h3>
                            <p className="text-gray-800">{prescription.doctor?.user?.full_name || "—"}</p>
                        </div>
                    </div>

                    {/* Prescription Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Thông tin đơn thuốc</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Ngày tạo: </span>
                                <span className="text-gray-800">{formatDate(prescription.created_at)}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Tổng tiền: </span>
                                <span className="text-gray-800 font-semibold">{formatCurrency(prescription.total_fee)}</span>
                            </div>
                        </div>
                        {prescription.conclusion && (
                            <div className="mt-2">
                                <span className="text-gray-600">Kết luận: </span>
                                <p className="text-gray-800 mt-1">{prescription.conclusion}</p>
                            </div>
                        )}
                    </div>

                    {/* Medicine List */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Danh sách thuốc</h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên thuốc</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số lượng</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Đơn vị</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Liều dùng</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {prescription.details && prescription.details.length > 0 ? (
                                        prescription.details.map((detail, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-800">
                                                    {detail.medicine?.name || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-800">
                                                    {detail.quantity || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-800">
                                                    {detail.medicine?.unit || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-800">
                                                    {detail.dosage || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-800">
                                                    {formatCurrency(detail.medicine?.price || 0)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                Không có thuốc nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={onApprove}
                        disabled={isApproving}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isApproving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Đang duyệt...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Duyệt đơn thuốc
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


