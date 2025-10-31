import React from "react";

export default function InvoiceOverview() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* <h3 className="text-sm font-medium text-gray-600 mb-5">Tổng quan hóa đơn</h3> */}
            <h3 className="text-2xl font-bold text-008080-700 mb-5">Tổng quan hóa đơn</h3>
            <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-5xl font-bold text-green-600">30</p>
                    <p className="text-sm text-gray-500 mt-2">Đã thanh toán</p>
                </div>
                <div>
                    <p className="text-5xl font-bold text-yellow-600">40</p>
                    <p className="text-sm text-gray-500 mt-2">Chờ thanh toán</p>
                </div>
                <div>
                    <p className="text-5xl font-bold text-red-600">5</p>
                    <p className="text-sm text-gray-500 mt-2">Không thành công</p>
                </div>
            </div>
        </div>
    );
}