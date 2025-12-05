import React, { useEffect, useState, useRef } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "../../api/notification.api";
import dayjs from "dayjs";

const NotificationDropdown = ({ isOpen, onClose, unreadCount, onMarkRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      onMarkRead();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      onMarkRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50 max-h-[500px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">Thông báo</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không có thông báo nào
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.is_read ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {notification.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

