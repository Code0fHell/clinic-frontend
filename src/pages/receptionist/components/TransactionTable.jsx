import { useEffect, useRef, useState, useCallback } from "react";
import { getPaymentReport } from "../../../api/bill.api";

export default function TransactionTable() {
    const [transactions, setTransactions] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const firstLoadRef = useRef(false);
    const scrollRef = useRef(null);

    // Load dữ liệu
    const fetchData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const res = await getPaymentReport({
            cursor,
            limit: 10,
        });

        setTransactions((prev) => [...prev, ...res.data]);
        setCursor(res.meta.nextCursor);
        setHasMore(res.meta.hasMore);

        setLoading(false);
    }, [cursor, hasMore, loading]);
    // console.log("tran: " + JSON.stringify(transactions));

    // Load lần đầu
    useEffect(() => {
        if (firstLoadRef.current) return;
        firstLoadRef.current = true;

        fetchData();
    }, [fetchData]);


    // Xử lý scroll
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;

        const isBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

        if (isBottom) {
            fetchData();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 h-[500px] flex flex-col">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">
                    Tổng quan giao dịch
                </h3>
            </div>

            {/* Bảng */}
            <div className="flex-1 min-h-0 rounded-lg border border-gray-200 flex flex-col">
                <div
                    className="grid bg-gray-50 border-b-2 border-gray-300"
                    style={{ gridTemplateColumns: "45px 1fr 1fr 1fr" }}
                >
                    <div className="px-2 py-3 text-[15px] font-bold text-gray-700">
                        STT
                    </div>
                    <div className="px-4 py-3 text-[15px] font-bold text-gray-700">
                        Bệnh nhân
                    </div>
                    <div className="px-4 py-3 text-[15px] font-bold text-gray-700 text-right">
                        Tổng tiền
                    </div>
                    <div className="px-4 py-3 text-[15px] font-bold text-gray-700">
                        Ngày thanh toán
                    </div>
                </div>

                {/* BODY */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden hover:scrollbar-visible transition-all"
                >
                    <div className="divide-y divide-gray-100">
                        {transactions.map((tx, index) => (
                            <div
                                key={tx.medicalTicketId}
                                className="grid hover:bg-gray-50 transition-colors"
                                style={{
                                    gridTemplateColumns:
                                        "45px 1fr 1fr 1fr",
                                }}
                            >
                                {/* STT */}
                                <div className="px-2 py-3 text-base font-semibold text-gray-600 text-right">
                                    {index + 1}
                                </div>

                                {/* Tên bệnh nhân */}
                                <div className="px-4 py-3 text-base font-semibold text-gray-700 break-words">
                                    {tx.patientName}
                                </div>

                                {/* Tổng tiền */}
                                <div className="px-4 py-3 text-base font-semibold text-gray-700 text-right">
                                    {Number(tx.totalAmount).toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    ₫
                                </div>

                                {/* Ngày thanh toán */}
                                <div className="px-4 py-3 text-base text-gray-600 whitespace-nowrap text-center">
                                    {new Date(tx.paidDate).toISOString().slice(0, 10).split("-").reverse().join("/")}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                Đang tải thêm...
                            </div>
                        )}

                        {!hasMore && transactions.length > 0 && (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                Đã tải hết dữ liệu
                            </div>
                        )}

                        {transactions.length === 0 && (
                            <div className="text-center text-gray-400 py-2 text-sm">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
