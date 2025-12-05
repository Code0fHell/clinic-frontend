import React, { useRef, useState } from "react";
import { uploadAvatar } from "../../api/profile.api";
import useAuth from "../../hooks/useAuth";

const AvatarEdit = ({ user, onUpdate, showToast }) => {
  const fileInput = useRef();
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar(file);

      // cập nhật vào ProfilePage
      onUpdate && onUpdate({ ...user, avatar: avatarUrl });

      // cập nhật global context (Header tự cập nhật)
      updateUser({ avatar: avatarUrl });

      showToast && showToast("Cập nhật ảnh đại diện thành công!", "success");

    } catch {
      showToast && showToast("Tải ảnh thất bại!", "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={
          user?.avatar
            ? `http://localhost:3000${user.avatar}`
            : "/default-avatar.png"
        }
        alt="avatar"
        className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow"
      />

      <button
        type="button"
        className="mt-3 px-5 py-1.5 bg-white border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition"
        onClick={() => fileInput.current.click()}
        disabled={loading}
      >
        {loading ? "Đang tải..." : "Đổi ảnh đại diện"}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarEdit;
