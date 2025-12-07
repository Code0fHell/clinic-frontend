import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import AppointmentOverview from "./components/AppointmentOverview";
import InvoiceOverview from "./components/InvoiceOverview";
import CalendarCard from "./components/CalendarCard";
import AppointmentList from "./components/AppointmentList";
import TransactionTable from "./components/TransactionTable";
import DoctorList from "./components/DoctorList";

export default function Dashboard() {
    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* ==== HEADER – CỐ ĐỊNH ==== */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>


            <div className="flex flex-1 pt-15 overflow-hidden">
                {/* ==== SIDEBAR – CỐ ĐỊNH ==== */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* ==== MAIN CONTENT – KHÔNG CUỘN TOÀN TRANG ==== */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-4">
                    {/* <h2 className="text-2xl font-bold text-teal-700 mb-3">Xin chào ...</h2> */}

                    {/* Grid Layout: 9 + 3 */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* CỘT TRÁI: RỘNG HƠN → GIỮ NGUYÊN KÍCH THƯỚC CARD */}
                        <div className="lg:col-span-9 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <AppointmentOverview />
                                <InvoiceOverview />
                            </div>
                            {/* Hàng 2: AppointmentList + TransactionTable – GIỐNG ẢNH */}
                            <div className="flex gap-6 items-stretch">
                                {/* 40% chiều rộng */}
                                <div className="flex-[3] min-w-0">
                                    <AppointmentList />
                                </div>

                                {/* 60% chiều rộng – CHIẾM NHIỀU HƠN */}
                                <div className="flex-[3] min-w-0">
                                    <TransactionTable />
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: NGẮN HƠN → LỊCH + BÁC SĨ BÉ LẠI */}
                        <div className="lg:col-span-3 space-y-4">
                            <CalendarCard />
                            <DoctorList />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}