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
        <div className="bg-white rounded-2xl shadow-sm p-6 h-[490px] flex flex-col">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">Tổng quan giao dịch</h3>
                {/* <a href="#" className="text-sm font-semibold text-teal-600 hover:underline">
                    Xem tất cả
                </a> */}
            </div>

            {/* Bảng dùng GRID → CỘT CÁCH ĐỀU */}
            <div className="flex-1 min-h-0 rounded-lg border border-gray-200 flex flex-col">
                {/* TITLE: CỐ ĐỊNH */}
                <div className="grid bg-gray-50 border-b-2 border-gray-300" style={{ gridTemplateColumns: '56px 1fr 1fr 1fr' }}>
                    <div className="px-2 py-3 text-[15px] font-bold text-gray-700 text-left whitespace-nowrap">
                        STT
                    </div>
                    <div className="px-4 py-3 text-[15px] font-bold text-gray-700 text-left whitespace-nowrap">
                        Bệnh nhân
                    </div>
                    <div className="px-4 py-3 text-[15px] font-bold text-gray-700 text-right whitespace-nowrap">
                        Tổng tiền
                    </div>
                    <div className="px-4 py-3 text-[15px] font-bold text-gray-700 text-left whitespace-nowrap">
                        Ngày thanh toán
                    </div>
                </div>

                {/* DỮ LIỆU: CUỘN */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden hover:scrollbar-visible transition-all">
                    <div className="divide-y divide-gray-100">
                        {transactions.map((tx, index) => (
                            <div
                                key={index}
                                className="grid hover:bg-gray-50 transition-colors"
                                style={{ gridTemplateColumns: '45px 1fr 1fr 1fr' }}
                            >
                                <div className="px-2 py-3 text-base font-semibold text-gray-600 text-right">
                                    {index + 1}
                                </div>
                                <div className="px-4 py-3 text-base font-semibold text-gray-600 text-left break-words whitespace-normal">
                                    {tx.name}
                                </div>
                                <div className="px-4 py-3 text-base font-semibold text-gray-600 text-right">
                                    {tx.amount}
                                </div>
                                <div className="px-4 py-3 text-base font-semibold text-gray-600 text-left whitespace-nowrap">
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