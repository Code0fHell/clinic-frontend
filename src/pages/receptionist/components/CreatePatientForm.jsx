import React, { useState, useEffect } from "react";

export default function CreatePatientForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        patient_full_name: "",
        patient_address: "",
        patient_phone: "",
        patient_dob: "",
        patient_gender: "MALE",
        father_or_mother_name: "",
        father_or_mother_phone: "",
        height: "",
        weight: "",
        blood_type: "",
        respiratory_rate: "",
        medical_history: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Khi người dùng nhập lại -> xóa lỗi cũ
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.patient_full_name.trim())
            newErrors.patient_full_name = "Vui lòng nhập họ và tên";
        if (!formData.patient_address.trim())
            newErrors.patient_address = "Vui lòng nhập địa chỉ";
        if (!formData.patient_dob)
            newErrors.patient_dob = "Vui lòng chọn ngày sinh";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        if (onSubmit) onSubmit(formData);
    };


    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
                {/* Nút đóng */}
                {onClose && (
                    <button
                        onClick={onClose}
                        type="button"
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}

                <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                    Thêm bệnh nhân
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* Thông tin bệnh nhân */}
                    <div className="space-y-4 border-r border-gray-200 pr-6">
                        <h3 className="text-lg font-semibold text-teal-700 border-b border-gray-200 pb-1">
                            Thông tin bệnh nhân
                        </h3>

                        {/* Họ và tên */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="patient_full_name"
                                value={formData.patient_full_name}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080] ${errors.patient_full_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {errors.patient_full_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.patient_full_name}
                                </p>
                            )}
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="patient_dob"
                                value={formData.patient_dob}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080] ${errors.patient_dob
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {errors.patient_dob && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.patient_dob}
                                </p>
                            )}
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="patient_gender"
                                value={formData.patient_gender}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="patient_address"
                                value={formData.patient_address}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080] ${errors.patient_address
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {errors.patient_address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.patient_address}
                                </p>
                            )}
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="patient_phone"
                                value={formData.patient_phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                            {errors.patient_phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.patient_phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Cột phải: Thông tin gia đình & y tế */}
                    <div className="space-y-4 pl-4">
                        <h3 className="text-lg font-semibold text-teal-700 border-b border-gray-200 pb-1">
                            Thông tin gia đình & y tế
                        </h3>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Họ và tên bố / mẹ
                            </label>
                            <input
                                type="text"
                                name="guardian_name"
                                value={formData.father_or_mother_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                SĐT bố / mẹ
                            </label>
                            <input
                                type="tel"
                                name="guardian_phone"
                                value={formData.father_or_mother_phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Nhóm máu
                            </label>
                            <input
                                type="text"
                                name="blood_type"
                                value={formData.blood_type}
                                onChange={handleChange}
                                placeholder="A, B, AB, O..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Tần số hô hấp
                            </label>
                            <input
                                type="text"
                                name="respiratory_rate"
                                value={formData.respiratory_rate}
                                onChange={handleChange}
                                placeholder="VD: 18 lần/phút"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Tiền sử bệnh lý
                            </label>
                            <textarea
                                name="medical_history"
                                value={formData.medical_history}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>
                    </div>
                </form>

                {/* Nút tạo */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-[#008080] hover:bg-teal-700 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
                    >
                        Tạo bệnh nhân
                    </button>
                </div>
            </div>
        </div>
    );
}
