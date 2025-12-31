import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import LabResultPrintModal from "./LabResultPrintModal";
import { formatUTCDate } from "../../../utils/dateUtils";
import { getCompletedResultsWithFilter } from "../../../api/lab-test-result.api";

const LabTestResultListPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await getCompletedResultsWithFilter({
                filter_type: filterType,
                page: pagination.page,
                limit: pagination.limit,
            });
            
            // Response từ backend là object trực tiếp với { data, total, page, limit, totalPages }
            setResults(response.data || []);
            setPagination({
                ...pagination,
                total: response.total || 0,
                totalPages: response.totalPages || 0,
            });
        } catch (error) {
            console.error("Lỗi khi tải danh sách kết quả:", error);
            showToast("Không thể tải danh sách kết quả xét nghiệm", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [filterType, pagination.page]);

    const handleFilterChange = (newFilterType) => {
        setFilterType(newFilterType);
        setPagination({ ...pagination, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setPagination({ ...pagination, page: newPage });
    };

    const handleViewResult = (result) => {
        setSelectedResult(result);
        setShowPrintModal(true);
    };

    const handleClosePrintModal = () => {
        setShowPrintModal(false);
        setSelectedResult(null);
    };

    const filterOptions = [
        { value: "all", label: "Tất cả" },
        { value: "day", label: "Hôm nay" },
        { value: "week", label: "Tuần này" },
        { value: "month", label: "Tháng này" },
    ];

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
                                Danh sách kết quả xét nghiệm
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/lab/indications")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Danh sách chỉ định
                                </button>
                                <button
                                    onClick={fetchResults}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? "Đang tải..." : "Làm mới"}
                                </button>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="bg-white rounded-lg shadow p-4 mb-6">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Lọc theo:
                                </label>
                                <div className="flex gap-2">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleFilterChange(option.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                filterType === option.value
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Không có kết quả xét nghiệm nào
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                                        STT
                                                    </th>
                                                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                                        Mã phiếu
                                                    </th>
                                                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                                        Bệnh nhân
                                                    </th>
                                                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                                        Ngày sinh
                                                    </th>
                                                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                                        Bác sĩ chỉ định
                                                    </th>
                                                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                                        Ngày thực hiện
                                                    </th>
                                                    <th className="py-3 px-4 text-center font-semibold text-gray-700">
                                                        Thao tác
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {results.map((result, index) => (
                                                    <tr
                                                        key={result.id}
                                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                        onClick={() => handleViewResult(result)}
                                                    >
                                                        <td className="py-3 px-4 text-gray-700">
                                                            {(pagination.page - 1) * pagination.limit + index + 1}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                                {result.barcode || result.id}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 font-medium text-gray-800">
                                                            {result.patient?.patient_full_name || "--"}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600">
                                                            {formatUTCDate(
                                                                result.patient?.patient_dob,
                                                                "DD/MM/YYYY"
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600">
                                                            {result.doctor?.user?.full_name || "--"}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600">
                                                            {formatUTCDate(
                                                                result.created_at,
                                                                "DD/MM/YYYY HH:mm"
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewResult(result);
                                                                }}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-between items-center mt-4 bg-white rounded-lg shadow p-4">
                                        <div className="text-sm text-gray-600">
                                            Hiển thị{" "}
                                            {(pagination.page - 1) * pagination.limit + 1} -{" "}
                                            {Math.min(
                                                pagination.page * pagination.limit,
                                                pagination.total
                                            )}{" "}
                                            trong tổng số {pagination.total} kết quả
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                    pagination.page === 1
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            >
                                                Trước
                                            </button>
                                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                                .filter(
                                                    (page) =>
                                                        page === 1 ||
                                                        page === pagination.totalPages ||
                                                        (page >= pagination.page - 1 &&
                                                            page <= pagination.page + 1)
                                                )
                                                .map((page, index, array) => (
                                                    <React.Fragment key={page}>
                                                        {index > 0 && array[index - 1] !== page - 1 && (
                                                            <span className="px-2 text-gray-400">...</span>
                                                        )}
                                                        <button
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                                pagination.page === page
                                                                    ? "bg-blue-600 text-white"
                                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    </React.Fragment>
                                                ))}
                                            <button
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.totalPages}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                    pagination.page === pagination.totalPages
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Print Modal */}
            {showPrintModal && selectedResult && (
                <LabResultPrintModal
                    result={selectedResult}
                    onClose={handleClosePrintModal}
                />
            )}

            {/* Toast */}
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

export default LabTestResultListPage;

