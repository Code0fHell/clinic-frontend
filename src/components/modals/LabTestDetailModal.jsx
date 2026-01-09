import React from "react";
import Barcode from "react-barcode";

const LabTestDetailModal = ({ labTest, onClose }) => {
    if (!labTest) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Kết quả xét nghiệm
                                </h2>
                                <p className="text-purple-100 text-sm mt-1">
                                    Phòng khám PMedClinic
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                        >
                            <svg
                                className="w-5 h-5"
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
                    </div>
                </div>

                <div className="p-6">
                    {/* Barcode */}
                    {labTest.barcode && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-center">
                            <Barcode
                                value={labTest.barcode}
                                height={40}
                                displayValue
                                background="white"
                                lineColor="black"
                            />
                        </div>
                    )}

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                                Ngày thực hiện
                            </p>
                            <p className="font-semibold text-gray-800">
                                {labTest.created_at
                                    ? new Date(
                                          labTest.created_at
                                      ).toLocaleDateString("vi-VN", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "--"}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">
                                Bác sĩ/Nhân viên LAB
                            </p>
                            <p className="font-semibold text-gray-800">
                                {labTest.doctor?.user?.full_name ||
                                    labTest.lab_staff_name ||
                                    "--"}
                            </p>
                        </div>
                    </div>

                    {/* Kết quả */}
                    {labTest.result && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Kết quả xét nghiệm
                            </h3>
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                                <p className="text-base text-gray-800 whitespace-pre-line">
                                    {labTest.result}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Kết luận */}
                    {labTest.conclusion && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Kết luận
                            </h3>
                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                                <p className="text-base text-gray-800 whitespace-pre-line">
                                    {labTest.conclusion}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabTestDetailModal;

