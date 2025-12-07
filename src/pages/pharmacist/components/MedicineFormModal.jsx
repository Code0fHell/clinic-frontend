import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createMedicine, updateMedicine } from "../../../api/medicine.api";
import Toast from "../../../components/modals/Toast";

export default function MedicineFormModal({ medicine, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        description: "",
        price: "",
        category: "",
        unit: "",
        stock: "",
        manufacturer: "",
        expiry_date: "",
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        if (medicine) {
            setFormData({
                name: medicine.name || "",
                image: medicine.image || "",
                description: medicine.description || "",
                price: medicine.price || "",
                category: medicine.category || "",
                unit: medicine.unit || "",
                stock: medicine.stock !== undefined ? medicine.stock : "",
                manufacturer: medicine.manufacturer || "",
                expiry_date: medicine.expiry_date ? new Date(medicine.expiry_date).toISOString().split('T')[0] : "",
            });
        }
    }, [medicine]);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            showToast("Vui lòng nhập tên thuốc", "error");
            return;
        }
        if (!formData.price || parseFloat(formData.price) < 0) {
            showToast("Vui lòng nhập giá hợp lệ", "error");
            return;
        }

        try {
            setLoading(true);
            const submitData = {
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                ...(formData.image && { image: formData.image.trim() }),
                ...(formData.description && { description: formData.description.trim() }),
                ...(formData.category && { category: formData.category.trim() }),
                ...(formData.unit && { unit: formData.unit.trim() }),
                ...(formData.stock !== "" && { stock: parseInt(formData.stock) || 0 }),
                ...(formData.manufacturer && { manufacturer: formData.manufacturer.trim() }),
                ...(formData.expiry_date && { expiry_date: formData.expiry_date }),
            };

            if (medicine) {
                await updateMedicine(medicine.id, submitData);
            } else {
                await createMedicine(submitData);
            }

            onSuccess();
        } catch (err) {
            console.error("Lỗi khi lưu thuốc:", err);
            const message = err?.response?.data?.message || err?.message || "Không thể lưu thuốc";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {medicine ? "Chỉnh sửa thuốc" : "Thêm thuốc mới"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên thuốc <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                            placeholder="Nhập tên thuốc"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tồn kho
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                placeholder="Ví dụ: Kháng sinh, Giảm đau..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đơn vị
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                placeholder="Ví dụ: Viên, Hộp, Lọ..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nhà sản xuất
                        </label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                            placeholder="Tên nhà sản xuất"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL hình ảnh
                        </label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày hết hạn
                        </label>
                        <input
                            type="date"
                            name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả / Hướng dẫn sử dụng
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080]"
                            placeholder="Nhập mô tả hoặc hướng dẫn sử dụng..."
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#008080] text-white rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Đang lưu..." : medicine ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
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


