import React, { useMemo, useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import { getWeeklyScheduleOwner } from "../../api/owner.api";
import DetailScheduleDoctor from "./components/DetailScheduleDoctor";

const ROLES = [
    { key: "all", label: "Tất cả" },
    { key: "RECEPTIONIST", label: "Lễ tân" },
    { key: "DOCTOR", label: "Bác sĩ" },
    { key: "PHARMACIST", label: "Dược sĩ" }
];

const STATUS_LABELS = {
    work: { text: "Làm việc", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    off: { text: "Nghỉ", color: "bg-slate-100 text-slate-700 border-slate-200" },
    leave: { text: "Nghỉ phép", color: "bg-amber-100 text-amber-700 border-amber-200" },
};

const today = new Date();
const toDateInput = (d) => d.toISOString().slice(0, 10);

const getWeekDays = (startDate) => {
    const start = new Date(startDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const iso = toDateInput(d);
        days.push({
            iso,
            label: d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }),
        });
    }
    return days;
};

export default function ManageScheduleStaff() {
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [roleFilter, setRoleFilter] = useState("all");
    const [weekStart, setWeekStart] = useState(toDateInput(today));
    const [data, setData] = useState([]);          // dữ liệu thật từ BE
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

    const loadSchedule = async (reset = false) => {
        if (loading) return;

        setLoading(true);

        const res = await getWeeklyScheduleOwner({
            start_date: weekStart,
            roleType: roleFilter,
            cursor: reset ? null : cursor,
            limit: 10,
        });

        setData(prev =>
            reset ? res.data : [...prev, ...res.data]
        );

        setCursor(res.nextCursor);
        setHasMore(Boolean(res.nextCursor));
        setLoading(false);
    };

    useEffect(() => {
        setCursor(null);
        setHasMore(true);
        loadSchedule(true);
    }, [weekStart, roleFilter]);

    const counts = useMemo(() => {
        const result = { work: 0, off: 0, leave: 0 };

        data.forEach(item => {
            weekDays.forEach(d => {
                const status = item.schedule?.[d.iso]?.status;

                if (status === "WORKING") result.work++;
                else if (status === "LEAVE") result.leave++;
                else result.off++;
            });
        });
        return result;
    }, [data, weekDays]);

    const shiftWeek = (delta) => {
        const start = new Date(weekStart);
        start.setDate(start.getDate() + delta * 7);
        setWeekStart(toDateInput(start));
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* ==== HEADER – CỐ ĐỊNH ==== */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-15 overflow-hidden">
                {/* ==== SIDEBAR – CỐ ĐỊNH ==== */}
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* ==== MAIN CONTENT ====*/}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-4 space-y-4">
                    <div className="flex flex-wrap items-center mt-4">
                        <h1 className="text-2xl font-bold text-gray-700">Quản lý lịch làm việc</h1>
                        {/* <span className="text-sm text-slate-500">Thiết lập lịch cho lễ tân và bác sĩ trong tuần</span> */}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600">Bộ phận</span>
                            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                                {ROLES.map((r) => (
                                    <button
                                        key={r.key}
                                        onClick={() => setRoleFilter(r.key)}
                                        className={`hover:cursor-pointer px-3 py-2 text-sm font-semibold rounded-lg transition ${roleFilter === r.key
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600">Tuần bắt đầu</span>
                            <input
                                type="date"
                                value={weekStart}
                                onChange={(e) => setWeekStart(e.target.value)}
                                className="hover:cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white shadow-sm"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => shiftWeek(-1)}
                                    className="hover:cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    ← Tuần trước
                                </button>
                                <button
                                    onClick={() => shiftWeek(1)}
                                    className="hover:cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Tuần sau →
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold rounded-full px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100">
                                Làm việc: {counts.work}
                            </span>
                            <span className="text-xs font-semibold rounded-full px-3 py-1 bg-slate-50 text-slate-700 border border-slate-100">
                                Nghỉ: {counts.off}
                            </span>
                            <span className="text-xs font-semibold rounded-full px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100">
                                Nghỉ phép: {counts.leave}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
                        <div className="sticky top-0 grid grid-cols-8 bg-slate-50/90 backdrop-blur px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 border-b border-slate-200">
                            <span className="text-left">Nhân sự</span>
                            {weekDays.map((d) => (
                                <span key={d.iso} className="text-center">
                                    {d.label}
                                </span>
                            ))}
                        </div>
                        <div className="flex-1 overflow-auto divide-y divide-slate-100">
                            {data.map((item) => (
                                <div key={item.user.id} className="grid grid-cols-8 items-center px-4 py-3 text-sm odd:bg-slate-50/40">
                                    <div className="flex flex-col gap-0.5 pr-2">
                                        <span className="font-semibold text-slate-900">{item.user.full_name}</span>
                                        <span className="text-xs text-slate-500">
                                            {item.user.role === "DOCTOR"
                                                ? "Bác sĩ"
                                                : item.user.role === "RECEPTIONIST"
                                                    ? "Lễ tân"
                                                    : "Dược sĩ"}
                                            {item.staff?.department ? ` · ${item.staff.department}` : ""}
                                        </span>
                                    </div>
                                    {weekDays.map((d) => {
                                        const day = item.schedule?.[d.iso];
                                        const status = day?.status === "WORKING" ? "work" : "off";
                                        const meta = STATUS_LABELS[status];
                                        return (
                                            <div
                                                key={d.iso}
                                                onClick={() => {
                                                    if (day?.status === "WORKING" && day?.work_schedule_id) {
                                                        setSelectedScheduleId(day.work_schedule_id);
                                                        setOpenDetail(true);
                                                    }
                                                }}
                                                className={`mx-1 rounded-xl border px-2 py-2 text-xs font-semibold text-center
        ${meta.color}
        ${day?.status === "WORKING"
                                                        ? "cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-emerald-300"
                                                        : "cursor-default"
                                                    }`}
                                                title={
                                                    day?.work_schedule_id
                                                        ? `Slots: ${day.booked_slots}/${day.total_slots}`
                                                        : ""
                                                }
                                            >
                                                {meta.text}
                                            </div>

                                        );
                                    })}
                                </div>
                            ))}
                            {!loading && data.length === 0 && (
                                <div className="px-4 py-6 text-sm text-slate-500 text-center">
                                    Không có nhân sự trong bộ lọc này.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                {openDetail && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={() => setOpenDetail(false)}
                        />

                        {/* Drawer */}
                        <div className="relative ml-auto h-full w-[420px] bg-gray-50 shadow-xl overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                                <h2 className="font-semibold text-slate-800">
                                    Chi tiết lịch làm việc
                                </h2>
                                <button
                                    onClick={() => setOpenDetail(false)}
                                    className="text-sm text-slate-500 hover:text-slate-700 hover:cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-4">
                                <DetailScheduleDoctor workScheduleId={selectedScheduleId} />
                            </div>
                        </div>
                    </div>
                )}

            </div >
        </div >
    );
}