import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// import DoctorHeader from "../../pages/doctor/components/layout/DoctorHeader";
// import ReceptionHeader from "./ReceptionHeader";
// import AdminHeader from "./AdminHeader";

const RoleBasedLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || null;

  let HeaderComponent = null;
  let FooterComponent = null;
  
  // Show header for patients or guests (no login)
  if (!role || role === "PATIENT") {
    HeaderComponent = Header;
    FooterComponent = Footer;
  }
  
  // For other roles, no header/footer (they have their own layouts)
  switch (role) {
    case "DOCTOR":
    case "RECEPTIONIST":
    case "OWNER":
    case "ADMIN":
    case "PHARMACIST":
      // These roles have their own headers
      break;
    default:
      // Guest or PATIENT - show public header
      break;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {HeaderComponent && <HeaderComponent />}
      <main className="flex-1">{children}</main>
      {FooterComponent && <FooterComponent />}
    </div>
  );
};

export default RoleBasedLayout;
