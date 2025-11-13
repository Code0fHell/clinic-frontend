import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// import DoctorHeader from "../../pages/doctor/components/layout/DoctorHeader";
// import ReceptionHeader from "./ReceptionHeader";
// import AdminHeader from "./AdminHeader";

const RoleBasedLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "PATIENT"; // mặc định dành cho bệnh nhân

  let HeaderComponent = null;
  let FooterComponent = null;
  switch (role) {
    case "DOCTOR":
      // HeaderComponent = DoctorHeader;
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
      FooterComponent = Footer;
  }

  return (
    <div className="flex flex-col min-h-screen">
      { role === "PATIENT" && <HeaderComponent /> }
      <main className="flex-1">{children}</main>
      { role === "PATIENT" && <FooterComponent /> }
    </div>
  );
};

export default RoleBasedLayout;
