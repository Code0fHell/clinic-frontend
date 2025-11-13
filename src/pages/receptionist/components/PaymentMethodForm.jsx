import React, { useState } from "react";

export default function PaymentMethodForm({ invoice, onSubmit, onClose }) {
    const [method, setMethod] = useState("CASH");

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            invoice_id: invoice?.id,
            method, // Hình thức thanh toán
        };
        console.log("💳 Thanh toán:", payload);
        onSubmit?.(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div
                className="bg-white w-[500px] rounded-2xl shadow-lg p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-100"
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

                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                    Chọn hình thức thanh toán
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Hình thức thanh toán
                        </label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="CASH">💵 Tiền mặt</option>
                            <option value="TRANSFER">🏦 Chuyển khoản</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="submit"
                            className="bg-[#008080] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition cursor-pointer"
                        >
                            Xác nhận
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
