import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getClinicalDoctors,
    getWorkSchedules,
    getAvailableSlots,
    bookAppointment,
    guestBookAppointment,
} from "../../api/appointment.api";
import {
    formatDateShort,
    formatWeekday,
    formatTime,
} from "../../utils/formatDate";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import Toast from "../../components/modals/Toast";

const MakeAppointmentPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
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
    const token = localStorage.getItem("token");
    console.log("doctors: ", doctors);

    // Gọi 1 lần duy nhất khi trang load để lấy danh sách bác sĩ
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

    // Gọi API lấy lịch làm việc khi chọn bác sĩ
    useEffect(() => {
        if (!selectedDoctor) return;

        const fetchSchedules = async () => {
            try {
                setSchedules([]); // reset danh sách cũ
                const data = await getWorkSchedules(selectedDoctor.id);
                setSchedules(data || []);
            } catch (err) {
                console.error("Lỗi tải lịch làm việc:", err);
            }
        };

        fetchSchedules();
    }, [selectedDoctor]);

    useEffect(() => {
        if (!selectedSchedule) return;

        // Chỉ gọi 1 lần mỗi khi người dùng chọn 1 schedule mới
        const fetchSlots = async () => {
            try {
                const data = await getAvailableSlots(selectedSchedule.id);
                setSlots(data || []); // chỉ lưu slot riêng, không setSelectedSchedule nữa
            } catch (err) {
                console.error("Lỗi tải khung giờ:", err);
            }
        };

        fetchSlots();
    }, [selectedSchedule?.id]); // chỉ trigger khi id thay đổi

    const handleBook = async (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedSlot) {
            alert("Vui lòng chọn bác sĩ và khung giờ!");
            return;
        }

        setLoading(true);
        try {
            const dto = {
                doctor_id: selectedDoctor.id,
                schedule_detail_id: selectedSlot.id,
                appointment_date: selectedSchedule.work_date,
                ...form,
            };

            if (token) {
                await bookAppointment(dto);
                setToast({
                    message:
                        "Your appointment is booked! Let's check in the appointment dashboard.",
                    type: "success",
                });
            } else {
                await guestBookAppointment(dto);
                setToast({
                    message:
                        "Let's check your email for the account to see your appointment.",
                    type: "info",
                });
            }

            navigate("/home");
        } catch (err) {
            console.error(err);
            alert(err.message || "Đặt lịch thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleBasedLayout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Đặt lịch khám</h1>

                {/* --- Chọn bác sĩ --- */}
                <section className="mb-6">
                    <label className="block font-semibold mb-2">Bác sĩ</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedDoctor?.id || ""}
                        onChange={(e) => {
                            const doctor = doctors.find(
                                (d) => d.id === e.target.value
                            );
                            setSelectedDoctor(doctor || null);
                            setSelectedSchedule(null);
                            setSelectedSlot(null);
                        }}
                    >
                        <option value="">Chọn bác sĩ muốn khám</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.user.full_name} – {d.position} {d.department}
                            </option>
                        ))}
                    </select>
                </section>

                {/* --- Chọn lịch làm việc --- */}
                {schedules.length > 0 && (
                    <section className="mb-6">
                        <label className="block font-semibold mb-2">
                            Thời gian khám
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {schedules.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedSchedule(s);
                                        setSelectedSlot(null);
                                    }}
                                    className={`px-3 py-2 rounded border ${
                                        selectedSchedule?.id === s.id
                                            ? "bg-blue-600 text-white"
                                            : ""
                                    }`}
                                >
                                    <div className="text-sm">
                                        {formatDateShort(s.work_date)}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {formatWeekday(s.work_date)}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* --- Chọn khung giờ --- */}
                        {slots.length > 0 && (
                            <div className="mt-4">
                                <div className="text-sm font-medium mb-2">
                                    Khung giờ
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.id}
                                            disabled={slot.is_booked}
                                            onClick={() =>
                                                setSelectedSlot(slot)
                                            }
                                            className={`px-3 py-2 rounded border ${
                                                selectedSlot?.id === slot.id
                                                    ? "bg-green-600 text-white"
                                                    : ""
                                            } ${
                                                slot.is_booked
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {formatTime(slot.slot_start)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* --- Form thông tin khách hàng --- */}
                <form onSubmit={handleBook}>
                    <h2 className="text-lg font-semibold mb-3">
                        Thông tin khách hàng
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            placeholder="Họ và tên"
                            value={form.full_name}
                            onChange={(e) =>
                                setForm({ ...form, full_name: e.target.value })
                            }
                            className="p-2 border rounded col-span-1 md:col-span-2"
                        />
                        <input
                          type={form.dob ? "date" : "text"}
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => {
                            if (!form.dob) e.target.type = "text";
                          }}
                          placeholder="Ngày sinh"
                          value={form.dob}
                          onChange={(e) => setForm({ ...form, dob: e.target.value })}
                          className="p-2 border rounded"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                            value={form.gender}
                            onChange={(e) =>
                                setForm({ ...form, gender: e.target.value })
                            }
                            className="p-2 border rounded"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>

                        <input
                            placeholder="Số điện thoại"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            className="p-2 border rounded"
                        />
                        <input
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className="p-2 border rounded"
                        />
                    </div>

                    <textarea
                        placeholder="Lý do khám"
                        value={form.reason}
                        onChange={(e) =>
                            setForm({ ...form, reason: e.target.value })
                        }
                        className="w-full p-3 border rounded h-32 mb-4"
                    />

                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
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
