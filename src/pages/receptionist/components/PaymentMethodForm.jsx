import React, { useState } from "react";
import CreateVietQRModal from "../../../components/modals/CreateVietQRModal";

export default function PaymentMethodForm({ bill, onSubmit, onClose }) {
    const [method, setMethod] = useState("CASH");
    const [showVietQRModal, setShowVietQRModal] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });

        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Gửi DTO BE yêu cầu
        const dto = {
            bill_id: bill?.id,
            amount: Number(bill?.total),
        };

        // Nếu chọn chuyển khoản, hiển thị modal VietQR
        if (method === "BANK_TRANSFER") {
            setShowVietQRModal(true);
            return;
        }

        onSubmit?.({ dto, method });
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div
                    className="bg-white w-[700px] rounded-2xl shadow-lg p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Nút đóng */}
                    <button
                        onClick={onClose}
                        type="button"
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        Thanh toán hóa đơn
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tổng tiền + hình thức thanh toán */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Tổng tiền cần thanh toán
                                </label>
                                <p className="text-xl font-semibold text-gray-600">
                                    {bill?.total
                                        ? Number(bill.total).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })
                                        : "0 ₫"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Hình thức thanh toán
                                </label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#008080] outline-none hover:cursor-pointer"
                                >
                                    <option value="CASH">💵 Tiền mặt</option>
                                    <option value="BANK_TRANSFER">🏦 Chuyển khoản</option>
                                </select>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="submit"
                                className="bg-[#008080] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition hover:cursor-pointer"
                            >
                                Xác nhận
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition hover:cursor-pointer"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>

                {/* VietQR Modal - hiển thị khi chọn BANK_TRANSFER */}
                {showVietQRModal && bill && (
                    <CreateVietQRModal
                        billId={bill.id}
                        amount={Number(bill.total)}
                        showToast={showToast}
                        onSuccess={(data) => {
                            // Gọi callback onSubmit sau khi thanh toán thành công
                            showToast("Thanh toán thành công", "success");
                            const dto = {
                                bill_id: bill.id,
                                amount: Number(bill.total),
                            };
                            onSubmit?.({ dto, method: "BANK_TRANSFER" });
                            setShowVietQRModal(false);
                            onClose?.();
                        }}
                        onClose={() => setShowVietQRModal(false)}
                    />
                )}
            </div>
            {/* Toast */}
            {toast.show && (
                <div
                    className={`fixed top-20 right-5 px-4 py-3 rounded shadow-lg text-white z-[9999] ${{
                        success: "bg-green-500",
                        error: "bg-red-500",
                        warn: "bg-yellow-500",
                    }[toast.type]
                        }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
