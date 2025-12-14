import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    getClinicalDoctors,
    getWorkSchedules,
    getAvailableSlots,
    bookAppointment,
    guestBookAppointment,
} from "../../api/appointment.api";
import { formatDateShort, formatWeekday } from "../../utils/formatDate";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import Toast from "../../components/modals/Toast";
import DatePicker from "../../components/forms/DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const MakeAppointmentPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [otherDate, setOtherDate] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        dob: "",
        gender: "male",
        phone: "",
        email: "",
        reason: "",
    });
    const [toast, setToast] = useState(null);
    const [slotNotice, setSlotNotice] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;

    // Prefill doctor from navigation state (when coming from doctors list)
    useEffect(() => {
        const doctorIdFromState = location.state?.doctorId;
        if (doctorIdFromState && doctors.length > 0) {
            const doctor = doctors.find((d) => d.id === doctorIdFromState);
            if (doctor) {
                setSelectedDoctor(doctor);
            }
        }
    }, [location.state, doctors]);

    // Get doctors on mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getClinicalDoctors();
                setDoctors(data || []);
            } catch (err) {
                console.error("Lỗi tải danh sách bác sĩ:", err);
            }
        };
        fetchDoctors();
    }, []);

    const showToast = (message, type = "error") => {
        setToast({
            message,
            type,
            duration: 6000,
        });
    };

    const validateSelectedDate = (dateStr) => {
        if (!dateStr) return "Vui lòng chọn ngày khám";
        const pickedDate = dayjs(dateStr).startOf("day");
        const today = dayjs().startOf("day");
        const maxDate = today.add(30, "day");

        if (!pickedDate.isValid()) {
            return "Ngày khám không hợp lệ, vui lòng chọn ngày khám trong tương lai không quá 30 ngày";
        }

        if (pickedDate.isBefore(today) || pickedDate.isAfter(maxDate)) {
            return "Ngày khám không hợp lệ, vui lòng chọn ngày khám trong tương lai không quá 30 ngày";
        }
        return "";
    };

    const ensureDoctorSelected = () => {
        if (!selectedDoctor) {
            setSlots([]);
            setSelectedSlot(null);
            const message = "Vui lòng chọn bác sĩ mà bạn muốn thăm khám";
            setSlotNotice(message);
            showToast(message, "error");
            return false;
        }
        return true;
    };

    // Get schedules when doctor or date changes
    useEffect(() => {
        if (!selectedDate) {
            setSlotNotice("Vui lòng chọn ngày khám");
            setSlots([]);
            setSelectedSlot(null);
            return;
        }
        const invalidDateMessage = validateSelectedDate(selectedDate);
        if (invalidDateMessage) {
            setSlotNotice(invalidDateMessage);
            setSlots([]);
            setSelectedSlot(null);
            return;
        }
        if (!selectedDoctor) {
            setSlots([]);
            setSelectedSlot(null);
            setSlotNotice("Vui lòng chọn bác sĩ mà bạn muốn thăm khám");
            return;
        }
        const fetchSchedules = async () => {
            try {
                const data = await getWorkSchedules(selectedDoctor.id, selectedDate);
                setSchedules(data || []);
            } catch (err) {
                console.error("Lỗi tải lịch làm việc:", err);
            }
        };
        fetchSchedules();
    }, [selectedDoctor, selectedDate]);

    // Get slots when doctor/date changes
    useEffect(() => {
        if (!selectedDate || !selectedDoctor) return;
        const schedule = schedules.find(
            (s) => dayjs(s.work_date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD") === selectedDate
        );
        if (!schedule) {
            setSlots([]);
            setSelectedSlot(null);
            setSlotNotice("Bác sĩ không làm việc trong ngày này, vui lòng chọn ngày khác.");
            return;
        }
        const fetchSlots = async () => {
            try {
                const data = await getAvailableSlots(schedule.id);
                setSlots(data || []);
                if (!data || data.length === 0) {
                    setSlotNotice("Bác sĩ đã hết lịch trống trong ngày, vui lòng chọn ngày khác.");
                } else {
                    setSlotNotice("");
                }
            } catch (err) {
                console.error("Lỗi tải khung giờ:", err);
                setSlotNotice("Không thể tải khung giờ. Vui lòng thử lại.");
            }
        };
        fetchSlots();
    }, [selectedDoctor, selectedDate, schedules]);

    const visibleSlots = slots.filter((slot) => {
        const slotDate = dayjs.utc(slot.slot_start).format("YYYY-MM-DD");
        const nowDate = dayjs.utc().format("YYYY-MM-DD");

        if (slotDate === nowDate) {
            return dayjs.utc(slot.slot_end).isAfter(dayjs.utc());
        }
        return dayjs.utc(slot.slot_end).isAfter(dayjs.utc());
    });

    // Date options: today, tomorrow, day after
    const dateOptions = [0, 1, 2].map((offset) => {
        const date = dayjs().add(offset, "day");
        return {
            value: date.format("YYYY-MM-DD"),
            label: (
                <div className="flex flex-col items-center">
                    <span className="font-semibold">
                        {date.format("DD/MM")}
                    </span>
                    <span className="text-xs">{formatWeekday(date)}</span>
                </div>
            ),
        };
    });

    // Lọc các slot còn hợp lệ (chưa qua)
    const validSlots = visibleSlots;

    // Handle booking
    const handleBook = async (e) => {
        e.preventDefault();

        if (!ensureDoctorSelected()) return;

        const dateError = validateSelectedDate(selectedDate);
        if (dateError) {
            showToast(dateError, "error");
            return;
        }

        if (!selectedSlot) {
            const message = "Vui lòng chọn khung giờ thăm khám";
            setSlotNotice(message);
            showToast(message, "error");
            return;
        }

        // Basic form validations
        const nextFieldErrors = {};
        if (!form.reason.trim()) {
            nextFieldErrors.reason = "Vui lòng điền đầy đủ thông tin cần thiết";
        }

        if (!isLoggedIn) {
            if (!form.full_name.trim()) nextFieldErrors.full_name = "Vui lòng điền đầy đủ thông tin";
            if (!form.dob) nextFieldErrors.dob = "Vui lòng điền đầy đủ thông tin";
            if (!form.phone.trim()) nextFieldErrors.phone = "Vui lòng điền đầy đủ thông tin";

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!form.email.trim()) {
                nextFieldErrors.email = "Vui lòng điền đầy đủ thông tin";
            } else if (!emailRegex.test(form.email.trim())) {
                nextFieldErrors.email = "Vui lòng điền đúng định dạng";
            }
        }

        setFieldErrors(nextFieldErrors);
        if (Object.keys(nextFieldErrors).length > 0) {
            showToast(
                nextFieldErrors.email === "Vui lòng điền đúng định dạng"
                    ? "Vui lòng điền đúng định dạng"
                    : "Vui lòng điền đầy đủ thông tin cần thiết",
                "error"
            );
            return;
        }

        setLoading(true);
        try {
            const schedule = schedules.find(
                (s) => dayjs(s.work_date).format("YYYY-MM-DD") === selectedDate
            );
            const dto = {
                doctor_id: selectedDoctor.id,
                schedule_detail_id: selectedSlot.id,
                appointment_date: dayjs().toDate(),
                scheduled_date: dayjs(selectedSlot.slot_start).toDate(),
                reason: form.reason,
            };
            if (isLoggedIn) {
                await bookAppointment(dto);
                setToast({
                    message:
                        "Đặt lịch thành công! Kiểm tra lịch hẹn trong danh sách lịch hẹn.",
                    type: "success",
                    duration: 6000,
                });
                navigate("/patient/appointments");
            } else {
                await guestBookAppointment({
                    ...form,
                    ...dto,
                });
                setToast({
                    message: "Vui lòng kiểm tra email để xác nhận lịch hẹn.",
                    type: "info",
                    duration: 6000,
                });
                navigate("/patient/appointments");
            }
        } catch (err) {
            const errMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Đặt lịch thất bại!";
            setToast({
                message: errMessage,
                type: "error",
                duration: 6000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Vietnam timezone helper
    const toVNTime = (date) => dayjs(date).format("HH:mm");

    // Handle Other Date selection
    const handleOtherDateChange = (date) => {
        setOtherDate(date);
        setSelectedDate(date);
        setShowDatePicker(false);
    };

    return (
        <RoleBasedLayout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Đặt lịch khám</h1>
                <form onSubmit={handleBook}>
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
                        {/* LEFT COLUMN: Doctor + Info */}
                        <div className="flex-1 min-w-[260px]">
                            <div className="mb-4">
                                <label className="block font-semibold mb-1 text-sm">
                                    Bác sĩ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                        className="w-full p-2 border rounded text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                    value={selectedDoctor?.id || ""}
                                    onChange={(e) => {
                                        const doctor = doctors.find(
                                            (d) => d.id === e.target.value
                                        );
                                        setSelectedDoctor(doctor || null);
                                        setSelectedSlot(null);
                                        setSlotNotice("");
                                    }}
                                    required
                                >
                                    <option value="">
                                        Chọn bác sĩ muốn khám
                                    </option>
                                    {doctors.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.user.full_name} – {d.position}{" "}
                                            {d.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {!isLoggedIn && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block font-semibold mb-1 text-sm">
                                                Họ và tên{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder="Họ và tên"
                                                value={form.full_name}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        full_name:
                                                            e.target.value,
                                                    })
                                                }
                                                className={`p-3 border rounded w-full text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
                                                    fieldErrors.full_name
                                                        ? "border-red-500 font-semibold"
                                                        : ""
                                                }`}
                                                required
                                            />
                                            {fieldErrors.full_name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {fieldErrors.full_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block font-semibold mb-1 text-sm">
                                                Ngày sinh{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                placeholder="Ngày sinh"
                                                value={form.dob}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        dob: e.target.value,
                                                    })
                                                }
                                                className={`p-3 border rounded w-full text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
                                                    fieldErrors.dob
                                                        ? "border-red-500 font-semibold"
                                                        : ""
                                                }`}
                                                required
                                            />
                                            {fieldErrors.dob && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {fieldErrors.dob}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block font-semibold mb-1 text-sm">
                                                Giới tính{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                value={form.gender}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        gender: e.target.value,
                                                    })
                                                }
                                                className="p-3 border rounded w-full text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                                required
                                            >
                                                <option value="male">
                                                    Nam
                                                </option>
                                                <option value="female">
                                                    Nữ
                                                </option>
                                                <option value="other">
                                                    Khác
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold mb-1 text-sm">
                                                Số điện thoại{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                placeholder="Số điện thoại"
                                                value={form.phone}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className={`p-3 border rounded w-full text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
                                                    fieldErrors.phone
                                                        ? "border-red-500 font-semibold"
                                                        : ""
                                                }`}
                                                required
                                            />
                                            {fieldErrors.phone && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {fieldErrors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-semibold mb-1 text-sm">
                                            Email{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            placeholder="Email"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value,
                                                })
                                            }
                                            className={`p-3 border rounded w-full text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
                                                fieldErrors.email
                                                    ? "border-red-500 font-semibold"
                                                    : ""
                                            }`}
                                            required
                                        />
                                        {fieldErrors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {fieldErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="mb-4">
                                <label className="block font-semibold mb-1 text-sm">
                                    Lý do khám{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Lý do khám"
                                    value={form.reason}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            reason: e.target.value,
                                        })
                                    }
                                    className={`w-full p-3 border rounded h-24 text-sm transition focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
                                        fieldErrors.reason
                                            ? "border-red-500 font-semibold"
                                            : ""
                                    }`}
                                    required
                                />
                                {fieldErrors.reason && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {fieldErrors.reason}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* RIGHT COLUMN: Date + Slot */}
                        <div className="w-full md:w-[320px]">
                            <label className="block font-semibold mb-1 text-sm">
                                Ngày khám{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2 mb-4">
                                {dateOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`px-4 py-2 rounded border flex-1 flex flex-col items-center text-sm transition hover:border-blue-400 ${
                                            selectedDate === opt.value &&
                                            !otherDate
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100"
                                        }`}
                                        onClick={() => {
                                    if (!ensureDoctorSelected()) return;
                                            setSelectedDate(opt.value);
                                            setOtherDate("");
                                            setShowDatePicker(false);
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                                {/* Ngày khác */}
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded border flex flex-col items-center text-sm transition hover:border-blue-400 ${
                                        otherDate
                                            ? "bg-blue-600 text-white"
                                            : showDatePicker
                                            ? "bg-blue-100"
                                            : "bg-gray-100"
                                    }`}
                                onClick={() => {
                                    if (!ensureDoctorSelected()) return;
                                    setShowDatePicker((v) => !v);
                                }}
                                >
                                    <span>
                                        <i className="fa fa-calendar" />
                                    </span>
                                    <span className="text-xs">
                                        {otherDate
                                            ? dayjs(otherDate).format("DD/MM") +
                                              " " +
                                              formatWeekday(dayjs(otherDate))
                                            : "Ngày khác"}
                                    </span>
                                </button>
                            </div>
                            {showDatePicker && (
                                <div className="mb-4">
                                    <DatePicker
                                        value={otherDate || selectedDate}
                                        onChange={(date) => {
                                            if (!ensureDoctorSelected()) return;
                                            setOtherDate(date);
                                            setSelectedDate(date);
                                            setShowDatePicker(false);
                                        }}
                                    />
                                </div>
                            )}
                            <label className="block font-semibold mb-1 text-sm">
                                Khung giờ{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col gap-2">
                                {slotNotice && (
                                    <span className="text-red-500 text-sm font-semibold">
                                        {slotNotice}
                                    </span>
                                )}
                                {!slotNotice && validSlots.length === 0 && (
                                    <span className="text-gray-500 text-sm">
                                        Hiện tại không có lịch trống như quý
                                        khách mong muốn. Quý khách vui lòng lựa
                                        chọn một lịch hẹn khác
                                    </span>
                                )}
                                {!slotNotice && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {validSlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                disabled={slot.is_booked}
                                                onClick={() =>
                                                    setSelectedSlot(slot)
                                                }
                                                className={`px-4 py-3 min-w-[90px] rounded border text-sm text-center transition hover:border-blue-400 ${
                                                    selectedSlot?.id === slot.id
                                                        ? "bg-green-600 text-white border-green-600"
                                                        : "bg-gray-50 hover:bg-white"
                                                } ${
                                                    slot.is_booked
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                {dayjs
                                                    .utc(slot.slot_start)
                                                    .format("HH:mm")}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded text-sm min-w-[160px]"
                        >
                            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </button>
                    </div>
                </form>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </RoleBasedLayout>
    );
};

export default MakeAppointmentPage;
