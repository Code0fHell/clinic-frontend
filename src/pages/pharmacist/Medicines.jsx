import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { getAllMedicines, searchMedicines } from "../../api/medicine.api";
import Toast from "../../components/modals/Toast";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";
import MedicineFormModal from "./components/MedicineFormModal";

export default function PharmacistMedicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const res = await getAllMedicines();
            const data = res?.data || res || [];
            setMedicines(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách thuốc:", err);
            showToast("Không thể tải danh sách thuốc", "error");
        } finally {
            setLoading(false);
        }
    };

    const categories = useMemo(() => {
        const cats = new Set(medicines.map((m) => m.category).filter(Boolean));
        return Array.from(cats);
    }, [medicines]);

    const filteredMedicines = useMemo(() => {
        let filtered = medicines;

        if (selectedCategory !== "ALL") {
            filtered = filtered.filter((m) => m.category === selectedCategory);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((m) =>
                m.name?.toLowerCase().includes(term) ||
                m.description?.toLowerCase().includes(term) ||
                m.manufacturer?.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [medicines, selectedCategory, searchTerm]);

    const paginatedMedicines = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredMedicines.slice(start, end);
    }, [filteredMedicines, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

    const handleAddNew = () => {
        setEditingMedicine(null);
        setIsFormOpen(true);
    };

    const handleEdit = (medicine) => {
        setEditingMedicine(medicine);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingMedicine(null);
    };

    const handleFormSuccess = () => {
        fetchMedicines();
        handleFormClose();
        showToast(editingMedicine ? "Cập nhật thuốc thành công" : "Thêm thuốc thành công");
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const getStockStatus = (stock) => {
        if (stock === undefined || stock === null) return { text: "—", color: "gray" };
        if (stock === 0) return { text: "Hết hàng", color: "red" };
        if (stock < 10) return { text: "Sắp hết", color: "orange" };
        return { text: "Còn hàng", color: "green" };
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
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-700">Quản lý thuốc</h2>
                            <button
                                onClick={handleAddNew}
                                className="bg-[#008080] hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Thêm thuốc mới
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="mb-6 flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, mô tả, nhà sản xuất..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#008080]"
                            >
                                <option value="ALL">Tất cả danh mục</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 text-xl">
                                    Đang tải dữ liệu...
                                </div>
                            ) : (
                                <table className="min-w-full text-center border-collapse">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Tên thuốc</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Danh mục</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Giá</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Tồn kho</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Trạng thái</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Hạn sử dụng</th>
                                            <th className="px-6 py-4 text-left font-bold text-gray-700">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedMedicines.length > 0 ? (
                                            paginatedMedicines.map((medicine) => {
                                                const stockStatus = getStockStatus(medicine.stock);
                                                return (
                                                    <tr key={medicine.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-left">
                                                            <div className="font-semibold text-gray-800">{medicine.name}</div>
                                                            {medicine.manufacturer && (
                                                                <div className="text-sm text-gray-500">{medicine.manufacturer}</div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-left text-gray-700">
                                                            {medicine.category || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-left text-gray-700 font-semibold">
                                                            {formatCurrency(medicine.price)}
                                                        </td>
                                                        <td className="px-6 py-4 text-left text-gray-700">
                                                            {medicine.stock !== undefined ? `${medicine.stock} ${medicine.unit || ""}` : "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-left">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                    stockStatus.color === "red"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : stockStatus.color === "orange"
                                                                        ? "bg-orange-100 text-orange-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {stockStatus.text}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-left text-gray-700">
                                                            {formatDate(medicine.expiry_date)}
                                                        </td>
                                                        <td className="px-6 py-4 text-left">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(medicine)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                                    title="Chỉnh sửa"
                                                                >
                                                                    <Edit size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                    Không tìm thấy thuốc nào.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700">Hiển thị:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span className="text-gray-700">
                                            ({filteredMedicines.length} kết quả)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                        >
                                            Trước
                                        </button>
                                        <span className="px-4 py-2 text-gray-700">
                                            Trang {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Medicine Form Modal */}
            {isFormOpen && (
                <MedicineFormModal
                    medicine={editingMedicine}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}

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


