import React from "react";

export default function AppointmentOverview() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            {/* <h3 className="text-sm font-medium text-gray-600 mb-5">Lịch hẹn tổng quan</h3> */}
            <h3 className="text-xl font-bold text-gray-800 mb-5">Lịch hẹn tổng quan</h3>
            <div className="grid grid-cols-4 gap-8 text-center">
                <div>
                    <p className="text-4xl font-bold text-teal-700">46</p>
                    <p className="text-sm text-gray-500 mt-2">Tổng</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-green-600">40</p>
                    <p className="text-sm text-gray-500 mt-2">Đã hoàn thành</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-yellow-600">40</p>
                    <p className="text-sm text-gray-500 mt-2">Đang thực hiện</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-red-600">6</p>
                    <p className="text-sm text-gray-500 mt-2">Đã hủy</p>
                </div>
            </div>
        </div>
    );
}