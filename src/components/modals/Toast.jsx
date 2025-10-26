import React, { useEffect } from "react";

/**
 * Toast notification component.
 * @param {Object} props
 * @param {string} props.message - The message to display.
 * @param {function} props.onClose - Callback when toast closes.
 * @param {number} [props.duration=3500] - Duration in ms before auto-close.
 * @param {'success'|'error'|'info'} [props.type='success'] - Type of toast.
 */
const Toast = ({ message, onClose, duration = 3500, type = "success" }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  let bgColor = "bg-green-600";
  if (type === "error") bgColor = "bg-red-600";
  if (type === "info") bgColor = "bg-blue-600";

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded shadow-lg text-white flex items-center gap-3 ${bgColor} animate-fade-in`}
      role="alert"
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white text-xl leading-none hover:opacity-70"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;