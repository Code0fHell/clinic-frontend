import React, { useState, useEffect } from "react";
import { X, CheckCircle, Edit2, Trash2, Printer } from "lucide-react";
import {
    adjustPrescription,
    approvePrescription,
} from "../../../api/prescription.api";
import { createBill, getBillByPrescription } from "../../../api/bill.api";
import PaymentMethodForm from "../components/PaymentMethodForm.jsx";
import { paymentCash } from "../../../api/payment.api";

export default function PrescriptionDetailModal({
    prescription,
    onClose,
    onApprove,
    isApproving,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState([]);
    const [adjusting, setAdjusting] = useState(false);
    const [billId, setBillId] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bill, setBill] = useState(null);
    const [isBillPaid, setIsBillPaid] = useState(false);
    const [loadingBill, setLoadingBill] = useState(false);

    useEffect(() => {
        if (prescription?.details) {
            setEditedDetails(
                prescription.details.map((detail) => ({
                    id: detail.id,
                    medicine_id: detail.medicine?.id,
                    medicine_name: detail.medicine?.name,
                    medicine_price: detail.medicine?.price,
                    medicine_unit: detail.medicine?.unit,
                    quantity: detail.quantity,
                    dosage: detail.dosage || "",
                }))
            );
        }
    }, [prescription]);

    // Lấy lại bill khi prescription thay đổi
    useEffect(() => {
        const fetchBill = async () => {
            if (!prescription?.id) return;

            setLoadingBill(true);
            try {
                const res = await getBillByPrescription(prescription.id);
                const billObj = res?.data ?? res;

                setBill(billObj);

                const paid = billObj?.payments?.some(
                    (p) => p.payment_status === "SUCCESS"
                );
                setIsBillPaid(!!paid);
            } catch {
                setBill(null);
                setIsBillPaid(false);
            } finally {
                setLoadingBill(false);
            }
        };

        fetchBill();
    }, [prescription?.id]);

    const handleRemoveMedicine = (index) => {
        const newDetails = editedDetails.filter((_, i) => i !== index);
        setEditedDetails(newDetails);
    };

    const handleUpdateDetail = (index, field, value) => {
        const newDetails = [...editedDetails];
        newDetails[index][field] = value;
        setEditedDetails(newDetails);
    };

    const handleAdjust = async () => {
        try {
            setAdjusting(true);
            const medicine_items = editedDetails.map((detail) => ({
                medicine_id: detail.medicine_id,
                quantity: parseInt(detail.quantity) || 1,
                dosage: detail.dosage || "",
            }));

            await adjustPrescription(prescription.id, { medicine_items });
            alert("Điều chỉnh đơn thuốc thành công!");
            setIsEditing(false);
            // Reload prescription data
            window.location.reload();
        } catch (err) {
            console.error("Lỗi điều chỉnh đơn thuốc:", err);
            alert(
                err?.response?.data?.message || "Không thể điều chỉnh đơn thuốc"
            );
        } finally {
            setAdjusting(false);
        }
    };

    // Tạo bill và mở form thanh toán
    const handleCreateBillAndPay = async () => {
        if (loadingBill) return;

        setLoadingBill(true);
        try {
            if (!bill) {
                await createBill({
                    bill_type: "MEDICINE",
                    prescription_id: prescription.id,
                    patient_id: prescription.patient?.id,
                    total: prescription.total_fee,
                });
            }

            const res = await getBillByPrescription(prescription.id);
            const billObj = res?.data ?? res;

            setBill(billObj);
            setShowPaymentModal(true);
        } catch (err) {
            alert(
                err?.response?.data?.message ||
                    "Không thể tạo hóa đơn cho đơn thuốc này"
            );
        } finally {
            setLoadingBill(false);
        }
    };

    // Xử lý sau khi thanh toán thành công
    const handlePaymentSuccess = async ({ dto }) => {
        setLoadingBill(true);
        try {
            // TẠO PAYMENT (CASH hoặc sau VietQR)
            await paymentCash({
                bill_id: dto.bill_id,
                amount: dto.amount,
            });

            // LOAD LẠI BILL
            const res = await getBillByPrescription(prescription.id);
            const billObj = res?.data ?? res;

            setBill(billObj);

            // CHECK PAID
            const paid = billObj?.payments?.some(
                (p) => p.payment_status === "SUCCESS"
            );
            setIsBillPaid(!!paid);

            setShowPaymentModal(false);
        } catch (err) {
            console.error("Thanh toán thất bại:", err);
            alert("Thanh toán thất bại");
        } finally {
            setLoadingBill(false);
        }
    };

    const handleApproveAndPrintQR = async () => {
        if (!bill) {
            alert("Chưa có hóa đơn cho đơn thuốc này");
            return;
        }

        if (!isBillPaid) {
            alert("Đơn thuốc chưa được thanh toán");
            return;
        }

        try {
            // GỌI API DUYỆT ĐƠN THUỐC
            await approvePrescription(prescription.id);

            alert("Duyệt đơn thuốc thành công!");

            // callback cho parent (nếu có)
            if (onApprove) {
                onApprove(prescription.id);
            }

            // đóng modal
            onClose();

            // reload để đồng bộ trạng thái (cách nhanh – ổn định)
            window.location.reload();
        } catch (err) {
            console.error("Lỗi duyệt đơn thuốc:", err);
            alert(
                err?.response?.data?.message ||
                "Không thể duyệt đơn thuốc"
            );
        }
    };

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

    const totalFee = editedDetails.reduce((sum, detail) => {
        return sum + (detail.medicine_price || 0) * (detail.quantity || 0);
    }, 0);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chi tiết đơn thuốc
                        </h2>
                        <div className="flex gap-2">
                            {!isEditing &&
                                prescription.status === "PENDING" && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                        title="Điều chỉnh đơn thuốc"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                )}
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Patient & Doctor Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Bệnh nhân
                                </h3>
                                <p className="text-gray-800">
                                    {prescription.patient?.user?.full_name ||
                                        "—"}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Bác sĩ kê đơn
                                </h3>
                                <p className="text-gray-800">
                                    {prescription.doctor?.user?.full_name ||
                                        "—"}
                                </p>
                            </div>
                        </div>

                        {/* Prescription Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">
                                Thông tin đơn thuốc
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">
                                        Ngày tạo:{" "}
                                    </span>
                                    <span className="text-gray-800">
                                        {formatDate(prescription.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">
                                        Tổng tiền:{" "}
                                    </span>
                                    <span className="text-gray-800 font-semibold">
                                        {formatCurrency(
                                            isEditing
                                                ? totalFee
                                                : prescription.total_fee
                                        )}
                                    </span>
                                </div>
                            </div>
                            {prescription.conclusion && (
                                <div className="mt-2">
                                    <span className="text-gray-600">
                                        Kết luận:{" "}
                                    </span>
                                    <p className="text-gray-800 mt-1">
                                        {prescription.conclusion}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Medicine List */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-700">
                                    Danh sách thuốc
                                </h3>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Tên thuốc
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Số lượng
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Đơn vị
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Liều dùng
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Giá
                                            </th>
                                            {isEditing && (
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                    Hành động
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {editedDetails.length > 0 ? (
                                            editedDetails.map(
                                                (detail, index) => (
                                                    <tr
                                                        key={detail.id || index}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-3 text-sm text-gray-800">
                                                            {detail.medicine_name ||
                                                                "—"}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-800">
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={
                                                                        detail.quantity
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateDetail(
                                                                            index,
                                                                            "quantity",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                                                                />
                                                            ) : (
                                                                detail.quantity ||
                                                                "—"
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-800">
                                                            {detail.medicine_unit ||
                                                                "—"}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-800">
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        detail.dosage
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateDetail(
                                                                            index,
                                                                            "dosage",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                                    placeholder="Liều dùng"
                                                                />
                                                            ) : (
                                                                detail.dosage ||
                                                                "—"
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-800">
                                                            {formatCurrency(
                                                                detail.medicine_price ||
                                                                    0
                                                            )}
                                                        </td>
                                                        {isEditing && (
                                                            <td className="px-4 py-3 text-sm">
                                                                <button
                                                                    onClick={() =>
                                                                        handleRemoveMedicine(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                    title="Xóa"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={isEditing ? 6 : 5}
                                                    className="px-4 py-4 text-center text-gray-500"
                                                >
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
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset to original
                                        if (prescription?.details) {
                                            setEditedDetails(
                                                prescription.details.map(
                                                    (detail) => ({
                                                        id: detail.id,
                                                        medicine_id:
                                                            detail.medicine?.id,
                                                        medicine_name:
                                                            detail.medicine
                                                                ?.name,
                                                        medicine_price:
                                                            detail.medicine
                                                                ?.price,
                                                        medicine_unit:
                                                            detail.medicine
                                                                ?.unit,
                                                        quantity:
                                                            detail.quantity,
                                                        dosage:
                                                            detail.dosage || "",
                                                    })
                                                )
                                            );
                                        }
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAdjust}
                                    disabled={
                                        adjusting || editedDetails.length === 0
                                    }
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {adjusting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        "Lưu thay đổi"
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Đóng
                                </button>
                                {prescription.status === "PENDING" &&
                                    !isBillPaid && (
                                        <button
                                            onClick={handleCreateBillAndPay}
                                            disabled={loadingBill}
                                            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
                                        >
                                            {loadingBill ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : null}
                                            Tạo hóa đơn thanh toán
                                        </button>
                                    )}
                                {prescription.status === "PENDING" &&
                                    isBillPaid && (
                                        <button
                                            onClick={handleApproveAndPrintQR}
                                            disabled={isApproving || adjusting}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isApproving || adjusting ? (
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
                                    )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal chọn phương thức thanh toán */}
            {showPaymentModal && bill && (
                <PaymentMethodForm
                    bill={bill}
                    onSubmit={handlePaymentSuccess}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}
        </>
    );
}
