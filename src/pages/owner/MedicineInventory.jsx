import React, { useEffect, useState, useRef } from "react";
import { getAllMedicines, updateMedicine, createMedicine, deleteMedicine } from "../../api/medicine.api";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Search, Plus, Trash2, Edit2, AlertCircle } from "lucide-react";
import MedicineSalesChart from "./components/MedicineSalesChart";
import { getMedicineSales } from "../../api/owner.api";

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

export default function MedicineInventory() {
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        unit: "",
        price: "",
        stock: "",
        manufacturer: "",
    });

    // Sales chart states
    const todayVN = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-CA", {
            timeZone: "Asia/Ho_Chi_Minh",
        });
    const defaultStart = fmt(todayVN);
    const defaultEnd = fmt(todayVN);
    const [salesStartDate, setSalesStartDate] = useState(defaultStart);
    const [salesEndDate, setSalesEndDate] = useState(defaultEnd);
    const [salesData, setSalesData] = useState([]);
    const [salesLoading, setSalesLoading] = useState(false);
    const [salesError, setSalesError] = useState(null);

    // Fetch medicines
    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const res = await getAllMedicines();
            setMedicines(res.data || []);
            setFilteredMedicines(res.data || []);
        } catch (error) {
            showToast("Lỗi tải dữ liệu thuốc", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
        fetchSales();
    }, []);

    // Fetch medicine sales for chart
    const fetchSales = async () => {
        setSalesLoading(true);
        setSalesError(null);
        try {
            const res = await getMedicineSales({ startDate: salesStartDate, endDate: salesEndDate });

            const formatted = (res || []).map((it) => ({
                label: it.name || it.label || it.medicineName || (it.medicine && it.medicine.name) || "—",
                quantity: it.quantity ?? it.qty ?? it.soldQuantity ?? it.sold ?? it.value ?? 0,
            }));

            setSalesData(formatted);
        } catch (err) {
            console.error(err);
            setSalesError("Không thể tải dữ liệu bán hàng");
            setSalesData([]);
        } finally {
            setSalesLoading(false);
        }
    };

    // Search medicines with debounce
    useEffect(() => {
        const filtered = medicines.filter(
            (med) =>
                med.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                med.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        setFilteredMedicines(filtered);
        setCurrentPage(1);
    }, [debouncedSearchTerm, medicines]);

    // Show toast
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            category: "",
            unit: "",
            price: "",
            stock: "",
            manufacturer: "",
        });
        setEditingId(null);
    };

    // Pagination
    const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
    const paginatedMedicines = filteredMedicines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Check low stock
    const isLowStock = (stock) => {
        return stock <= 10;
    };

    return (
        <div className="h-screen bg-gray-50 font-sans flex flex-col overflow-hidden">
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16 overflow-hidden">
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <SideBar />
                </div>

                <main className="flex-1 ml-24 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-wrap items-center mt-4">
                                <h1 className="text-2xl font-bold text-gray-700">Quản lý tồn kho thuốc</h1>
                            </div>
                            {/* <button
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                            >
                                <Plus size={20} />
                                Thêm thuốc mới
                            </button> */}
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc loại thuốc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-teal-500">
                                <p className="text-gray-600 text-sm">Tổng thuốc</p>
                                <p className="text-2xl font-bold text-gray-800">{medicines.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                <p className="text-gray-600 text-sm">Đang kinh doanh</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {medicines.filter((m) => m.stock > 0).length}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                                <p className="text-gray-600 text-sm">Hết hàng</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {medicines.filter((m) => m.stock === 0).length}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                                <p className="text-gray-600 text-sm">Sắp hết</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {medicines.filter((m) => isLowStock(m.stock)).length}
                                </p>
                            </div>
                        </div>

                        {/* Sales Chart */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Báo cáo bán hàng theo thuốc</p>
                                    <p className="text-xs text-gray-400">Chọn ngày hoặc khoảng để xem số lượng bán</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={salesStartDate}
                                        onChange={(e) => setSalesStartDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <span className="text-gray-500">→</span>
                                    <input
                                        type="date"
                                        value={salesEndDate}
                                        onChange={(e) => setSalesEndDate(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        onClick={fetchSales}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                    >
                                        Xem
                                    </button>
                                </div>
                            </div>

                            <MedicineSalesChart data={salesData} isLoading={salesLoading} error={salesError} />
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Tên thuốc</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Loại</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Đơn vị</th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-700">Giá nhập</th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-700">Giá bán</th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-700">Tồn kho</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                                            <th className="px-6 py-3 text-center font-semibold text-gray-700">Ngày hết hạn</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                    Đang tải...
                                                </td>
                                            </tr>
                                        ) : paginatedMedicines.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedMedicines.map((medicine) => (
                                                <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-3 font-semibold text-gray-800">{medicine.name}</td>
                                                    <td className="px-6 py-3 text-gray-600">{medicine.category}</td>
                                                    <td className="px-6 py-3 text-gray-600">{medicine.unit}</td>
                                                    <td className="px-6 py-3 text-right text-gray-800 font-semibold">
                                                        {Number(medicine.import_price).toLocaleString("vi-VN")} ₫
                                                    </td>
                                                    <td className="px-6 py-3 text-right text-gray-800 font-semibold">
                                                        {Number(medicine.price).toLocaleString("vi-VN")} ₫
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${medicine.stock === 0
                                                                ? "bg-red-100 text-red-700"
                                                                : isLowStock(medicine.stock)
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-green-100 text-green-700"
                                                                }`}
                                                        >
                                                            {medicine.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        {medicine.stock === 0 ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded">
                                                                <AlertCircle size={14} />
                                                                Hết hàng
                                                            </span>
                                                        ) : isLowStock(medicine.stock) ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded">
                                                                <AlertCircle size={14} />
                                                                Sắp hết
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded">
                                                                Bình thường
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-600 text-center">{medicine.expiry_date}</td>
                                                    {/* <td className="px-6 py-3 text-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(medicine)}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(medicine.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td> */}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Trang {currentPage} của {totalPages} ({filteredMedicines.length} kết quả)
                                </p>

                                <div className="flex gap-1">
                                    {/* Prev */}
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-2 py-1 border border-gray-300 rounded-md
                   hover:bg-gray-50 disabled:opacity-50 hover:cursor-pointer"
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>

                                    {/* Pages */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-2 py-1 text-sm rounded-md transition hover:cursor-pointer
            ${currentPage === page
                                                    ? "bg-teal-600 text-white"
                                                    : "border border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-2 py-1 border border-gray-300 rounded-md
                   hover:bg-gray-50 disabled:opacity-50 hover:cursor-pointer"
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition-all ${toast.type === "success"
                        ? "bg-green-500"
                        : toast.type === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
