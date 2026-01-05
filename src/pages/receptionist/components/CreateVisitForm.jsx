import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";

export default function CreateVisitForm({
    onSubmit,
    onClose,
    appointment,
    patient,
    availableDoctors = [],
    // isSubmitting = false,
}) {
    const isFromAppointment = !!appointment;
    const [errors, setErrors] = useState({});
    const validate = () => {
        const newErrors = {};

        if (!isFromAppointment) {
            if (!formData.doctor_id || !formData.work_schedule_detail_id) {
                newErrors.doctor_id = "Vui lòng chọn bác sĩ và khung giờ khám";
            }
        }

        if (isFromAppointment && !doctorAvailableToday) {
            if (!formData.doctor_id || !formData.work_schedule_detail_id) {
                newErrors.doctor_id = "Bác sĩ nghỉ, vui lòng chọn bác sĩ khác";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
        setErrors({});
        if (isFromAppointment) {
            setFormData({
                patient_id: appointment.patient_id || appointment.patient?.id || "",
                // doctor_id: appointment.doctor_id || appointment.doctor?.id || "",
                doctor_id: appointment?.doctor?.is_available === true
                    ? appointment.doctor_id || appointment.doctor?.id
                    : "",
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

    const doctorSlotOptions = useMemo(() => {
        return availableDoctors.flatMap((item) =>
            (item.freeSlots || []).map((slot) => ({
                value: slot.id,
                doctorId: item.doctor.id,
                label: `${item.doctor.user.full_name} — ${item.doctor.department || "-"
                    } — ${slot.slot_start.slice(11, 16)} - ${slot.slot_end.slice(11, 16)}`,
            }))
        );
    }, [availableDoctors]);


    const doctorAvailableToday = useMemo(() => {
        return isFromAppointment && appointment?.doctor?.is_available === true;
    }, [appointment, isFromAppointment]);

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        if (isFromAppointment && !doctorAvailableToday && !formData.doctor_id) {
            setErrors({ doctor_id: "Vui lòng chọn bác sĩ thay thế" });
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

        // console.log("Gửi dữ liệu tạo visit:", payload);
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

                        {/* 1.Bác sĩ có đi làm → KHÓA */}
                        {isFromAppointment && doctorAvailableToday && (
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
                        )}

                        {/* 2.Bác sĩ nghỉ → CHO CHỌN NGƯỜI KHÁC */}
                        {isFromAppointment && !doctorAvailableToday && (
                            <Select
                                options={doctorSlotOptions}
                                placeholder="Bác sĩ nghỉ — chọn bác sĩ khác"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                onChange={(opt) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        doctor_id: opt.doctorId,
                                        work_schedule_detail_id: opt.value,
                                    }));
                                    setErrors({});
                                }}
                            />
                        )}

                        {/* 3. Walk-in */}
                        {!isFromAppointment && (
                            <Select
                                options={doctorSlotOptions}
                                placeholder="-- Chọn bác sĩ và khung giờ --"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                onChange={(opt) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        doctor_id: opt.doctorId,
                                        work_schedule_detail_id: opt.value,
                                    }));
                                    setErrors({});
                                }}
                            />
                        )}

                        {errors.doctor_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.doctor_id}</p>
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
