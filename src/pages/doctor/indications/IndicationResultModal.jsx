import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getLabTestResultsByIndication } from "../../../api/lab-test-result.api";
import { getImageResultsByIndication } from "../../../api/imaging.api";
import { formatUTCDate } from "../../../utils/dateUtils";

const IndicationResultModal = ({ indication, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchResult();
    }, [indication.id]);

    const fetchResult = async () => {
        try {
            setLoading(true);
            setError("");

            if (indication.indication_type === "TEST") {
                // Lấy kết quả xét nghiệm
                const data = await getLabTestResultsByIndication(indication.id);
                setResult(data);
            } else if (indication.indication_type === "IMAGING") {
                // Lấy kết quả chẩn đoán hình ảnh
                const data = await getImageResultsByIndication(indication.id);
                setResult(data);
            }
        } catch (err) {
            console.error("Error fetching result:", err);
            if (err.response?.status === 404) {
                setError("Chưa có kết quả cho phiếu chỉ định này");
            } else {
                setError("Không thể tải kết quả. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    const renderLabTestResult = () => {
        if (!result) return null;

        return (
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Thông tin mẫu xét nghiệm</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-600">Mã barcode:</span>
                            <span className="ml-2 font-medium">{result.barcode || "--"}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Ngày thực hiện:</span>
                            <span className="ml-2 font-medium">
                                {result.created_at ? formatUTCDate(result.created_at, "DD/MM/YYYY HH:mm") : "--"}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Kết quả xét nghiệm</h3>
                    {!result.testResults || result.testResults.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                            <p className="text-gray-600">Chưa có dữ liệu kết quả xét nghiệm</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {result.testResults.map((test, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800 mb-1">
                                            {idx + 1}. {test.serviceName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Kết quả:</span>{" "}
                                            <span className="text-blue-600 font-semibold text-lg">
                                                {test.result}
                                            </span>
                                        </div>
                                        {test.referenceValue && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-medium">Giá trị tham chiếu:</span>{" "}
                                                {test.referenceValue}
                                            </div>
                                        )}
                                    </div>
                                    {test.referenceValue && test.result && !isNaN(parseFloat(test.result)) && (
                                        <div className="ml-4">
                                            {parseFloat(test.result) > parseFloat(test.referenceValue) ? (
                                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                                    ⬆ Cao
                                                </span>
                                            ) : parseFloat(test.result) < parseFloat(test.referenceValue) ? (
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
                    )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Kết luận</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{result.conclusion || "--"}</p>
                </div>

                {result.doctor?.user?.full_name && (
                    <div className="text-sm text-gray-600 text-right">
                        <span className="font-medium">Bác sĩ xét nghiệm:</span> {result.doctor.user.full_name}
                    </div>
                )}
            </div>
        );
    };

    const renderImagingResult = () => {
        if (!result || !Array.isArray(result) || result.length === 0) return null;

        return (
            <div className="space-y-4">
                {result.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="mb-3">
                            <h3 className="font-semibold text-gray-800">
                                Kết quả #{idx + 1}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Ngày thực hiện: {formatUTCDate(item.created_at, "DD/MM/YYYY HH:mm")}
                            </p>
                        </div>

                        {item.image_url && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Hình ảnh chẩn đoán:</h4>
                                <div className="bg-gray-100 rounded-lg p-2">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${item.image_url}`}
                                        alt="Kết quả chẩn đoán hình ảnh"
                                        className="max-w-full h-auto rounded"
                                        onError={(e) => {
                                            e.target.src = "/placeholder-image.png";
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Kết quả:</h4>
                            <p className="text-gray-800 whitespace-pre-wrap">{item.result}</p>
                        </div>

                        {item.doctor?.user?.full_name && (
                            <div className="text-sm text-gray-600 text-right mt-3">
                                <span className="font-medium">Bác sĩ chẩn đoán:</span> {item.doctor.user.full_name}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Kết quả {indication.indication_type === "TEST" ? "Xét nghiệm" : "Chẩn đoán hình ảnh"}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Bệnh nhân: <span className="font-medium">{indication.patient?.patient_full_name}</span> |{" "}
                            Mã phiếu: <span className="font-medium">{indication.barcode}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải kết quả...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <div className="text-yellow-600 text-5xl mb-3">⚠️</div>
                            <p className="text-gray-700 text-lg">{error}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                {indication.is_completed 
                                    ? "Kết quả có thể chưa được nhập vào hệ thống"
                                    : "Phiếu chỉ định chưa được xử lý"}
                            </p>
                        </div>
                    ) : (
                        <>
                            {indication.indication_type === "TEST" && renderLabTestResult()}
                            {indication.indication_type === "IMAGING" && renderImagingResult()}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                    {result && !error && (
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndicationResultModal;


