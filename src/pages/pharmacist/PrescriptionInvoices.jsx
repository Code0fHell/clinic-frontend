import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { getPrescriptionBills } from "../../api/bill.api";
import Toast from "../../components/modals/Toast";
import { Search, Filter, Calendar, User, FileText } from "lucide-react";

export default function PrescriptionInvoices() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });
    const [filters, setFilters] = useState({
        keyword: "",
        startDate: "",
        endDate: "",
        paymentStatus: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [showFilters, setShowFilters] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        fetchBills();
    }, [filters, pagination.page]);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };

            if (filters.keyword) params.keyword = filters.keyword;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;

            const res = await getPrescriptionBills(params);
            const data = res?.data || [];
            const paginationData = res?.pagination || {};

            setBills(data);
            setPagination({
                ...pagination,
                total: paginationData.total || 0,
                totalPages: paginationData.totalPages || 0,
            });
        } catch (err) {
            console.error("Lỗi khi tải danh sách hóa đơn:", err);
            showToast("Không thể tải danh sách hóa đơn", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
        setPagination({ ...pagination, page: 1 }); // Reset to first page
    };

    const handleResetFilters = () => {
        setFilters({
            keyword: "",
            startDate: "",
            endDate: "",
            paymentStatus: "",
        });
        setPagination({ ...pagination, page: 1 });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount || 0);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { text: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-800" },
            SUCCESS: { text: "Đã thanh toán", color: "bg-green-100 text-green-800" },
            FAILED: { text: "Thất bại", color: "bg-red-100 text-red-800" },
        };

        const config = statusConfig[status] || {
            text: status || "—",
            color: "bg-gray-100 text-gray-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-20 overflow-hidden">
                {/* Sidebar */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-6">
                    <div className="flex-1 p-6 mt-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-700">
                                Hóa đơn thuốc
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
                                >
                                    <Filter size={18} />
                                    {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                                </button>
                                <button
                                    onClick={fetchBills}
                                    className="bg-[#008080] hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Làm mới
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Keyword Search */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <User size={16} className="inline mr-1" />
                                            Tên bệnh nhân / SĐT
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            value={filters.keyword}
                                            onChange={(e) =>
                                                handleFilterChange("keyword", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                        />
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Calendar size={16} className="inline mr-1" />
                                            Từ ngày
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) =>
                                                handleFilterChange("startDate", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <Calendar size={16} className="inline mr-1" />
                                            Đến ngày
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) =>
                                                handleFilterChange("endDate", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                        />
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <FileText size={16} className="inline mr-1" />
                                            Trạng thái thanh toán
                                        </label>
                                        <select
                                            value={filters.paymentStatus}
                                            onChange={(e) =>
                                                handleFilterChange("paymentStatus", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="PENDING">Chờ thanh toán</option>
                                            <option value="SUCCESS">Đã thanh toán</option>
                                            <option value="FAILED">Thất bại</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleResetFilters}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        Đặt lại bộ lọc
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Table */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 text-xl">
                                    Đang tải dữ liệu...
                                </div>
                            ) : bills.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 text-xl">
                                    Không có hóa đơn nào
                                </div>
                            ) : (
                                <>
                                    <table className="min-w-full text-center border-collapse">
                                        <thead className="bg-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-bold text-gray-700">
                                                    Mã hóa đơn
                                                </th>
                                                <th className="px-6 py-4 text-left font-bold text-gray-700">
                                                    Bệnh nhân
                                                </th>
                                                <th className="px-6 py-4 text-left font-bold text-gray-700">
                                                    Ngày tạo
                                                </th>
                                                <th className="px-6 py-4 text-left font-bold text-gray-700">
                                                    Tổng tiền
                                                </th>
                                                <th className="px-6 py-4 text-left font-bold text-gray-700">
                                                    Trạng thái thanh toán
                                                </th>
                                                <th className="px-6 py-4 text-left font-bold text-gray-700">
                                                    Phương thức
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {bills.map((bill) => (
                                                <tr
                                                    key={bill.id}
                                                    className="hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4 text-left">
                                                        <span className="font-mono text-sm text-gray-600">
                                                            {bill.id.substring(0, 8)}...
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-left text-gray-700">
                                                        <div>
                                                            <div className="font-medium">
                                                                {bill.patient_name || "—"}
                                                            </div>
                                                            {bill.patient_phone && (
                                                                <div className="text-sm text-gray-500">
                                                                    {bill.patient_phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-left text-gray-700">
                                                        {formatDate(bill.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-left text-gray-700 font-semibold">
                                                        {formatCurrency(bill.total)}
                                                    </td>
                                                    <td className="px-6 py-4 text-left">
                                                        {getStatusBadge(bill.payment_status)}
                                                    </td>
                                                    <td className="px-6 py-4 text-left text-gray-700">
                                                        {bill.payment_method === "CASH"
                                                            ? "Tiền mặt"
                                                            : bill.payment_method === "BANK_TRANSFER"
                                                            ? "Chuyển khoản"
                                                            : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                Trang {pagination.page} / {pagination.totalPages} (
                                                {pagination.total} hóa đơn)
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        setPagination({
                                                            ...pagination,
                                                            page: Math.max(1, pagination.page - 1),
                                                        })
                                                    }
                                                    disabled={pagination.page === 1}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Trước
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setPagination({
                                                            ...pagination,
                                                            page: Math.min(
                                                                pagination.totalPages,
                                                                pagination.page + 1
                                                            ),
                                                        })
                                                    }
                                                    disabled={pagination.page === pagination.totalPages}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Sau
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
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
        </div>
    );
}

