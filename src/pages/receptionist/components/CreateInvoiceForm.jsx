import React, { useState, useEffect } from "react";

export default function CreateInvoiceForm({ visit, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        patient_id: visit?.patient?.id || "",
        bill_type: "CLINICAL",
        doctor_id: visit?.doctor?.id || "",
        medical_ticket_id: visit?.medicalTicketId || "",
        indication_ticket_id: "",
        prescription_id: "",
        total: "",
    });

    useEffect(() => {
        if (visit) {
            setFormData({
                patient_id: visit.patient?.id || "",
                bill_type: "CLINICAL",
                doctor_id: visit.doctor?.id || "",
                medical_ticket_id: visit.medicalTicketId || "",
                indication_ticket_id: "",
                prescription_id: "",
                total: "",
            });
        }
    }, [visit]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Gửi dữ liệu tạo hóa đơn
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            patient_id: formData.patient_id,
            doctor_id: formData.doctor_id,
            bill_type: formData.bill_type,
            medical_ticket_id:
                formData.bill_type === "CLINICAL" ? formData.medical_ticket_id : null,
            indication_ticket_id:
                formData.bill_type === "SERVICE" ? formData.indication_ticket_id : null,
            prescription_id:
                formData.bill_type === "MEDICINE" ? formData.prescription_id : null,
            // total: formData.total || 0,
        };

        console.log("Payload gửi BE:", payload);
        onSubmit?.(payload);
    };

    // format ngày hiển thị Việt Nam
    const formatDateVN = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        });
    };


    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-2xl shadow-lg p-8 relative">
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-left">Phiếu hóa đơn</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tên bệnh nhân */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tên bệnh nhân</label>
                        <input
                            type="text"
                            value={visit?.patient?.name || "Không xác định"}
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Loại hóa đơn */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Loại hóa đơn <span className="text-red-500">*</span></label>
                        <select
                            name="bill_type"
                            value={formData.bill_type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="CLINICAL">Lâm sàng</option>
                            <option value="SERVICE">Dịch vụ</option>
                            <option value="MEDICINE">Thuốc</option>
                        </select>
                    </div>

                    {/* Bác sĩ */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Bác sĩ</label>
                        <input
                            type="text"
                            value={visit?.doctor?.name || ""}
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Người tạo */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Người tạo</label>
                        <input
                            type="text"
                            value={visit?.creator || "Không xác định"}
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Ngày tạo */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Ngày tạo</label>
                        <input
                            type="text"
                            value={formatDateVN(new Date().toISOString())}
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2"
                        />
                    </div>


                    {/* Tổng tiền */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Tổng tiền <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                            placeholder="Nhập tổng tiền"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="submit"
                            className="bg-[#008080] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition cursor-pointer"
                        >
                            Tạo hóa đơn
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
