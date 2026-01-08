import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Card, StatCard, LoadingSpinner } from "./components/ui";
import { getAllUsers } from "../../api/user.api";
import { getAllStaff } from "../../api/staff.api";

import {
  LayoutGrid,
  Users,
  UserCircle,
  Stethoscope,
  Briefcase,
  PlusCircle,
} from "lucide-react";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalPatients: 0,
    totalDoctors: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Lấy thống kê users
      const usersResponse = await getAllUsers({ page: 1, limit: 1000 });
      const users = usersResponse.data || [];
      
      // Lấy thống kê staff
      const staffResponse = await getAllStaff();
      const staff = staffResponse || [];

      const totalPatients = users.filter(u => u.user_role === "PATIENT").length;
      const totalDoctors = users.filter(u => u.user_role === "DOCTOR").length;

      setStats({
        totalUsers: users.length,
        totalStaff: staff.length,
        totalPatients,
        totalDoctors,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <Header />
      </div>

      <div className="flex flex-1 pt-13 overflow-y-auto">
        {/* Sidebar */}
        <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
          <SideBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-24 flex flex-col">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Page Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
                <p className="text-slate-600 mt-2">Tổng quan hệ thống quản lý</p>
              </div>

              {/* Stats Cards */}
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Tổng số tài khoản"
                    value={stats.totalUsers}
                    subtitle="Tất cả người dùng"
                    icon={Users}
                  />

                  <StatCard
                    title="Tổng nhân viên"
                    value={stats.totalStaff}
                    subtitle="Đang hoạt động"
                    icon={Briefcase}
                  />

                  <StatCard
                    title="Bệnh nhân"
                    value={stats.totalPatients}
                    subtitle="Đã đăng ký"
                    icon={UserCircle}
                  />

                  <StatCard
                    title="Bác sĩ"
                    value={stats.totalDoctors}
                    subtitle="Trong hệ thống"
                    icon={Stethoscope}
                  />
                </div>
              )}

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Thao tác nhanh
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    onClick={() => navigate("/admin/accounts")}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                    <h4 className="font-semibold text-slate-800">
                      Quản lý tài khoản
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Xem, thêm, xóa tài khoản người dùng
                    </p>
                  </button>

                  <button
                    onClick={() => navigate("/admin/staff")}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <Briefcase className="w-6 h-6 text-green-600 mb-2" />
                    <h4 className="font-semibold text-slate-800">
                      Quản lý nhân viên
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Xem, cập nhật thông tin nhân viên
                    </p>
                  </button>

                  <button
                    onClick={() => navigate("/admin/accounts?tab=add-patient")}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <PlusCircle className="w-6 h-6 text-purple-600 mb-2" />
                    <h4 className="font-semibold text-slate-800">
                      Thêm bệnh nhân
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Tạo tài khoản bệnh nhân mới
                    </p>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

