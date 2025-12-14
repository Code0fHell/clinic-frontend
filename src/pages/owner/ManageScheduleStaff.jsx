import React, { useMemo, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";

const ROLES = [
    { key: "all", label: "Tất cả" },
    { key: "receptionist", label: "Lễ tân" },
    { key: "doctor", label: "Bác sĩ" },
    {key: "pharmacist", label: "Dược sĩ"}
];

const STATUS_LABELS = {
    work: { text: "Làm việc", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    off: { text: "Nghỉ", color: "bg-slate-100 text-slate-700 border-slate-200" },
    leave: { text: "Nghỉ phép", color: "bg-amber-100 text-amber-700 border-amber-200" },
};

const MOCK_STAFF = [
    { id: 1, name: "Nguyễn Lan", role: "receptionist", dept: "Quầy lễ tân" },
    { id: 2, name: "Trần Minh", role: "receptionist", dept: "Quầy lễ tân" },
    { id: 3, name: "BS. Phạm An", role: "doctor", dept: "Nội tổng quát" },
    { id: 4, name: "BS. Lê Huy", role: "doctor", dept: "Răng hàm mặt" },
    { id: 5, name: "BS. Hoàng My", role: "doctor", dept: "Nhi" },
    { id: 5, name: "BS. Hoàng My 2", role: "doctor", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 3", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 4", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 5", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 6", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 7", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 8", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 9", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 10", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 11", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 12", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 13", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 14", role: "pharmacist", dept: "Nhi" },
    { id: 5, name: "DS. Hoàng My 15", role: "pharmacist", dept: "Nhi" },
];

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
    const [roleFilter, setRoleFilter] = useState("all");
    const [weekStart, setWeekStart] = useState(toDateInput(today));
    const [schedule, setSchedule] = useState(() => {
        const initial = {};
        const days = getWeekDays(toDateInput(today));
        MOCK_STAFF.forEach((s) => {
            initial[s.id] = {};
            days.forEach((d, idx) => {
                initial[s.id][d.iso] = idx % 6 === 5 ? "off" : "work"; // mặc định nghỉ CN
            });
        });
        return initial;
    });

    const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

    const filteredStaff = useMemo(
        () => (roleFilter === "all" ? MOCK_STAFF : MOCK_STAFF.filter((s) => s.role === roleFilter)),
        [roleFilter]
    );

    const counts = useMemo(() => {
        const result = { work: 0, off: 0, leave: 0 };
        filteredStaff.forEach((s) => {
            weekDays.forEach((d) => {
                const st = schedule[s.id]?.[d.iso] ?? "off";
                result[st] += 1;
            });
        });
        return result;
    }, [filteredStaff, schedule, weekDays]);

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

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold">Chú thích:</span>
                        <span className="px-2 py-1 rounded-full border bg-emerald-100 border-emerald-200 text-emerald-700">Làm việc</span>
                        <span className="px-2 py-1 rounded-full border bg-slate-100 border-slate-200 text-slate-700">Nghỉ</span>
                        <span className="px-2 py-1 rounded-full border bg-amber-100 border-amber-200 text-amber-700">Nghỉ phép</span>
                        {/* <span className="ml-3">Hiển thị lịch do admin đã xếp; chỉ xem, không chỉnh sửa.</span> */}
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
                            {filteredStaff.map((staff) => (
                                <div key={staff.id} className="grid grid-cols-8 items-center px-4 py-3 text-sm odd:bg-slate-50/40">
                                    <div className="flex flex-col gap-0.5 pr-2">
                                        <span className="font-semibold text-slate-900">{staff.name}</span>
                                        <span className="text-xs text-slate-500">
                                            {staff.role === "receptionist" ? "Lễ tân" : staff.role ==="doctor" ? "Bác sĩ" : "Dược sĩ" } · {staff.dept}
                                        </span>
                                    </div>
                                    {weekDays.map((d) => {
                                        const status = schedule[staff.id]?.[d.iso] ?? "off";
                                        const meta = STATUS_LABELS[status];
                                        return (
                                            <div
                                                key={d.iso}
                                                className={`mx-1 rounded-xl border px-2 py-2 text-xs font-semibold text-center ${meta.color}`}
                                            >
                                                {meta.text}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                            {!filteredStaff.length && (
                                <div className="px-4 py-6 text-sm text-slate-500">
                                    Không có nhân sự trong bộ lọc này.
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}