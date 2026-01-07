import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Card, Button, Badge, LoadingSpinner, EmptyState } from "./components/ui";
import Toast from "../../components/modals/Toast";
import { getAllUsers, deleteUser, createPatientAccount } from "../../api/user.api";
import { createStaff } from "../../api/staff.api";
import CreatePatientModal from "./components/CreatePatientModal";
import CreateStaffModal from "./components/CreateStaffModal";

const ManageAccounts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    role: searchParams.get("role") || "",
  });
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters.role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: filters.role || undefined,
      });

      setUsers(response.data || []);
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Lỗi khi tải danh sách tài khoản!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${username}"?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      showToast("Xóa tài khoản thành công!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast(error.response?.data?.message || "Lỗi khi xóa tài khoản!", "error");
    }
  };

  const handleCreatePatient = async (data) => {
    try {
      await createPatientAccount(data);
      showToast("Tạo tài khoản bệnh nhân thành công!");
      setShowPatientModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  };

  const handleCreateStaff = async (data) => {
    try {
      await createStaff(data);
      showToast("Tạo tài khoản nhân viên thành công!");
      setShowStaffModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleRoleFilter = (role) => {
    setFilters({ role });
    setPagination({ ...pagination, page: 1 });
    if (role) {
      searchParams.set("role", role);
    } else {
      searchParams.delete("role");
    }
    setSearchParams(searchParams);
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      ADMIN: { label: "Admin", variant: "danger" },
      OWNER: { label: "Owner", variant: "danger" },
      DOCTOR: { label: "Bác sĩ", variant: "info" },
      PHARMACIST: { label: "Dược sĩ", variant: "success" },
      RECEPTIONIST: { label: "Lễ tân", variant: "warning" },
      PATIENT: { label: "Bệnh nhân", variant: "default" },
    };
    const config = roleMap[role] || { label: role, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    Quản lý tài khoản
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Xem và quản lý tất cả tài khoản trong hệ thống
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowStaffModal(true)} variant="secondary">
                    ➕ Thêm nhân viên
                  </Button>
                  <Button onClick={() => setShowPatientModal(true)}>
                    ➕ Thêm bệnh nhân
                  </Button>
                </div>
              </div>

              {/* Toast removed from inline position - now floating */}

              {/* Filters */}
              <Card>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">Lọc theo vai trò:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRoleFilter("")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        !filters.role
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    {["PATIENT", "DOCTOR", "PHARMACIST", "RECEPTIONIST", "ADMIN"].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleFilter(role)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          filters.role === role
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {role === "PATIENT" && "Bệnh nhân"}
                        {role === "DOCTOR" && "Bác sĩ"}
                        {role === "PHARMACIST" && "Dược sĩ"}
                        {role === "RECEPTIONIST" && "Lễ tân"}
                        {role === "ADMIN" && "Admin"}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Users Table */}
              <Card>
                {loading ? (
                  <LoadingSpinner />
                ) : users.length === 0 ? (
                  <EmptyState message="Không có tài khoản nào." />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Tên đăng nhập
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Họ và tên
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Vai trò
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Số điện thoại
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm text-slate-800">
                                {user.username}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-800">
                                {user.full_name || "-"}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {user.email}
                              </td>
                              <td className="py-3 px-4">{getRoleBadge(user.user_role)}</td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {user.phone || "-"}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {user.user_role !== "ADMIN" && user.user_role !== "OWNER" && (
                                  <Button
                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                    variant="danger"
                                    className="text-xs"
                                  >
                                    Xóa
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Hiển thị {users.length} / {pagination.total} tài khoản
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            setPagination({ ...pagination, page: pagination.page - 1 })
                          }
                          disabled={pagination.page === 1}
                          variant="secondary"
                          className="text-sm"
                        >
                          Trước
                        </Button>
                        <span className="px-4 py-2 text-sm text-slate-700">
                          Trang {pagination.page} / {pagination.totalPages}
                        </span>
                        <Button
                          onClick={() =>
                            setPagination({ ...pagination, page: pagination.page + 1 })
                          }
                          disabled={pagination.page === pagination.totalPages}
                          variant="secondary"
                          className="text-sm"
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showPatientModal && (
        <CreatePatientModal
          onClose={() => setShowPatientModal(false)}
          onSubmit={handleCreatePatient}
        />
      )}

      {showStaffModal && (
        <CreateStaffModal
          onClose={() => setShowStaffModal(false)}
          onSubmit={handleCreateStaff}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ManageAccounts;

