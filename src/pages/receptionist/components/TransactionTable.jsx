import React from "react";

const transactions = [
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" },
    { name: "John Smith", invoice: "174", amount: "Rs 48,000", date: "2023-09-01" }, // Dòng 11
];

export default function TransactionTable() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-gray-800">Tổng quan giao dịch</h3>
                <a href="#" className="text-sm font-semibold text-teal-600 hover:underline">
                    Xem tất cả
                </a>
            </div>

            {/* Bảng dùng GRID → CỘT CÁCH ĐỀU */}
            <div className="flex-1 overflow-hidden rounded-lg border border-gray-200">
                {/* TITLE: CỐ ĐỊNH */}
                <div className="grid grid-cols-4 bg-gray-50 border-b-2 border-gray-300">
                    <div className="px-4 py-3 text-base font-bold text-gray-700 text-center">
                        Tên bệnh nhân
                    </div>
                    <div className="px-4 py-3 text-base font-bold text-gray-700 text-center">
                        Mã hóa đơn
                    </div>
                    <div className="px- py-3 text-base font-bold text-gray-700 text-center">
                        Tổng tiền thanh toán
                    </div>
                    <div className="px-4 py-3 text-base font-bold text-gray-700 text-center">
                        Ngày thanh toán
                    </div>
                </div>

                {/* DỮ LIỆU: CUỘN */}
                <div
                    className="max-h-[400px] overflow-y-auto scrollbar-hidden hover:scrollbar-visible transition-all"
                >
                    <div className="divide-y divide-gray-100">
                        {transactions.map((tx, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="px-4 py-4 text-lg font-semibold text-gray-600 text-center">
                                    {tx.name}
                                </div>
                                <div className="px-4 py-4 text-lg font-semibold text-gray-600 text-center">
                                    {tx.invoice}
                                </div>
                                <div className="px-4 py-4 text-lg font-semibold text-gray-600 text-center">
                                    {tx.amount}
                                </div>
                                <div className="px-4 py-4 text-lg font-semibold text-gray-600 text-center">
                                    {tx.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}