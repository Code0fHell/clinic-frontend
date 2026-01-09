import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import IndicationResultModal from "./IndicationResultModal";
import { formatUTCDate } from "../../../utils/dateUtils";
import { getDoctorTodayIndications } from "../../../api/indication.api";

const DoctorIndicationsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [indications, setIndications] = useState([]);
    const [filterType, setFilterType] = useState(""); // "", "TEST", "IMAGING"
    const [selectedIndication, setSelectedIndication] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const fetchIndications = async () => {
        try {
            setLoading(true);
            const data = await getDoctorTodayIndications(filterType || undefined);
            setIndications(data);
            
            // Nếu đang xem tất cả, cập nhật allIndications để tính stats
            if (!filterType) {
                setAllIndications(data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách chỉ định:", error);
            showToast("Không thể tải danh sách phiếu chỉ định", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIndications();
    }, [filterType]);

    const getIndicationTypeBadge = (type) => {
        switch (type) {
            case "TEST":
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                        🧪 Xét nghiệm
                    </span>
                );
            case "IMAGING":
                return (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                        📷 Chẩn đoán hình ảnh
                    </span>
                );
            default:
                return null;
        }
    };

    const getStatusBadge = (isCompleted) => {
        return isCompleted ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                ✓ Đã hoàn thành
            </span>
        ) : (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                ⏳ Đang xử lý
            </span>
        );
    };

    const handleViewResult = (indication) => {
        setSelectedIndication(indication);
        setShowResultModal(true);
    };

    // Stats luôn tính từ tất cả indications, không bị ảnh hưởng bởi filter
    const [allIndications, setAllIndications] = useState([]);

    const stats = {
        total: allIndications.length,
        test: allIndications.filter((i) => i.indication_type === "TEST").length,
        imaging: allIndications.filter((i) => i.indication_type === "IMAGING").length,
        completed: allIndications.filter((i) => i.is_completed).length,
    };

    return (
        <RoleBasedLayout>
            <DoctorHeader />
            <div className="flex h-[calc(100vh-80px)]">
                <DoctorSidebar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Phiếu chỉ định hôm nay
                            </h1>
                            <button
                                onClick={fetchIndications}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={loading}
                            >
                                {loading ? "Đang tải..." : "Làm mới"}
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="text-sm text-gray-600 mb-1">Tổng số phiếu</div>
                                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg shadow p-4">
                                <div className="text-sm text-blue-600 mb-1">🧪 Xét nghiệm</div>
                                <div className="text-2xl font-bold text-blue-700">{stats.test}</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg shadow p-4">
                                <div className="text-sm text-purple-600 mb-1">📷 Chẩn đoán hình ảnh</div>
                                <div className="text-2xl font-bold text-purple-700">{stats.imaging}</div>
                            </div>
                            <div className="bg-green-50 rounded-lg shadow p-4">
                                <div className="text-sm text-green-600 mb-1">✓ Đã hoàn thành</div>
                                <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterType("")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filterType === ""
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Tất cả ({stats.total})
                                </button>
                                <button
                                    onClick={() => setFilterType("TEST")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filterType === "TEST"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    🧪 Xét nghiệm ({stats.test})
                                </button>
                                <button
                                    onClick={() => setFilterType("IMAGING")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filterType === "IMAGING"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    📷 Chẩn đoán hình ảnh ({stats.imaging})
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : indications.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                {filterType
                                    ? `Chưa có phiếu chỉ định ${
                                          filterType === "TEST" ? "xét nghiệm" : "chẩn đoán hình ảnh"
                                      } nào hôm nay`
                                    : "Chưa có phiếu chỉ định nào hôm nay"}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {indications.map((indication) => (
                                    <div
                                        key={indication.id}
                                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {indication.patient?.patient_full_name}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                                                        {indication.barcode || indication.id.substring(0, 8)}
                                                    </span>
                                                    {getIndicationTypeBadge(indication.indication_type)}
                                                    {getStatusBadge(indication.is_completed)}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Ngày sinh:</span>{" "}
                                                        {formatUTCDate(indication.patient?.patient_dob, "DD/MM/YYYY")}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Giới tính:</span>{" "}
                                                        {indication.patient?.patient_gender}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Số điện thoại:</span>{" "}
                                                        {indication.patient?.patient_phone || "--"}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleViewResult(indication)}
                                                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Xem kết quả
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">Chẩn đoán:</span>
                                                <p className="text-gray-600 mt-1">
                                                    {indication.diagnosis || "--"}
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">
                                                    Dịch vụ chỉ định:
                                                </span>
                                                <div className="mt-2 space-y-2">
                                                    {indication.serviceItems?.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-gray-50 p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <div className="font-medium text-gray-800">
                                                                        {idx + 1}. {item.medical_service.service_name}
                                                                    </div>
                                                                    {item.medical_service.description && (
                                                                        <div className="text-sm text-gray-500 mt-1">
                                                                            {item.medical_service.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                                <div className="text-sm text-gray-500">
                                                    Ngày tạo: {formatUTCDate(indication.indication_date, "DD/MM/YYYY HH:mm")}
                                                </div>
                                                <div className="text-lg font-semibold text-blue-600">
                                                    Tổng phí: {indication.total_fee?.toLocaleString()} đ
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {showResultModal && selectedIndication && (
                <IndicationResultModal
                    indication={selectedIndication}
                    onClose={() => {
                        setShowResultModal(false);
                        setSelectedIndication(null);
                    }}
                />
            )}
        </RoleBasedLayout>
    );
};

export default DoctorIndicationsPage;

