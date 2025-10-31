import React from "react";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import DoctorSidebar from "./components/layout/DoctorSidebar";
import AppointmentCalendar from "./components/calendar/AppointmentCalendar";
import DoctorHeader from "./components/layout/DoctorHeader";

const DoctorAppointmentsPage = () => {
  return (
    <RoleBasedLayout>
      <DoctorHeader/>
      <div className="flex">
        <DoctorSidebar />
        <AppointmentCalendar />
      </div>
      
    </RoleBasedLayout>
  );
};

export default DoctorAppointmentsPage;
