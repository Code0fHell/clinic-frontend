import React from "react";

export default function InvoiceOverview() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            {/* <h3 className="text-sm font-medium text-gray-600 mb-5">Tổng quan hóa đơn</h3> */}
            <h3 className="text-xl font-bold text-gray-800 mb-5">Tổng quan hóa đơn</h3>
            <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-4xl font-bold text-green-600">30</p>
                    <p className="text-sm text-gray-500 mt-2">Đã thanh toán</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-yellow-600">40</p>
                    <p className="text-sm text-gray-500 mt-2">Chờ thanh toán</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-red-600">5</p>
                    <p className="text-sm text-gray-500 mt-2">Không thành công</p>
                </div>
            </div>
        </div>
    );
}