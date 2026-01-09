import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorImagingSidebar from "../components/layout/DoctorImagingSidebar";

const DiagnosticDoctorDashBoardPage = () => {
    const navigate = useNavigate();

    // Dữ liệu thống kê mẫu
    const [stats] = useState({
        pendingScans: 12,
        completedToday: 6,
        totalThisWeek: 35,
        totalThisMonth: 128,
    });

    return (
        <RoleBasedLayout>
            <DoctorHeader />
            <div className="flex h-[calc(100vh-80px)]">
                <DoctorImagingSidebar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Tổng quan - Bác sĩ chẩn đoán hình ảnh
                        </h1>

                        {/* Bảng thống kê */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Chờ xử lý</p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {stats.pendingScans}
                                        </p>
                                    </div>
                                    <div className="bg-orange-100 p-3 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-orange-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Hoàn thành hôm nay</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {stats.completedToday}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Tuần này</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {stats.totalThisWeek}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Tháng này</p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {stats.totalThisMonth}
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-purple-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nút truy cập nhanh */}
                        <div className="bg-white rounded-lg shadow p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Truy cập nhanh
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate("/diagnostic/indications")}
                                    className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
                                >
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">
                                            Danh sách chỉ định
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Xem và xử lý các phiếu chỉ định chẩn đoán hình ảnh
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => navigate("/diagnostic/completed-results")}
                                    className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all"
                                >
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-800">
                                            Kết quả đã xử lý
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Xem và in các kết quả chẩn đoán hình ảnh đã hoàn thành
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </RoleBasedLayout>
    );
};

export default DiagnosticDoctorDashBoardPage;


