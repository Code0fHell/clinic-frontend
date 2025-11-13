import React, { useState, useEffect } from "react";

export default function CreateVisitForm({
    onSubmit,
    onClose,
    appointment,
    patient,
    availableDoctors = [],
}) {
    const isFromAppointment = !!appointment;

    const [formData, setFormData] = useState({
        patient_id: "",
        doctor_id: "",
        appointment_id: "",
        work_schedule_detail_id: "",
        visit_type: "",
        visit_status: "",
        checked_in_at: new Date().toISOString(),
        completed_at: new Date().toISOString() // Thời gian tạo visit, sau khi bác sĩ khám xong sẽ cập nhật lại trang thái này
    });

    // --- Tự động fill dữ liệu ---
    useEffect(() => {
        if (isFromAppointment) {
            setFormData({
                patient_id: appointment.patient_id || appointment.patient?.id || "",
                doctor_id: appointment.doctor_id || appointment.doctor?.id || "",
                appointment_id: appointment.id || appointment.appointment_id || "",
                work_schedule_detail_id: "",
                visit_type: "APPOINTMENT",
                visit_status: "CHECKED_IN",
                checked_in_at: new Date().toISOString(),
                completed_at: new Date().toISOString()
            });
        } else if (patient) {
            setFormData({
                patient_id: patient.id,
                doctor_id: "",
                appointment_id: "",
                work_schedule_detail_id: "",
                visit_type: "WALK_IN",
                visit_status: "CHECKED_IN",
                checked_in_at: new Date().toISOString(),
                completed_at: new Date().toISOString()
            });
        }
    }, [appointment, patient, isFromAppointment]);

    // Khi chọn bác sĩ
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Nếu người dùng chọn work_schedule_detail_id
        if (name === "work_schedule_detail_id") {
            // Tìm ra bác sĩ tương ứng với slot được chọn
            const foundDoctor = availableDoctors.find((d) =>
                d.freeSlots.some((slot) => slot.id === value)
            );

            const doctorId = foundDoctor ? foundDoctor.doctor.id : "";

            setFormData((prev) => ({
                ...prev,
                work_schedule_detail_id: value,
                doctor_id: doctorId,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFromAppointment && !formData.doctor_id) {
            alert("Vui lòng chọn bác sĩ trước khi tạo thăm khám.");
            return;
        }

        const payload = {
            patient_id: formData.patient_id,
            doctor_id: formData.doctor_id,
            appointment_id: formData.appointment_id || undefined,
            work_schedule_detail_id: formData.work_schedule_detail_id || undefined,
            visit_type: formData.visit_type,
            visit_status: formData.visit_status,
            checked_in_at: formData.checked_in_at,
            completed_at: formData.completed_at || null,
        };

        console.log("Gửi dữ liệu tạo visit:", payload);
        onSubmit?.(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[700px] rounded-2xl shadow-lg p-6 relative">
                {/* Nút đóng */}
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

                <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                    {isFromAppointment
                        ? "Tạo thăm khám từ lịch hẹn"
                        : "Tạo thăm khám trực tiếp"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Bệnh nhân */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Bệnh nhân <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={
                                isFromAppointment
                                    ? appointment.patient_name ||
                                    appointment.patient?.user?.full_name ||
                                    "Không xác định"
                                    : patient?.patient_full_name ||
                                    patient?.user?.full_name ||
                                    "Không xác định"
                            }
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Bác sĩ */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Bác sĩ phụ trách <span className="text-red-500">*</span>
                        </label>
                        {isFromAppointment ? (
                            <input
                                type="text"
                                value={
                                    appointment.doctor_name ||
                                    appointment.doctor?.user?.full_name ||
                                    "Không xác định"
                                }
                                disabled
                                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                            />
                        ) : (
                            <select
                                name="work_schedule_detail_id"
                                value={formData.work_schedule_detail_id}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#008080]"
                            >
                                <option value="">-- Chọn bác sĩ và khung giờ --</option>
                                {availableDoctors.map((item) => (
                                    item.freeSlots.map((slot) => (
                                        <option key={slot.id} value={slot.id}>
                                            {item.doctor.user.full_name} — {item.doctor.department || " - "} —
                                            {slot.slot_start.replace('T', ' ').slice(11, 16)} - {slot.slot_end.replace('T', ' ').slice(11, 16)}
                                        </option>
                                    ))
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Loại thăm khám */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Loại thăm khám
                        </label>
                        <input
                            type="text"
                            value={
                                formData.visit_type === "APPOINTMENT"
                                    ? "Đặt lịch"
                                    : "Trực tiếp"
                            }
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Trạng thái
                        </label>
                        <input
                            type="text"
                            value={
                                formData.visit_status === "CHECKED_IN"
                                    ? "Chờ khám"
                                    : formData.visit_status === "IN_PROGRESS"
                                        ? "Đang khám"
                                        : "Khác"
                            }
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Nút submit */}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-[#008080] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition cursor-pointer"
                        >
                            Tạo thăm khám
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
