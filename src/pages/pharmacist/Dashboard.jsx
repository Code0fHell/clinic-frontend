import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import {
    getAllPrescriptions,
    getPharmacistRecentActivity,
} from "../../api/prescription.api";
import { getAllMedicines } from "../../api/medicine.api";
import Toast from "../../components/modals/Toast";
import {
    Pill,
    AlertTriangle,
    FileText,
    ClipboardList,
    Clock,
    ArrowRight,
} from "lucide-react";

export default function PharmacistDashboard() {
    const [stats, setStats] = useState({
        totalMedicines: 0,
        lowStockMedicines: 0,
        pendingPrescriptions: 0,
        todayPrescriptions: 0,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [prescriptionsRes, medicinesRes, activityRes] =
                await Promise.all([
                    getAllPrescriptions(),
                    getAllMedicines(),
                    getPharmacistRecentActivity().catch(() => ({ data: [] })), // Ignore error if no activity
                ]);

            const prescriptions =
                prescriptionsRes?.data || prescriptionsRes || [];
            const medicines = medicinesRes?.data || medicinesRes || [];
            const activity = activityRes?.data || activityRes || [];

            // Calculate today's prescriptions
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayPrescriptions = prescriptions.filter((p) => {
                const createdDate = new Date(p.created_at);
                createdDate.setHours(0, 0, 0, 0);
                return createdDate.getTime() === today.getTime();
            });

            // Filter pending prescriptions
            const pendingPrescriptions = prescriptions.filter(
                (p) => p.status === "PENDING"
            );

            // Count low stock medicines (stock < 10)
            const lowStock = medicines.filter((m) => (m.stock || 0) < 10);

            setStats({
                totalMedicines: medicines.length,
                lowStockMedicines: lowStock.length,
                pendingPrescriptions: pendingPrescriptions.length,
                todayPrescriptions: todayPrescriptions.length,
            });

            setRecentActivity(activity);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu dashboard:", err);
            showToast("Không thể tải dữ liệu dashboard", "error");
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
        const colorClasses = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            orange: "bg-orange-500",
            red: "bg-red-500",
        };

        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">
                            {title}
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                            {loading ? "..." : value}
                        </p>
                    </div>
                    <div className={`${colorClasses[color]} p-4 rounded-full`}>
                        <Icon className="text-white" size={28} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-20 overflow-hidden">
                {/* Sidebar */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-6">
                    <div className="flex-1 p-6 mt-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-left">
                            Dashboard Dược Sĩ
                        </h2>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Tổng số thuốc"
                                value={stats.totalMedicines}
                                icon={Pill}
                                color="blue"
                            />
                            <StatCard
                                title="Thuốc sắp hết"
                                value={stats.lowStockMedicines}
                                icon={AlertTriangle}
                                color="orange"
                            />
                            <StatCard
                                title="Đơn thuốc hôm nay"
                                value={stats.todayPrescriptions}
                                icon={FileText}
                                color="green"
                            />
                            <StatCard
                                title="Tổng đơn thuốc"
                                value={stats.pendingPrescriptions}
                                icon={ClipboardList}
                                color="red"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                Thao tác nhanh
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            "/pharmacist/prescriptions")
                                    }
                                    className="bg-[#008080] hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
                                >
                                    Duyệt đơn thuốc
                                </button>
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            "/pharmacist/medicines")
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
                                >
                                    Quản lý thuốc
                                </button>
                                <button
                                    onClick={() =>
                                        (window.location.href =
                                            "/pharmacist/schedule")
                                    }
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
                                >
                                    Xem lịch làm việc
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Clock size={20} />
                                Hoạt động gần đây
                            </h3>
                            {loading ? (
                                <div className="text-center py-4 text-gray-500">
                                    Đang tải...
                                </div>
                            ) : recentActivity.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    Chưa có hoạt động nào
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentActivity.map((prescription) => (
                                        <div
                                            key={prescription.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-gray-800">
                                                            Đã duyệt đơn thuốc
                                                        </span>
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                                            Đã phát thuốc
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Bệnh nhân:{" "}
                                                        <span className="font-medium">
                                                            {prescription
                                                                .patient?.user
                                                                ?.full_name ||
                                                                "—"}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Bác sĩ:{" "}
                                                        <span className="font-medium">
                                                            {prescription.doctor
                                                                ?.user
                                                                ?.full_name ||
                                                                "—"}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {prescription.approved_at
                                                            ? new Date(
                                                                  prescription.approved_at
                                                              ).toLocaleString(
                                                                  "vi-VN"
                                                              )
                                                            : "—"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-800">
                                                        {new Intl.NumberFormat(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        ).format(
                                                            prescription.total_fee ||
                                                                0
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}
