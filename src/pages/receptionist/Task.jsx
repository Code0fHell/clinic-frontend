import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";

export default function Task() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50">

                </main>
            </div>
        </div>
    );
}

