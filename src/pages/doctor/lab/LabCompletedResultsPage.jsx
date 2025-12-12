import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import LabResultPrintModal from "./LabResultPrintModal";
import { formatUTCDate } from "../../../utils/dateUtils";
import { getTodayCompletedResults } from "../../../api/lab-test-result.api";

const LabCompletedResultsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [completedResults, setCompletedResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const fetchCompletedResults = async () => {
        try {
            setLoading(true);
            const data = await getTodayCompletedResults();
            setCompletedResults(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách kết quả:", error);
            showToast("Không thể tải danh sách kết quả xét nghiệm", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedResults();
    }, []);

    const handlePrint = (result) => {
        setSelectedResult(result);
        setShowPrintModal(true);
    };

    const handleClosePrintModal = () => {
        setShowPrintModal(false);
        setSelectedResult(null);
    };

    return (
        <RoleBasedLayout>
            <DoctorHeader />
            <div className="flex h-[calc(100vh-80px)]">
                <DoctorSidebar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Danh sách kết quả đã xử lý hôm nay
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/lab/indications")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Danh sách chỉ định
                                </button>
                                <button
                                    onClick={fetchCompletedResults}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? "Đang tải..." : "Làm mới"}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : completedResults.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Chưa có kết quả xét nghiệm nào được hoàn thành hôm nay
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {completedResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {result.patient?.patient_full_name}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                                                        {result.barcode || result.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Ngày sinh:</span>{" "}
                                                        {formatUTCDate(result.patient?.patient_dob, "DD/MM/YYYY")}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Giới tính:</span>{" "}
                                                        {result.patient?.patient_gender}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Số điện thoại:</span>{" "}
                                                        {result.patient?.patient_phone}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">BS chỉ định:</span>{" "}
                                                        {result.doctor?.user?.full_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handlePrint(result)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                In kết quả
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">Chẩn đoán:</span>
                                                <p className="text-gray-600 mt-1">
                                                    {result.indication?.diagnosis || "--"}
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">Kết quả xét nghiệm:</span>
                                                <div className="mt-2 space-y-2">
                                                    {result.testResults?.map((test, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-gray-50 p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-800 mb-1">
                                                                        {idx + 1}. {test.serviceName}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        <span className="font-medium">Kết quả đo:</span>{" "}
                                                                        <span className="text-blue-600 font-semibold">{test.result}</span>
                                                                    </div>
                                                                    {test.referenceValue && (
                                                                        <div className="text-sm text-gray-500 mt-1">
                                                                            <span className="font-medium">Giá trị tham chiếu:</span>{" "}
                                                                            {test.referenceValue}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {test.referenceValue && test.result && (
                                                                    <div className="ml-4">
                                                                        {parseFloat(test.result) > test.referenceValue ? (
                                                                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                                                                ⬆ Cao
                                                                            </span>
                                                                        ) : parseFloat(test.result) < test.referenceValue ? (
                                                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                                                                ⬇ Thấp
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                                                ✓ Bình thường
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Kết luận:</span>
                                                <p className="text-gray-800 bg-blue-50 p-3 rounded mt-1">
                                                    {result.conclusion}
                                                </p>
                                            </div>

                                            <div className="mt-3 text-sm text-gray-500">
                                                Ngày thực hiện: {formatUTCDate(result.created_at, "DD/MM/YYYY HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showPrintModal && selectedResult && (
                <LabResultPrintModal
                    result={selectedResult}
                    onClose={handleClosePrintModal}
                />
            )}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </RoleBasedLayout>
    );
};

export default LabCompletedResultsPage;
