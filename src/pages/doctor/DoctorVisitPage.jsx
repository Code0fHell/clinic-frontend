import React from "react";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import DoctorHeader from "./components/layout/DoctorHeader";
import DoctorSidebar from "./components/layout/DoctorSidebar";
import TodayVisitQueue from "./components/queue/TodayVisitQueue";

const DoctorVisitPage = () => {
  return (
    <RoleBasedLayout>
      {/* Header */}
      <DoctorHeader />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <DoctorSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto bg-gray-50 flex gap-8">
          <TodayVisitQueue/>
        </main>
      </div>
    </RoleBasedLayout>
  );
};

export default DoctorVisitPage;
