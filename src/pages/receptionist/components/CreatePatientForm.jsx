import React, { useState, useEffect } from "react";

export default function CreatePatientForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        patient_full_name: "",
        patient_address: "",
        patient_phone: "",
        patient_dob: "",
        patient_gender: "NAM",
        fatherORmother_name: "",
        fatherORmother_phone: "",
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

        // Convert các chuỗi trống thành undefined
        const cleanedData = {};
        Object.keys(formData).forEach((key) => {
            let value = formData[key];

            if (value === "") {
                cleanedData[key] = undefined;
                return;
            }

            // ÉP KIỂU NUMBER CHO CÁC FIELD SỐ
            if (["height", "weight", "pulse_rate"].includes(key)) {
                cleanedData[key] = Number(value);
            } else {
                cleanedData[key] = value;
            }
        });

        if (onSubmit) onSubmit(cleanedData);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[760px] rounded-xl shadow-xl p-4 relative text-sm">
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

                <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
                    Thêm bệnh nhân
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* Thông tin bệnh nhân */}
                    <div className="space-y-2 border-r border-gray-200 pr-6">
                        <h3 className="text-base font-semibold text-teal-700 border-b border-gray-200 pb-1">
                            Thông tin bệnh nhân
                        </h3>

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                Họ & tên <span className="text-red-500">*</span>
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

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
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

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="patient_gender"
                                value={formData.patient_gender}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            >
                                <option value="NAM">Nam</option>
                                <option value="NU">Nữ</option>
                                <option value="KHAC">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
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
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
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

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                Họ & tên bố / mẹ
                            </label>
                            <input
                                type="text"
                                name="fatherORmother_name"
                                value={formData.fatherORmother_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                SĐT bố / mẹ
                            </label>
                            <input
                                type="tel"
                                name="fatherORmother_phone"
                                value={formData.fatherORmother_phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>
                    </div>

                    {/* Cột phải: Thông tin gia đình & y tế */}
                    <div className="space-y-2 pl-4">
                        <h3 className="text-base font-semibold text-teal-700 border-b border-gray-200 pb-1">
                            Thông tin sức khỏe
                        </h3>

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                Chiều cao (cm)
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="VD: 175"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                Cân nặng (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="VD: 60"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
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
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
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
                            <label className="block text-gray-700 font-medium mb-0.5 text-sm">
                                Tiền sử bệnh lý
                            </label>
                            <textarea
                                name="medical_history"
                                value={formData.medical_history}
                                onChange={handleChange}
                                rows={5}
                                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 
                                                text-sm focus:ring-1 focus:ring-[#008080]
                                                resize-none overflow-y-auto"/>
                        </div>
                    </div>
                </form>

                {/* Nút tạo */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-[#008080] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition cursor-pointer"
                    >
                        Thêm bệnh nhân
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
