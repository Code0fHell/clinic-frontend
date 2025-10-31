import React from "react";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import DoctorHeader from "./components/layout/DoctorHeader";
import DoctorSidebar from "./components/layout/DoctorSidebar";
import DashboardCards from "./components/cards/DashBoardCards";
import AppointmentTable from "./components/tables/AppointmentTable";
import UpcomingSchedule from "./components/UpcomingSchedule";

const DoctorDashboardPage = () => {
  return (
    <RoleBasedLayout>
      {/* Header */}
      <DoctorHeader />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <DoctorSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto bg-gray-50 flex gap-8">
          {/* Left content */}
          <div className="flex-1">
            <DashboardCards />
            <AppointmentTable />
          </div>

          {/* Right content */}
          <UpcomingSchedule />
        </main>
      </div>
    </RoleBasedLayout>
  );
};

export default DoctorDashboardPage;
