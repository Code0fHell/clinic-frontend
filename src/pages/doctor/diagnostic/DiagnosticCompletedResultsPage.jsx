import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorImagingSidebar from "../components/layout/DoctorImagingSidebar";
import Toast from "../../../components/modals/Toast";
import DiagnosticResultPrintModal from "./DiagnosticResultPrintModal";
import { formatUTCDate } from "../../../utils/dateUtils";
import { getCompletedDiagnosticResults } from "../../../api/imaging.api";

const DiagnosticCompletedResultsPage = () => {
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

    // Fetch completed results from API
    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await getCompletedDiagnosticResults();
                setCompletedResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi khi tải kết quả đã xử lý:", error);
                setToast({
                    show: true,
                    message:
                        error?.message ||
                        "Không thể tải danh sách kết quả đã xử lý",
                    type: "error",
                });
                setCompletedResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const data = await getCompletedDiagnosticResults();
            setCompletedResults(Array.isArray(data) ? data : []);
            setToast({
                show: true,
                message: "Đã làm mới danh sách",
                type: "success",
            });
        } catch (error) {
            console.error("Lỗi khi làm mới danh sách:", error);
            setToast({
                show: true,
                message: error?.message || "Không thể làm mới danh sách",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

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
                <DoctorImagingSidebar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Danh sách kết quả đã xử lý
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        navigate("/diagnostic/indications")
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Danh sách chỉ định
                                </button>
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                Chưa có kết quả chẩn đoán hình ảnh nào
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
                                                        {
                                                            result.patient
                                                                ?.patient_full_name
                                                        }
                                                    </h3>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                                        {result.barcode ||
                                                            result.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">
                                                            Ngày sinh:
                                                        </span>{" "}
                                                        {formatUTCDate(
                                                            result.patient
                                                                ?.patient_dob,
                                                            "DD/MM/YYYY"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">
                                                            Giới tính:
                                                        </span>{" "}
                                                        {
                                                            result.patient
                                                                ?.patient_gender
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">
                                                            Số điện thoại:
                                                        </span>{" "}
                                                        {
                                                            result.patient
                                                                ?.patient_phone
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">
                                                            BS chỉ định:
                                                        </span>{" "}
                                                        {
                                                            result.doctor?.user
                                                                ?.full_name
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handlePrint(result)
                                                }
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
                                                <span className="font-medium text-gray-700">
                                                    Chẩn đoán:
                                                </span>
                                                <p className="text-gray-600 mt-1">
                                                    {
                                                        result.indication
                                                            ?.diagnosis
                                                    }
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">
                                                    Dịch vụ thực hiện:
                                                </span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {result.serviceNames?.map(
                                                        (name, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                                            >
                                                                {name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hiển thị ảnh thumbnail */}
                                            {result.images &&
                                                result.images.length > 0 && (
                                                    <div className="mb-3">
                                                        <span className="font-medium text-gray-700">
                                                            Hình ảnh chẩn đoán:
                                                        </span>
                                                        <div className="mt-2 grid grid-cols-4 gap-2">
                                                            {result.images.map(
                                                                (
                                                                    image,
                                                                    idx
                                                                ) => {
                                                                    const imageUrl =
                                                                        image.startsWith(
                                                                            "http"
                                                                        )
                                                                            ? image
                                                                            : `${
                                                                                  import.meta
                                                                                      .env
                                                                                      .VITE_API_URL
                                                                              }${image}`;
                                                                    return (
                                                                        <img
                                                                            key={
                                                                                idx
                                                                            }
                                                                            src={
                                                                                imageUrl
                                                                            }
                                                                            alt={`Ảnh ${
                                                                                idx +
                                                                                1
                                                                            }`}
                                                                            className="w-full h-24 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    imageUrl,
                                                                                    "_blank"
                                                                                )
                                                                            }
                                                                            onError={(
                                                                                e
                                                                            ) => {
                                                                                e.target.style.display =
                                                                                    "none";
                                                                            }}
                                                                        />
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {result.description && (
                                                <div className="mb-3">
                                                    <span className="font-medium text-gray-700">
                                                        Mô tả:
                                                    </span>
                                                    <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded">
                                                        {result.description}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <span className="font-medium text-gray-700">
                                                    Kết luận:
                                                </span>
                                                <p className="text-gray-800 bg-blue-50 p-3 rounded mt-1">
                                                    {result.conclusion}
                                                </p>
                                            </div>

                                            <div className="mt-3 text-sm text-gray-500">
                                                Ngày thực hiện:{" "}
                                                {formatUTCDate(
                                                    result.created_at,
                                                    "DD/MM/YYYY HH:mm"
                                                )}
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
                <DiagnosticResultPrintModal
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

export default DiagnosticCompletedResultsPage;
