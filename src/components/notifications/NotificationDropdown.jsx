import React, { useEffect, useState, useRef } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "../../api/notification.api";
import dayjs from "dayjs";

const NotificationDropdown = ({ isOpen, onClose, unreadCount, onMarkRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL"); // "ALL" or "UNREAD"
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter notifications based on selected filter
    if (filter === "UNREAD") {
      setFilteredNotifications(notifications.filter(n => !n.is_read));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, filter]);

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

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "APPOINTMENT":
        return "📅";
      case "PRESCRIPTION":
        return "💊";
      case "BILL":
        return "💰";
      default:
        return "🔔";
    }
  };

  if (!isOpen) return null;

  const displayNotifications = filteredNotifications;
  const unreadCountInFilter = displayNotifications.filter(n => !n.is_read).length;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-lg">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setFilter("ALL")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === "ALL"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === "UNREAD"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Chưa đọc ({notifications.filter(n => !n.is_read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Đang tải...</p>
          </div>
        ) : displayNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">
              {filter === "UNREAD" ? "Không có thông báo chưa đọc" : "Không có thông báo nào"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-all duration-200 ${
                  !notification.is_read ? "bg-blue-50/50 border-l-4 border-l-blue-500" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${
                          !notification.is_read ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="flex-shrink-0 ml-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          Đã đọc
                        </button>
                      )}
                    </div>
                    {!notification.is_read && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-xs text-blue-600 font-medium">Mới</span>
                      </div>
                    )}
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

