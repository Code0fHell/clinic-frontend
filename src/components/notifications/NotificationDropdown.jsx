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
      className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col overflow-hidden backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#008080] via-teal-600 to-teal-700 shadow-md">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          Thông báo
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-white hover:text-gray-100 font-medium transition px-2 py-1 rounded hover:bg-white/20"
          >
            Đánh dấu tất cả
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1 bg-gray-50">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#008080]"></div>
            <p className="mt-2 text-gray-500">Đang tải...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2 text-gray-500 font-medium">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-white cursor-pointer transition-all duration-200 ${
                  !notification.is_read ? "bg-blue-50 border-l-4 border-l-[#008080]" : "bg-white"
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                    !notification.is_read ? "bg-[#008080] animate-pulse" : "bg-gray-300"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold text-sm ${
                        !notification.is_read ? "text-gray-900" : "text-gray-700"
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-[#008080] rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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

