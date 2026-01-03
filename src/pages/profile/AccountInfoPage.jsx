import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, updatePatientProfile, changePassword } from "../../api/profile.api";
import AvatarEdit from "../../components/forms/AvatarEdit";
import UserInfoForm from "../../components/forms/UserInfoForm";
import PatientInfoForm from "../../components/forms/PatientInfoForm";
import Toast from "../../components/modals/Toast";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";

const AccountInfoPage = () => {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [toast, setToast] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setPatient(data.patient);
      } catch (err) {
        setToast({ message: "Không thể tải thông tin hồ sơ.", type: "error" });
      }
    };
    fetchProfile();
  }, []);

  const handleUserUpdate = async (values) => {
    try {
      await updateUserProfile(values);
      setToast({ message: "Cập nhật thông tin người dùng thành công.", type: "success" });
    } catch (err) {
      setToast({ message: "Cập nhật thất bại.", type: "error" });
    }
  };

  const handlePatientUpdate = async (values) => {
    try {
      await updatePatientProfile(patient.id, values);
      setToast({ message: "Cập nhật thông tin bệnh nhân thành công.", type: "success" });
      setPatient({ ...patient, ...values });
    } catch (err) {
      setToast({ message: "Cập nhật thất bại.", type: "error" });
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setToast({ message: "Đổi mật khẩu thành công.", type: "success" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setPasswordErrors({});
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: "" });
    }
  };

  return (
    <RoleBasedLayout>
      <div className="bg-[#f7f7f9] min-h-screen py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg px-10 py-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <AvatarEdit 
              user={user} 
              onUpdate={setUser} 
              showToast={(msg, type) => setToast({ message: msg, type })} 
            />
            <div className="mt-4 text-center">
              <div className="text-xl font-semibold">{user?.full_name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>

          {/* User Info */}
          <div className="border-t pt-8">
            <UserInfoForm user={user} onSubmit={handleUserUpdate} />
          </div>

          {/* Patient Info */}
          {patient && (
            <div className="border-t pt-8">
              <PatientInfoForm patient={patient} onSubmit={handlePatientUpdate} />
            </div>
          )}

          {/* Password Change Section */}
          <div className="border-t pt-8 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Bảo mật tài khoản</h2>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>🔒</span> Đổi mật khẩu
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className={`p-2 border rounded w-full text-sm ${
                        passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className={`p-2 border rounded w-full text-sm ${
                        passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className={`p-2 border rounded w-full text-sm ${
                        passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors({});
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default AccountInfoPage;

