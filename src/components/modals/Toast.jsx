import React, { useEffect, useState } from "react";

/**
 * Toast notification component.
 * @param {Object} props
 * @param {string} props.message - The message to display.
 * @param {function} props.onClose - Callback when toast closes.
 * @param {number} [props.duration=3000] - Duration in ms before auto-close.
 * @param {'success'|'error'|'info'|'warn'} [props.type='success'] - Type of toast.
 */
const Toast = ({ message, onClose, duration = 3000, type = "success" }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  let bgColor = "bg-emerald-600";
  let icon = "✓";
  if (type === "error") {
    bgColor = "bg-red-600";
    icon = "✕";
  }
  if (type === "info") {
    bgColor = "bg-blue-600";
    icon = "ℹ";
  }
  if (type === "warn") {
    bgColor = "bg-yellow-500";
    icon = "⚠";
  }

  return (
    <div
      className={`fixed top-20 right-6 z-[9999] min-w-[300px] max-w-[400px] px-5 py-4 rounded-lg shadow-2xl text-white flex items-center gap-3 ${bgColor} transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
      role="alert"
      style={{ transform: isVisible ? "translateX(0)" : "translateX(2rem)" }}
    >
      <span className="text-lg font-bold flex-shrink-0 flex items-center justify-center">{icon}</span>
      <span className="flex-1 text-sm leading-relaxed">{message}</span>
      <button
        className="text-white text-xl leading-none hover:opacity-70 transition-opacity flex-shrink-0 flex items-center justify-center"
        onClick={handleClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
