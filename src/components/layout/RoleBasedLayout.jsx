import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// import DoctorHeader from "./DoctorHeader";
// import ReceptionHeader from "./ReceptionHeader";
// import AdminHeader from "./AdminHeader";

const RoleBasedLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "PATIENT"; // mặc định dành cho bệnh nhân

  let HeaderComponent = Header;
  switch (role) {
    case "DOCTOR":
    //   HeaderComponent = DoctorHeader;
      break;
    case "RECEPTIONIST":
    //   HeaderComponent = ReceptionHeader;
      break;
    case "OWNER":
    case "ADMIN":
    //   HeaderComponent = AdminHeader;
      break;
    default:
      HeaderComponent = Header;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RoleBasedLayout;
