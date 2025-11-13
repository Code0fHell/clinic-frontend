import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { id: 0, path: "/doctor/dashboard", label: "Tổng quan" },
    { id: 1, path: "/doctor/appointment", label: "Lịch hẹn" },
    { id: 2, path: "/doctor/visit", label: "Bệnh nhân" },
    { id: 3, path: "/doctor/documents", label: "Hồ sơ" },
    { id: 4, path: "/doctor/checklist", label: "Checklist" },
  ];

  const icons = [
    <svg width="30" height="30" viewBox="0 0 48 48" key="overview">
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="#fff" strokeWidth="2" />
      <rect x="27" y="13" width="8" height="8" rx="2" stroke="#fff" strokeWidth="2" />
      <rect x="13" y="27" width="8" height="8" rx="2" stroke="#fff" strokeWidth="2" />
      <rect x="27" y="27" width="8" height="8" rx="2" stroke="#fff" strokeWidth="2" />
    </svg>,
    <svg width="30" height="30" viewBox="0 0 48 48" key="calendar">
      <rect x="10" y="14" width="28" height="24" rx="4" stroke="#55546E" strokeWidth="2" />
      <rect x="16" y="8" width="4" height="8" rx="2" fill="#55546E" />
      <rect x="28" y="8" width="4" height="8" rx="2" fill="#55546E" />
    </svg>,
    <svg width="30" height="30" viewBox="0 0 48 48" key="patients">
      <circle cx="16" cy="20" r="6" stroke="#55546E" strokeWidth="2" />
      <circle cx="32" cy="20" r="6" stroke="#55546E" strokeWidth="2" />
      <rect x="8" y="32" width="12" height="8" rx="4" stroke="#55546E" strokeWidth="2" />
      <rect x="28" y="32" width="12" height="8" rx="4" stroke="#55546E" strokeWidth="2" />
    </svg>,
    <svg width="30" height="30" viewBox="0 0 48 48" key="document">
      <rect x="12" y="10" width="24" height="28" rx="4" stroke="#55546E" strokeWidth="2" />
      <rect x="18" y="18" width="12" height="2" rx="1" fill="#55546E" />
      <rect x="18" y="24" width="12" height="2" rx="1" fill="#55546E" />
      <rect x="18" y="30" width="8" height="2" rx="1" fill="#55546E" />
    </svg>,
    <svg width="30" height="30" viewBox="0 0 48 48" key="checklist">
      <rect x="12" y="10" width="24" height="28" rx="4" stroke="#55546E" strokeWidth="2" />
      <path d="M18 26l4 4 8-8" stroke="#55546E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  ];

  // Focus đúng menu khi load lại
  useEffect(() => {
    const index = menuItems.findIndex((item) => location.pathname.startsWith(item.path));
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname]);

  return (
    <aside className="flex sticky top-[80px] left-0 w-[100px] bg-white border-r flex flex-col items-center py-6 z-40 shadow-sm">
      <div className="flex flex-col items-center gap-8 mt-6 w-full">
        {menuItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveIndex(idx);
              navigate(item.path);
            }}
            className={`group relative flex items-center justify-center w-[60px] h-[60px] rounded-[20px] cursor-pointer transition-all duration-200 ${
              activeIndex === idx ? "bg-teal-700 text-white" : "hover:bg-gray-100"
            }`}
          >
            {idx === activeIndex
              ? React.cloneElement(icons[idx], { stroke: "#fff", fill: "none" })
              : icons[idx]}

            <span className="absolute left-[70px] px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default DoctorSidebar;
