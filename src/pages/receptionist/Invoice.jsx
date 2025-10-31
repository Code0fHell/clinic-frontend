import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";

export default function Invoice() {
    /* ---------- DỮ LIỆU MẪU ---------- */
    const initialData = [
        { id: 1, patient: "Lê Gia Quang", total_amount: "500,000đ", created_by: "Nguyễn Hải Yến", payment_status: "Đang thanh toán" },
        { id: 2, patient: "Lê Gia Quang", total_amount: "500,000đ", created_by: "Nguyễn Hải Yến", payment_status: "Thanh toán thành công" },
        { id: 3, patient: "Lê Gia Quang", total_amount: "500,000đ", created_by: "Nguyễn Hải Yến", payment_status: "Thanh toán thất bại" }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const pageSizeOptions = [5, 10, 25, 50, 100];

    /* ---------- LOGIC ---------- */
    const filteredData = useMemo(() => {
        return initialData.filter((item) =>
            item.patient.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-50">
            {/* ==== HEADER – CỐ ĐỊNH ==== */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            {/* ==== BODY ==== */}
            <div className="flex flex-1 pt-16 overflow-hidden">
                {/* ==== SIDEBAR – CỐ ĐỊNH ==== */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* ==== MAIN CONTENT – KHÔNG CUỘN TOÀN TRANG ==== */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden p-6">
                    {/* ==== KHỐI BẢNG – CHỈ PHẦN NÀY CUỘN ==== */}
                    <div className="flex-1 p-6 mt-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <h2 className="text-3xl font-bold text-gray-700 mb-5 text-left">Danh sách hóa đơn</h2>

                        {/* Ô TÌM KIẾM - ĐỒNG BỘ CHIỀU RỘNG VỚI BẢNG */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên bệnh nhân"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        // setCurrentPage(1); // Nếu có phân trang
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base
                           focus:outline-none focus:ring-2 focus:ring-[#008080] transition
                           placeholder:text-gray-400"
                                />
                                <svg
                                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Tiêu đề bảng (cố định trong khung) */}
                        <div className="flex flex-col items-center justify-start flex-1 overflow-hidden bg-gray-50">
                            <div className="w-[100%] overflow-y-auto h-[650px] scrollbar-hidden rounded-lg shadow-sm bg-white">
                                <table className="min-w-full text-center border-collapse">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-4 text-2xl font-bold text-gray-700">Mã hóa đơn</th>
                                            <th className="px-6 py-4 text-2xl font-bold text-gray-700">Tên bệnh nhân</th>
                                            <th className="px-6 py-4 text-2xl font-bold text-gray-700">Người tạo</th>
                                            <th className="px-6 py-4 text-2xl font-bold text-gray-700">Tổng tiền</th>
                                            <th className="px-6 py-4 text-2xl font-bold text-gray-700">Trạng thái</th>
                                            <th className="px-6 py-4 text-2xl font-bold text-gray-700">Hành động</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition duration-200">
                                                    <td className="px-8 py-5 text-xl text-gray-700">{item.id}</td>
                                                    <td className="px-8 py-5 text-xl text-gray-700">{item.patient}</td>
                                                    <td className="px-8 py-5 text-xl text-gray-700">{item.created_by}</td>
                                                    <td className="px-8 py-5 text-xl text-gray-700">{item.total_amount}</td>
                                                    <td className="px-8 py-5 text-xl text-gray-700">{item.payment_status}</td>
                                                    <td className="px-8 py-5 flex justify-center gap-6">
                                                        {/* Nút Edit */}
                                                        <button className="flex items-center text-teal-600 hover:text-teal-700 cursor-pointer transition">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={2}
                                                                stroke="currentColor"
                                                                className="w-6 h-6 mr-2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M16.862 3.487a2.1 2.1 0 012.97 2.97L8.062 18.228a4.5 4.5 0 01-1.897 1.128l-3.004.857a.75.75 0 01-.928-.928l.857-3.004a4.5 4.5 0 011.128-1.897L16.862 3.487z"
                                                                />
                                                            </svg>
                                                            <span className="text-xl font-semibold">Sửa</span>
                                                        </button>

                                                        {/* Nút Delete */}
                                                        <button className="flex items-center text-red-500 hover:text-red-600 cursor-pointer transition">
                                                            <i className="fa-solid fa-trash-can text-red-500 text-base mr-3"></i>
                                                            <span className="text-xl font-semibold">Xóa</span>
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-8 py-12 text-center text-gray-500 text-base"
                                                >
                                                    Không tìm thấy hóa đơn nào.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {/* PHÂN TRANG (cố định trong khung bảng) */}
                        <div className="border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl text-gray-700">Hiển thị:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008080] cursor-pointer"
                                    >
                                        {pageSizeOptions.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Nút phân trang */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center justify-center w-10 h-10 text-base font-semibold transition rounded-md
                                            ${currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {getPageNumbers().map((page, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => typeof page === "number" && goToPage(page)}
                                            disabled={page === "..."}
                                            className={`w-10 h-10 text-base font-semibold flex items-center justify-center transition rounded-md
                                                ${page === currentPage
                                                    ? "bg-[#008080] text-white border border-[#008080]"
                                                    : page === "..."
                                                        ? "text-gray-500 cursor-default"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center justify-center w-10 h-10 text-base font-semibold transition rounded-md
                                            ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
