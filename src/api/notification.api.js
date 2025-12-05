import axiosClient from "./axiosClient";

// Get all notifications for current user
export const getNotifications = async () => {
  const res = await axiosClient.get("/notification");
  return res.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
  const res = await axiosClient.get("/notification/unread-count");
  return res.data;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const res = await axiosClient.put(`/notification/${notificationId}/read`);
  return res.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const res = await axiosClient.put("/notification/read-all");
  return res.data;
};

