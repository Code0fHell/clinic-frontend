import React, { useState, useEffect } from "react";
import { X, CheckCircle, Edit2, Plus, Trash2, Printer, QrCode } from "lucide-react";
import { adjustPrescription, approvePrescription } from "../../../api/prescription.api";
import { searchMedicines } from "../../../api/medicine.api";
import { createVietQR } from "../../../api/payment.api";
import CreateVietQRModal from "../../../components/modals/CreateVietQRModal";
import QRCode from "qrcode";

export default function PrescriptionDetailModal({
    prescription,
    onClose,
    onApprove,
    isApproving,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState([]);
    const [adjusting, setAdjusting] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [billId, setBillId] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);

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

    const handleSearchMedicine = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await searchMedicines(query);
            const medicines = res?.data || res || [];
            setSearchResults(medicines);
        } catch (err) {
            console.error("Lỗi tìm kiếm thuốc:", err);
            setSearchResults([]);
        }
    };

    const handleAddMedicine = (medicine) => {
        const newDetail = {
            id: `new-${Date.now()}`,
            medicine_id: medicine.id,
            medicine_name: medicine.name,
            medicine_price: medicine.price,
            medicine_unit: medicine.unit,
            quantity: 1,
            dosage: "",
        };
        setEditedDetails([...editedDetails, newDetail]);
        setSearchQuery("");
        setSearchResults([]);
        setShowSearch(false);
    };

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
                err?.response?.data?.message ||
                    "Không thể điều chỉnh đơn thuốc"
            );
        } finally {
            setAdjusting(false);
        }
    };

    const handleApproveAndPrintQR = async () => {
        try {
            setAdjusting(true);
            const res = await approvePrescription(prescription.id);
            const bill = res?.bill || res?.data?.bill;

            if (bill) {
                setBillId(bill.id);
                // Create QR code for payment
                try {
                    const qrRes = await createVietQR({
                        bill_id: bill.id,
                        amount: bill.total || prescription.total_fee,
                    });
                    if (qrRes.qrCode) {
                        const qrImage = await QRCode.toDataURL(qrRes.qrCode, {
                            width: 300,
                            margin: 2,
                        });
                        setQrCode(qrImage);
                    }
                } catch (qrErr) {
                    console.error("Lỗi tạo QR:", qrErr);
                }
                setShowQRModal(true);
            } else {
                alert("Duyệt đơn thuốc thành công!");
                onApprove();
            }
        } catch (err) {
            console.error("Lỗi duyệt đơn thuốc:", err);
            alert(
                err?.response?.data?.message || "Không thể duyệt đơn thuốc"
            );
        } finally {
            setAdjusting(false);
        }
    };

    const handlePrintQR = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Mã QR Thanh Toán</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                        }
                        .qr-container {
                            text-align: center;
                        }
                        .qr-container img {
                            max-width: 300px;
                        }
                        .info {
                            margin-top: 20px;
                            text-align: center;
                        }
                        @media print {
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <h2>Mã QR Thanh Toán Hóa Đơn</h2>
                        ${qrCode ? `<img src="${qrCode}" alt="QR Code" />` : ""}
                        <div class="info">
                            <p><strong>Mã hóa đơn:</strong> ${billId || "—"}</p>
                            <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(prescription.total_fee || 0)}</p>
                            <p>Quét mã QR để thanh toán</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
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
                            {!isEditing && prescription.status === "PENDING" && (
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
                                    {prescription.patient?.user?.full_name || "—"}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    Bác sĩ kê đơn
                                </h3>
                                <p className="text-gray-800">
                                    {prescription.doctor?.user?.full_name || "—"}
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
                                    <span className="text-gray-600">Ngày tạo: </span>
                                    <span className="text-gray-800">
                                        {formatDate(prescription.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Tổng tiền: </span>
                                    <span className="text-gray-800 font-semibold">
                                        {formatCurrency(isEditing ? totalFee : prescription.total_fee)}
                                    </span>
                                </div>
                            </div>
                            {prescription.conclusion && (
                                <div className="mt-2">
                                    <span className="text-gray-600">Kết luận: </span>
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
                                {isEditing && (
                                    <button
                                        onClick={() => setShowSearch(!showSearch)}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        <Plus size={16} />
                                        Thêm thuốc
                                    </button>
                                )}
                            </div>

                            {/* Search Medicine */}
                            {showSearch && isEditing && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm thuốc..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            handleSearchMedicine(e.target.value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {searchResults.length > 0 && (
                                        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                                            {searchResults.map((medicine) => (
                                                <div
                                                    key={medicine.id}
                                                    onClick={() => handleAddMedicine(medicine)}
                                                    className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                                                >
                                                    <div className="font-medium">
                                                        {medicine.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatCurrency(medicine.price)} / {medicine.unit}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

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
                                            editedDetails.map((detail, index) => (
                                                <tr key={detail.id || index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-800">
                                                        {detail.medicine_name || "—"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={detail.quantity}
                                                                onChange={(e) =>
                                                                    handleUpdateDetail(
                                                                        index,
                                                                        "quantity",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                                            />
                                                        ) : (
                                                            detail.quantity || "—"
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800">
                                                        {detail.medicine_unit || "—"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800">
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={detail.dosage}
                                                                onChange={(e) =>
                                                                    handleUpdateDetail(
                                                                        index,
                                                                        "dosage",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                                placeholder="Liều dùng"
                                                            />
                                                        ) : (
                                                            detail.dosage || "—"
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-800">
                                                        {formatCurrency(detail.medicine_price || 0)}
                                                    </td>
                                                    {isEditing && (
                                                        <td className="px-4 py-3 text-sm">
                                                            <button
                                                                onClick={() => handleRemoveMedicine(index)}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
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
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAdjust}
                                    disabled={adjusting || editedDetails.length === 0}
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
                                {prescription.status === "PENDING" && (
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
                                                Duyệt và in QR thanh toán
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* QR Modal */}
            {showQRModal && billId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Mã QR Thanh Toán
                            </h3>
                            <button
                                onClick={() => {
                                    setShowQRModal(false);
                                    onApprove();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        {qrCode ? (
                            <div className="text-center">
                                <img
                                    src={qrCode}
                                    alt="QR Code"
                                    className="mx-auto mb-4"
                                />
                                <p className="text-sm text-gray-600 mb-4">
                                    Tổng tiền: {formatCurrency(prescription.total_fee || 0)}
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={handlePrintQR}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                    >
                                        <Printer size={18} />
                                        In QR
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowQRModal(false);
                                            onApprove();
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">
                                    Đang tạo mã QR...
                                </p>
                                <button
                                    onClick={() => {
                                        setShowQRModal(false);
                                        onApprove();
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
