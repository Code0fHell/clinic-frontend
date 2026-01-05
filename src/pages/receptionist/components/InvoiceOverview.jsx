import React from "react";
import { useState, useEffect } from "react";
import { getCountBillToday } from "../../../api/bill.api";

export default function InvoiceOverview() {
    const [total, setTotal] = useState(0);
    const [success, setSuccess] = useState(0);
    const [pending, setPending] = useState(0);
    const [failed, setFailed] = useState(0);

    const fetchDataCountBill = async () => {
        try {
            const res = await getCountBillToday();
            // console.log("CountBill: " + JSON.stringify(res));
            setTotal(res.total);
            setSuccess(res.success);
            setPending(res.pending);
            setFailed(res.failed);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataCountBill();
    }, [])

    return (
        <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Tổng quan hóa đơn</h3>
            <div className="grid grid-cols-4 gap-8 text-center">
                <div>
                    <p className="text-3xl font-bold text-teal-700">{total}</p>
                    <p className="text-sm text-gray-500 mt-2">Tổng</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-green-600">{success}</p>
                    <p className="text-sm text-gray-500 mt-2">Đã thanh toán</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-yellow-600">{pending}</p>
                    <p className="text-sm text-gray-500 mt-2">Chờ thanh toán</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-red-600">{failed}</p>
                    <p className="text-sm text-gray-500 mt-2">Không thành công</p>
                </div>
            </div>
        </div>
    );
}