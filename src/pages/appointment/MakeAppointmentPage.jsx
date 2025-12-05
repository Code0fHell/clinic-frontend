import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;

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

    // Get schedules when doctor or date changes
    useEffect(() => {
        if (!selectedDoctor || !selectedDate) return;
        const fetchSchedules = async () => {
            try {
                const data = await getWorkSchedules(selectedDoctor.id);
                setSchedules(data || []);
            } catch (err) {
                console.error("Lỗi tải lịch làm việc:", err);
            }
        };
        fetchSchedules();
    }, [selectedDoctor, selectedDate]);

    // Get slots when doctor/date changes
    useEffect(() => {
        if (!selectedDoctor || !selectedDate) return;
        const schedule = schedules.find(
            (s) => dayjs(s.work_date).format("YYYY-MM-DD") === selectedDate
        );
        if (!schedule) {
            setSlots([]);
            setSelectedSlot(null);
            return;
        }
        const fetchSlots = async () => {
            try {
                const data = await getAvailableSlots(schedule.id);
                setSlots(data || []);
            } catch (err) {
                console.error("Lỗi tải khung giờ:", err);
            }
        };
        fetchSlots();
    }, [selectedDoctor, selectedDate, schedules]);
    console.log("slots: ", slots)
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
    const validSlots = slots.filter((slot) => {
        const slotDate = dayjs.utc(slot.slot_start).format("YYYY-MM-DD");
        const nowDate = dayjs.utc().format("YYYY-MM-DD");

        // Nếu slot cùng ngày => chỉ lấy slot sau hiện tại
        if (slotDate === nowDate) {
            return dayjs.utc(slot.slot_end).isAfter(dayjs.utc());
        }
        // Nếu slot ở tương lai => luôn hiển thị
        return dayjs.utc(slot.slot_end).isAfter(dayjs.utc());
    });


    // Handle booking
    const handleBook = async (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedSlot) {
            setToast({
                message: "Vui lòng chọn bác sĩ và khung giờ!",
                type: "error",
            });
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
                        "Đặt lịch thành công! Kiểm tra lịch hẹn trong dashboard.",
                    type: "success",
                });
                navigate("/patient/home");
            } else {
                await guestBookAppointment({
                    ...form,
                    ...dto,
                });
                setToast({
                    message: "Vui lòng kiểm tra email để xác nhận lịch hẹn.",
                    type: "info",
                });
                navigate("/home");
            }
        } catch (err) {
            setToast({
                message: err.message || "Đặt lịch thất bại!",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Vietnam timezone helper
    const toVNTime = (date) =>
    dayjs(date).format("HH:mm");

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
                                    className="w-full p-2 border rounded text-sm"
                                    value={selectedDoctor?.id || ""}
                                    onChange={(e) => {
                                        const doctor = doctors.find(
                                            (d) => d.id === e.target.value
                                        );
                                        setSelectedDoctor(doctor || null);
                                        setSelectedSlot(null);
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
                                                className="p-2 border rounded w-full text-sm"
                                                required
                                            />
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
                                                className="p-2 border rounded w-full text-sm"
                                                required
                                            />
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
                                                className="p-2 border rounded w-full text-sm"
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
                                                className="p-2 border rounded w-full text-sm"
                                                required
                                            />
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
                                            className="p-2 border rounded w-full text-sm"
                                            required
                                        />
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
                                    className="w-full p-2 border rounded h-20 text-sm"
                                    required
                                />
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
                                        className={`px-4 py-2 rounded border flex-1 flex flex-col items-center text-sm ${
                                            selectedDate === opt.value &&
                                            !otherDate
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100"
                                        }`}
                                        onClick={() => {
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
                                    className={`px-4 py-2 rounded border flex flex-col items-center text-sm ${
                                        otherDate
                                            ? "bg-blue-600 text-white"
                                            : showDatePicker
                                            ? "bg-blue-100"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setShowDatePicker((v) => !v)}
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
                            <div className="flex flex-wrap gap-2">
                                {slots.length > 0 ? (
                                    validSlots.map((slot) => (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            disabled={slot.is_booked}
                                            onClick={() =>
                                                setSelectedSlot(slot)
                                            }
                                            className={`px-3 py-2 rounded border text-sm ${
                                                selectedSlot?.id === slot.id
                                                    ? "bg-green-600 text-white"
                                                    : ""
                                            } ${
                                                slot.is_booked
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {dayjs.utc(slot.slot_start).format("HH:mm")}
                                        </button>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-sm">
                                        Hiện tại không có lịch trống như quý
                                        khách mong muốn. Quý khách vui lòng lựa
                                        chọn một lịch hẹn khác
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded text-sm"
                        >
                            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </button>
                    </div>
                </form>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </RoleBasedLayout>
    );
};

export default MakeAppointmentPage;
