import React from "react";
import { useLocation, Link } from "react-router-dom";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";

const AppointmentSuccessPage = () => {
    const location = useLocation();
    const { isGuest, email, appointmentDate, doctorName } = location.state || {};

    return (
        <RoleBasedLayout>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        {/* Success Icon */}
                        <div className="mb-6">
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Đặt lịch hẹn thành công!
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Cảm ơn bạn đã đặt lịch hẹn tại PMed Clinic
                        </p>

                        {/* Appointment Info */}
                        {(appointmentDate || doctorName) && (
                            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Thông tin lịch hẹn:
                                </h2>
                                {doctorName && (
                                    <div className="mb-2">
                                        <span className="font-medium text-gray-700">Bác sĩ: </span>
                                        <span className="text-gray-900">{doctorName}</span>
                                    </div>
                                )}
                                {appointmentDate && (
                                    <div>
                                        <span className="font-medium text-gray-700">Thời gian: </span>
                                        <span className="text-gray-900">
                                            {new Date(appointmentDate).toLocaleString("vi-VN", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Guest User Instructions */}
                        {isGuest && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 text-left">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-yellow-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                            Thông tin tài khoản đã được gửi qua email
                                        </h3>
                                        {email && (
                                            <p className="text-yellow-700 mb-2">
                                                Chúng tôi đã gửi thông tin tài khoản và mật khẩu đến email:{" "}
                                                <strong>{email}</strong>
                                            </p>
                                        )}
                                        <p className="text-yellow-700 mb-4">
                                            Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để nhận thông tin đăng nhập.
                                        </p>
                                        <div className="bg-white rounded p-4 mt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                Sau khi nhận được email, bạn có thể:
                                            </h4>
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                <li>Đăng nhập vào hệ thống để theo dõi trạng thái lịch hẹn</li>
                                                <li>Xem lịch sử khám bệnh</li>
                                                <li>Quản lý thông tin cá nhân</li>
                                                <li>Đổi mật khẩu để bảo mật tài khoản</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isGuest ? (
                                <>
                                    <Link
                                        to="/patient/login"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                    <Link
                                        to="/"
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                                    >
                                        Về trang chủ
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/patient/appointments"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                                    >
                                        Xem lịch hẹn của tôi
                                    </Link>
                                    <Link
                                        to="/"
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                                    >
                                        Về trang chủ
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </RoleBasedLayout>
    );
};

export default AppointmentSuccessPage;

