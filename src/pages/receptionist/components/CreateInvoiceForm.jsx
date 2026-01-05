import React, { useState, useEffect } from "react";
import Toast from "../../../components/modals/Toast";

export default function CreateInvoiceForm({ visit, onSubmit, onClose }) {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 2000);
    };

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
            // console.log("DEBUG: visit object:", visit);

            // Xác định loại hóa đơn mặc định dựa trên dữ liệu có sẵn
            let defaultBillType = "CLINICAL";
            let total = "";
            let indicationTicketId = "";

            // Kiểm tra có indication_ticket_id và indication_total_fee không
            if (visit.indication_ticket_id && visit.indication_total_fee) {
                defaultBillType = "SERVICE";
                total = Number(visit.indication_total_fee);
                indicationTicketId = visit.indication_ticket_id;
            }
            // Nếu không có indication, kiểm tra clinical_fee
            else if (visit.clinical_fee) {
                defaultBillType = "CLINICAL";
                total = Number(visit.clinical_fee);
            }

            setFormData({
                patient_id: visit.patient?.id || "",
                bill_type: defaultBillType,
                doctor_id: visit.doctor?.id || "",
                medical_ticket_id: visit.medicalTicketId || "",
                indication_ticket_id: indicationTicketId,
                prescription_id: "",
                total: total,
            });
        }
    }, [visit]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedData = { ...formData };

        // Convert total thành number
        if (name === "total") {
            updatedData[name] = value ? Number(value) : "";
        } else {
            updatedData[name] = value;
        }

        // Nếu đổi bill_type, auto-fill total và các field liên quan
        if (name === "bill_type") {
            if (value === "CLINICAL") {
                // Khi chọn CLINICAL, lấy từ clinical_fee
                const clinicalFee = visit?.clinical_fee;
                if (clinicalFee) {
                    updatedData.total = Number(clinicalFee);
                }
                updatedData.medical_ticket_id = visit?.medicalTicketId || "";
                updatedData.indication_ticket_id = "";
            } else if (value === "SERVICE") {
                // Khi chọn SERVICE, lấy từ indication_total_fee
                const indicationTotalFee = visit?.indication_total_fee;
                if (indicationTotalFee) {
                    updatedData.total = Number(indicationTotalFee);
                }
                updatedData.indication_ticket_id = visit?.indication_ticket_id || "";
                updatedData.medical_ticket_id = "";
            }
        }

        setFormData(updatedData);
    };

    // Gửi dữ liệu tạo hóa đơn
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert total to number
        const totalAmount = formData.total ? Number(formData.total) : 0;

        // Validation: kiểm tra indication_ticket_id khi là SERVICE
        if (formData.bill_type === "SERVICE" && !formData.indication_ticket_id) {
            showToast("Chưa có phiếu chỉ định dịch vụ. Vui lòng kiểm tra lại.", "error");
            return;
        }

        // Validation: kiểm tra medical_ticket_id khi là CLINICAL
        if (formData.bill_type === "CLINICAL" && !formData.medical_ticket_id) {
            showToast("Chưa có phiếu khám lâm sàng. Vui lòng kiểm tra lại.", "error");
            return;
        }

        // Validation: kiểm tra total có dữ liệu
        if (!totalAmount || totalAmount <= 0) {
            // const billTypeLabel = formData.bill_type === "CLINICAL" ? "Lâm sàng" : "Dịch vụ";
            showToast("Tổng tiền không được để trống hoặc phải lớn hơn 0", "error");
            return;
        }

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
            total: totalAmount
        };

        // console.log("Payload gửi BE:", payload);
        // console.log("Total type:", typeof payload.total, "Value:", payload.total);
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
            <div className="bg-white w-[600px] rounded-2xl shadow-lg p-6 relative text-sm">
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

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            {/* <option value="MEDICINE">Thuốc</option> */}
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
                        <label className="block text-gray-700 font-medium mb-1">
                            Tổng tiền <span className="text-red-500">*</span>
                            {(formData.bill_type === "CLINICAL" || formData.bill_type === "SERVICE") && formData.total && (
                                <span className="text-green-600 ml-2">✓</span>
                            )}
                        </label>
                        <input
                            type="number"
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                            placeholder={
                                formData.bill_type === "CLINICAL"
                                    ? "Tự động từ phí khám bệnh"
                                    : formData.bill_type === "SERVICE"
                                        ? "Tự động từ phí dịch vụ"
                                        : "Nhập tổng tiền"
                            }
                            disabled={formData.bill_type === "CLINICAL" || formData.bill_type === "SERVICE"}
                            className={`w-full border rounded-lg px-4 py-2 ${(formData.bill_type === "CLINICAL" || formData.bill_type === "SERVICE")
                                ? "bg-gray-100 cursor-not-allowed border-gray-300"
                                : "border-gray-300"
                                }`}
                            required
                            min="1"
                        />
                        {formData.bill_type === "CLINICAL" && (
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.total
                                    ? `Phí khám bệnh: ${Number(formData.total).toLocaleString("vi-VN")} ₫`
                                    : "Lỗi: Phí khám bệnh không có dữ liệu"}
                            </p>
                        )}
                        {formData.bill_type === "SERVICE" && (
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.total
                                    ? `Tổng phí dịch vụ: ${Number(formData.total).toLocaleString("vi-VN")} ₫`
                                    : "Lỗi: Tổng phí dịch vụ không có dữ liệu"}
                            </p>
                        )}
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

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
