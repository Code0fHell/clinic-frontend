import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import AppointmentOverview from "./components/AppointmentOverview";
import InvoiceOverview from "./components/InvoiceOverview";
import CalendarCard from "./components/CalendarCard";
import AppointmentList from "./components/AppointmentList";
import TransactionTable from "./components/TransactionTable";

export default function Dashboard() {
    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16 overflow-hidden">
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>
                <main className="flex-1 ml-20 overflow-hidden p-4">
                    {/* GRID CHA */}
                    <div className="space-y-2">
                        {/* ===== HÀNG 1: OVERVIEW ===== */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <AppointmentOverview />
                            <InvoiceOverview />
                        </div>
                        {/* ===== HÀNG 2: LIST + TABLE + CALENDAR ===== */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-5">
                                <AppointmentList />
                            </div>
                            <div className="col-span-12 lg:col-span-5">
                                <TransactionTable />
                            </div>
                            <div className="col-span-12 lg:col-span-2">
                                <CalendarCard />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
