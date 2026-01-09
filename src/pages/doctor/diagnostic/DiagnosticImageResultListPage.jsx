import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorImagingSidebar from "../components/layout/DoctorImagingSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";
import { getCompletedDiagnosticResultsWithFilter } from "../../../api/imaging.api";
import DiagnosticResultPrintModal from "./DiagnosticResultPrintModal";

const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "day", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
];

const DiagnosticImageResultListPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
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
    const [selectedResult, setSelectedResult] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await getCompletedDiagnosticResultsWithFilter({
                filter_type: filterType,
                page: pagination.page,
                limit: pagination.limit,
            });
            console.log("data: ", data);
            setResults(data.results || []);
            setPagination((prev) => ({
                ...prev,
                total: data.total || 0,
                totalPages: data.totalPages || 1,
            }));
        } catch (error) {
            setToast({
                show: true,
                message: "Không thể tải danh sách kết quả",
                type: "error",
            });
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line
    }, [filterType, pagination.page]);

    const handleFilterChange = (newFilterType) => {
        setFilterType(newFilterType);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleViewResult = (result) => {
        setSelectedResult(result);
        setShowPrintModal(true);
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
                                Lịch sử kết quả chẩn đoán hình ảnh
                            </h1>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 mb-6">
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() =>
                                        handleFilterChange(opt.value)
                                    }
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filterType === opt.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Không có kết quả nào
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Mã kết quả
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Bệnh nhân
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Chẩn đoán
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Ngày thực hiện
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {results.map((result) => (
                                            <tr
                                                key={result.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() =>
                                                    handleViewResult(result)
                                                }
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                    {result.barcode ||
                                                        result.id.slice(0, 8)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {result.patient
                                                            ?.patient_full_name ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {result.patient
                                                            ?.patient_phone ||
                                                            "--"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {result.indication
                                                        ?.diagnosis
                                                        ? result.indication
                                                              .diagnosis
                                                              .length > 50
                                                            ? result.indication.diagnosis.substring(
                                                                  0,
                                                                  50
                                                              ) + "..."
                                                            : result.indication
                                                                  .diagnosis
                                                        : "--"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatUTCDate(
                                                        result.created_at,
                                                        "DD/MM/YYYY"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewResult(
                                                                result
                                                            );
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 gap-2">
                                {Array.from(
                                    { length: pagination.totalPages },
                                    (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() =>
                                                handlePageChange(i + 1)
                                            }
                                            className={`px-3 py-1 rounded ${
                                                pagination.page === i + 1
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-200 text-gray-700"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    )
                                )}
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
            {showPrintModal && selectedResult && (
                <DiagnosticResultPrintModal
                    result={selectedResult}
                    onClose={() => setShowPrintModal(false)}
                />
            )}
        </RoleBasedLayout>
    );
};

export default DiagnosticImageResultListPage;
