import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Card, Button, Badge, LoadingSpinner, EmptyState } from "./components/ui";
import Toast from "../../components/modals/Toast";
import {
  getStaffPaginated,
  deleteStaff,
  updateStaff,
  createStaff,
} from "../../api/staff.api";
import CreateStaffModal from "./components/CreateStaffModal";
import EditStaffModal from "./components/EditStaffModal";

const ManageStaff = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    role: searchParams.get("role") || "",
    department: searchParams.get("department") || "",
    search: searchParams.get("search") || "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, [pagination.page, filters.role, filters.department, filters.search]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaffPaginated({
        page: pagination.page,
        limit: pagination.limit,
        role: filters.role || undefined,
        department: filters.department || undefined,
        search: filters.search || undefined,
      });

      setStaff(response.data || []);
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Error fetching staff:", error);
      showToast("Lỗi khi tải danh sách nhân viên!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    const confirmMessage = `Bạn có chắc muốn xóa nhân viên "${staffName}"?\n\nLưu ý: Nếu nhân viên này đã có dữ liệu liên quan (khám bệnh, xét nghiệm...), hệ thống sẽ chỉ đánh dấu "Không hoạt động" thay vì xóa hoàn toàn.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteStaff(staffId);
      showToast("Xóa nhân viên thành công!");
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      const errorMsg = error.response?.data?.message || "Lỗi khi xóa nhân viên!";
      showToast(errorMsg, "error");
      // Luôn refresh lại danh sách để cập nhật trạng thái
      setTimeout(() => fetchStaff(), 1500);
    }
  };

  const handleCreateStaff = async (data) => {
    try {
      await createStaff(data);
      showToast("Thêm nhân viên thành công!");
      setShowCreateModal(false);
      fetchStaff();
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  };

  const handleUpdateStaff = async (data) => {
    try {
      await updateStaff(selectedStaff.id, data);
      showToast("Cập nhật thông tin nhân viên thành công!");
      setShowEditModal(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  };

  const handleEditClick = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowEditModal(true);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleRoleFilter = (role) => {
    setFilters({ ...filters, role });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      DOCTOR: { label: "Bác sĩ", variant: "info" },
      PHARMACIST: { label: "Dược sĩ", variant: "success" },
      RECEPTIONIST: { label: "Lễ tân", variant: "warning" },
    };
    const config = roleMap[role] || { label: role, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDoctorTypeBadge = (doctorType) => {
    if (!doctorType) return "-";
    const typeMap = {
      CLINICAL: "Lâm sàng",
      DIAGNOSTIC: "Chẩn đoán",
      TEST: "Xét nghiệm",
    };
    return typeMap[doctorType] || doctorType;
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
                    Quản lý nhân viên
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Xem và quản lý thông tin nhân viên
                  </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                  ➕ Thêm nhân viên
                </Button>
              </div>

              {/* Toast removed from inline position - now floating */}

              {/* Filters */}
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      Lọc theo vai trò:
                    </span>
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
                      {["DOCTOR", "PHARMACIST", "RECEPTIONIST"].map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleFilter(role)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            filters.role === role
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {role === "DOCTOR" && "Bác sĩ"}
                          {role === "PHARMACIST" && "Dược sĩ"}
                          {role === "RECEPTIONIST" && "Lễ tân"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, email..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button type="submit">Tìm kiếm</Button>
                  </form>
                </div>
              </Card>

              {/* Staff Table */}
              <Card>
                {loading ? (
                  <LoadingSpinner />
                ) : staff.length === 0 ? (
                  <EmptyState message="Không có nhân viên nào." />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Họ và tên
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Vai trò
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Khoa/Phòng
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Chức vụ
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Loại BS
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Trạng thái
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                              Email
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {staff.map((s) => (
                            <tr
                              key={s.id}
                              className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                                !s.is_available ? "opacity-60 bg-slate-50" : ""
                              }`}
                            >
                              <td className="py-3 px-4 text-sm text-slate-800">
                                {s.user?.full_name || s.user?.username}
                                {!s.is_available && (
                                  <span className="ml-2 text-xs text-red-600">(Không hoạt động)</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {getRoleBadge(s.user?.user_role)}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {s.department || "-"}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {s.position || "-"}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {getDoctorTypeBadge(s.doctor_type)}
                              </td>
                              <td className="py-3 px-4">
                                {s.is_available ? (
                                  <Badge variant="success">Hoạt động</Badge>
                                ) : (
                                  <Badge variant="danger">Không hoạt động</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600">
                                {s.user?.email || "-"}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    onClick={() => handleEditClick(s)}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDeleteStaff(
                                        s.id,
                                        s.user?.full_name || s.user?.username
                                      )
                                    }
                                    variant="danger"
                                    className="text-xs"
                                    disabled={!s.is_available}
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Hiển thị {staff.length} / {pagination.total} nhân viên
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
      {showCreateModal && (
        <CreateStaffModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateStaff}
        />
      )}

      {showEditModal && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
          onSubmit={handleUpdateStaff}
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

export default ManageStaff;

