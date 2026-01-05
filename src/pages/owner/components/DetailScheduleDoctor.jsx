import React, { useEffect, useState } from "react";
import { getDoctorDailySchedule } from "../../../api/owner.api";

const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
    });

export default function DetailScheduleDoctor({ workScheduleId }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!workScheduleId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getDoctorDailySchedule(workScheduleId);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [workScheduleId]);

    if (!workScheduleId) {
        return (
            <div className="p-6 text-sm text-slate-500">
                Chọn lịch làm việc để xem chi tiết.
            </div>
        );
    }

    if (loading) {
        return <div className="p-6 text-sm text-slate-500">Đang tải...</div>;
    }

    if (!data) return null;
    const staff = data?.staff;
    const schedule = data?.schedule;

    if (!staff || !schedule) {
        return (
            <div className="p-6 text-sm text-slate-500">
                Không có dữ liệu lịch làm việc.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* STAFF INFO */}
            <div className="rounded-xl border bg-white p-4">
                <div className="text-lg font-semibold text-slate-800">
                    {staff.full_name}
                </div>
                <div className="text-sm text-slate-500">
                    {staff.position || "Bác sĩ"}
                    {staff.department && ` · Khoa ${staff.department}`}
                </div>
            </div>

            {/* DAILY SCHEDULE */}
            <div className="rounded-xl border bg-white overflow-hidden">
                {/* DATE HEADER */}
                <div className="px-4 py-2 bg-slate-50 border-b text-sm font-semibold text-slate-700">
                    {new Date(schedule.work_date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "Asia/Ho_Chi_Minh",
                    })}
                </div>

                {/* SLOTS */}
                <div className="divide-y">
                    {schedule.slots.length === 0 && (
                        <div className="px-4 py-3 text-sm text-slate-500">
                            Không có ca làm
                        </div>
                    )}

                    {schedule.slots.map((slot) => (
                        <div
                            key={slot.id}
                            className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                            <span>
                                {formatTime(slot.slot_start)} -{" "}
                                {formatTime(slot.slot_end)}
                            </span>

                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${slot.is_booked
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-emerald-100 text-emerald-700"
                                    }`}
                            >
                                {slot.is_booked ? "Đã đặt" : "Trống"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
