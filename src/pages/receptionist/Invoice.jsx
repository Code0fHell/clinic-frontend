import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import { getAllBillToday, getDetailBill } from "../../api/bill.api";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { paymentCash } from "../../api/payment.api";

export default function Invoice() {
    const getVietnamDateString = () => {
        const now = new Date();
        const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        return vnTime.toISOString().split("T")[0];
    };
    const [dataInvoiceToday, setDataInvoiceToday] = useState([]);
    const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
    const [dataSelectedInvoice, setDataSelectedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [billType, setBillType] = useState("all");
    const [paymentMethod, setPaymentMethod] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const dateInputRef = useRef(null);
    const [dateFilter, setDateFilter] = useState(() => getVietnamDateString());
    const pageSizeOptions = [5, 10, 25, 50, 100];

    const debounceRef = useRef(null); // Tránh gọi API liên tục khi tìm kiếm

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });

        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 2000);
    };

    const fetchDataInvoiceToday = useCallback(async () => {
        try {
            const res = await getAllBillToday({
                date: dateFilter,
                keyword: searchTerm,
                billType,
                paymentMethod,
                paymentStatus,
                page: currentPage,
                limit: itemsPerPage,
            });

            setDataInvoiceToday(res?.data || []);
            setTotalPages(res?.pagination?.totalPages);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu Invoice:", err);
        }
    }, [dateFilter, searchTerm, billType, paymentMethod, paymentStatus, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchDataInvoiceToday();
    }, [dateFilter, billType, paymentMethod, paymentStatus, currentPage, itemsPerPage]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchDataInvoiceToday();
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const openDatePicker = () => {
        if (!dateInputRef.current) return;

        if (dateInputRef.current.showPicker) {
            // Chrome, Edge
            dateInputRef.current.showPicker();
        } else {
            // Firefox fallback
            dateInputRef.current.focus();
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setShowPaymentMethodForm(false)
            }
        };

        document.addEventListener("keydown", handleEsc, true);
        return () => {
            document.removeEventListener("keydown", handleEsc, true);
        };
    }, []);

    // === KHÓA SCROLL + ÉP NỀN TRẮNG KHI MODAL MỞ ===
    useEffect(() => {
        if (setShowPaymentMethodForm) {
            const scrollY = window.scrollY;

            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflowY = 'scroll';
            document.body.style.backgroundColor = '#f9fafb';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflowY = '';
            document.body.style.backgroundColor = '';

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }, [showPaymentMethodForm]);

    return (
        <div className="h-screen bg-gray-50 font-sans flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            {/* BODY */}
            <div className="flex flex-1 pt-16 overflow-hidden">
                {/* SIDEBAR */}
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* ==== MAIN CONTENT – KHÔNG CUỘN TOÀN TRANG ==== */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden">
                    {/* ==== KHỐI BẢNG – CHỈ PHẦN NÀY CUỘN ==== */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-700 mb-3 text-left">Danh sách hóa đơn</h2>
                        <div className="mb-2 flex items-center gap-4">
                            {/* Date filter */}
                            <div className="flex items-center">
                                <div
                                    onClick={openDatePicker}
                                    className="relative inline-flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700 cursor-pointer hover:bg-gray-50">

                                    <svg
                                        className="w-5 h-5 mr-2 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>

                                    <span className="mr-2 select-none">
                                        {new Date(dateFilter).toLocaleDateString("vi-VN")}
                                    </span>

                                    <input
                                        max={getVietnamDateString()}
                                        ref={dateInputRef}
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => {
                                            setDateFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Search input */}
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <div className="border border-gray-200 rounded-lg overflow-hidden flex-1 bg-white">
                            <div className="overflow-x-auto">
                                <div className="relative max-h-[450px] overflow-y-scroll scrollbar-hidden">
                                    <table className="min-w-full table-fixed text-sm border-collapse">

                                        {/* ===== THEAD ===== */}
                                        <thead>
                                            <tr>
                                                <th className="w-12 px-2 py-2 text-right bg-gray-100 text-sm font-semibold text-gray-700
                            sticky top-0 z-10 border-b border-r border-gray-200">
                                                    STT
                                                </th>

                                                <th className="w-[180px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                            sticky top-0 z-10 border-b border-r border-gray-200">
                                                    Bệnh nhân
                                                </th>

                                                <th className="w-[120px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                            sticky top-0 z-10 border-b border-r border-gray-200">
                                                    Số ĐT
                                                </th>

                                                <th className="w-[130px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                            sticky top-0 z-10 border-b border-r border-gray-200">
                                                    Người tạo
                                                </th>

                                                <th className="w-[130px] px-3 py-2 text-left bg-gray-100 font-semibold text-gray-700
                            sticky top-0 z-10 border-b border-r border-gray-200">
                                                    Ngày tạo
                                                </th>

                                                <th className="w-[180px] px-3 py-2 bg-gray-100 font-semibold text-gray-700
               sticky top-0 z-10 border-b border-r border-gray-200">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="truncate max-w-[90px]">Loại hóa đơn</span>
                                                        <select
                                                            value={billType}
                                                            onChange={(e) => {
                                                                setBillType(e.target.value);
                                                                // setCurrentPage(1);
                                                            }}
                                                            className="w-[90px] border border-gray-300 rounded-md 
                                                                            px-1 py-[2px] text-xs
                                                                            focus:outline-none focus:ring-1 focus:ring-blue-400">
                                                            <option value="all">Tất cả</option>
                                                            <option value="clinical">Lâm sàng</option>
                                                            <option value="service">Cận lâm sàng</option>
                                                        </select>
                                                    </div>
                                                </th>

                                                <th className="w-[180px] px-3 py-2 bg-gray-100 font-semibold text-gray-700
               sticky top-0 z-10 border-b border-r border-gray-200">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="truncate max-w-[120px]"> Kiểu thanh toán</span>
                                                        <select
                                                            value={paymentMethod}
                                                            onChange={(e) => {
                                                                setPaymentMethod(e.target.value);
                                                                // setCurrentPage(1);
                                                            }}
                                                            className="w-[90px] border border-gray-300 rounded-md 
                                                                            px-1 py-[2px] text-xs
                                                                            focus:outline-none focus:ring-1 focus:ring-blue-400">
                                                            <option value="all">Tất cả</option>
                                                            <option value="cash">Tiền mặt</option>
                                                            <option value="bank_transfer">Tiền tài khoản</option>
                                                        </select>
                                                    </div>
                                                </th>

                                                <th className="w-[90px] px-3 py-2 text-right bg-gray-100 font-semibold text-gray-700
                            sticky top-0 z-10 border-b border-r border-gray-200">
                                                    Tổng tiền
                                                </th>

                                                <th className="w-[100px] px-3 py-2 bg-gray-100 font-semibold text-gray-700
               sticky top-0 z-10 border-b border-gray-200">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="truncate max-w-[90px]">Thao tác</span>
                                                        <select
                                                            value={paymentStatus}
                                                            onChange={(e) => {
                                                                setPaymentStatus(e.target.value);
                                                                // setCurrentPage(1);
                                                            }}
                                                            className="w-[90px] border border-gray-300 rounded-md 
                                                                            px-1 py-[2px] text-xs
                                                                            focus:outline-none focus:ring-1 focus:ring-blue-400">
                                                            <option value="all">Tất cả</option>
                                                            <option value="pending">Chưa thanh toán</option>
                                                            <option value="success">Đã thanh toán</option>
                                                        </select>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>

                                        {/* ===== TBODY ===== */}
                                        <tbody className="text-gray-700 divide-y divide-gray-200">
                                            {dataInvoiceToday.length > 0 ? (
                                                dataInvoiceToday.map((item, index) => (
                                                    <tr
                                                        key={item.id}
                                                        className="text-[15px] hover:bg-gray-50 transition-colors"
                                                    >
                                                        {/* STT */}
                                                        <td className="w-12 px-2 py-2 text-right border-r border-gray-200">
                                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                                        </td>

                                                        {/* Bệnh nhân */}
                                                        <td className="w-[180px] px-3 py-2 truncate border-r border-gray-200">
                                                            {item.patient_name}
                                                        </td>

                                                        {/* Số ĐT */}
                                                        <td className="w-[120px] px-3 py-2 truncate border-r border-gray-200">
                                                            {item.patient_phone || "—"}
                                                        </td>

                                                        {/* Người tạo */}
                                                        <td className="w-[130px] px-3 py-2 truncate border-r border-gray-200">
                                                            {item.createdByName}
                                                        </td>

                                                        {/* Ngày tạo */}
                                                        <td className="w-[130px] px-3 py-2 border-r border-gray-200">
                                                            {item.created_at.slice(0, 10).split('-').reverse().join('-')}
                                                        </td>

                                                        {/* Loại hóa đơn */}
                                                        <td className="w-[100px] px-3 py-2 truncate border-r border-gray-200">
                                                            {item.bill_type === "CLINICAL"
                                                                ? "Lâm sàng"
                                                                : item.bill_type === "SERVICE"
                                                                    ? "Cận lâm sàng"
                                                                    : item.bill_type === "MEDICINE"
                                                                        ? "Thuốc"
                                                                        : "Không xác định"}
                                                        </td>

                                                        {/* Hình thức thanh toán */}
                                                        <td className="w-[160px] px-3 py-2 truncate border-r border-gray-200">
                                                            {item.payment_status?.includes("SUCCESS") ? (
                                                                item.payment_method?.toUpperCase() === "CASH"
                                                                    ? "Tiền mặt"
                                                                    : item.payment_method?.toUpperCase() === "BANK_TRANSFER"
                                                                        ? "Tiền tài khoản"
                                                                        : "Không xác định"
                                                            ) : "—"}
                                                        </td>

                                                        {/* Tổng tiền */}
                                                        <td className="w-[120px] px-3 py-2 text-right border-r border-gray-200">
                                                            {Number(item.total).toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}
                                                        </td>

                                                        {/* Thao tác */}
                                                        <td className="w-[180px] px-3 py-2">
                                                            <button
                                                                className={`w-full px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition
                                            ${item.payment_status?.includes('SUCCESS')
                                                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                                                        : 'bg-[#008080] text-white hover:bg-teal-600 hover:cursor-pointer'
                                                                    }`}
                                                                disabled={item.payment_status?.includes('SUCCESS')}
                                                                onClick={async () => {
                                                                    if (!item.payment_status?.includes('SUCCESS')) {
                                                                        try {
                                                                            const res = await getDetailBill(item.id);
                                                                            setDataSelectedInvoice(res);
                                                                            setShowPaymentMethodForm(true);
                                                                        } catch (err) {
                                                                            console.error(err);
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {item.payment_status?.includes('SUCCESS')
                                                                    ? 'Đã thanh toán'
                                                                    : 'Thanh toán'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={9}
                                                        className="px-3 py-6 text-center text-gray-500 text-base"
                                                    >
                                                        Không có dữ liệu
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                        {/* PHÂN TRANG (cố định trong khung bảng) */}
                        <div className="border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Hiển thị:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008080] hover:cursor-pointer"
                                    >
                                        {pageSizeOptions.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* --- Nút chuyển trang --- */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center justify-center w-6 h-6 text-sm font-semibold transition rounded-md
                                            ${currentPage === 1
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {getPageNumbers().map((page, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => typeof page === "number" && goToPage(page)}
                                            disabled={page === "..."}
                                            className={`w-6 h-6 text-sm font-semibold flex items-center justify-center transition rounded-md hover:cursor-pointer
                                                ${page === currentPage
                                                    ? "bg-[#008080] text-white border border-[#008080]"
                                                    : page === "..."
                                                        ? "text-gray-500 cursor-default"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-[#008080]"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center justify-center w-6 h-6 text-sm font-semibold transition rounded-md
                                            ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer hover:text-[#008080]"}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Form Payment */}
            {showPaymentMethodForm && dataSelectedInvoice &&
                createPortal(
                    <PaymentMethodForm
                        bill={dataSelectedInvoice}
                        onSubmit={async ({ dto, method }) => {
                            try {
                                if (method === "CASH") {
                                    // Gọi API thanh toán tiền mặt
                                    await paymentCash(dto);
                                    // Reload danh sách hóa đơn
                                    fetchDataInvoiceToday();
                                    showToast("Thanh toán thành công", "success");
                                }
                                else if (method === "BANK_TRANSFER") {
                                    // VietQR thanh toán đã được xử lý trong CreateVietQRModal
                                    // và onSuccess callback sẽ gọi onSubmit khi thanh toán thành công
                                    // Reload danh sách hóa đơn
                                    fetchDataInvoiceToday();
                                    showToast("Thanh toán thành công", "success");
                                }

                                setShowPaymentMethodForm(false);
                            } catch (error) {
                                const message = error?.response?.data?.message || error.message || "Chỉ có thể thanh toán hóa đơn ngày hôm nay!";
                                setShowPaymentMethodForm(false);
                                showToast(message, "error");
                            }
                        }}
                        onClose={() => {
                            setShowPaymentMethodForm(false);
                            if (dateFilter === getVietnamDateString()) {
                                showToast("Chưa thực hiện thanh toán!", "warn");
                            }
                        }}
                    />,
                    document.body
                )
            }

            {/* Toast */}
            {toast.show && (
                <div
                    className={`fixed top-20 right-5 px-4 py-3 rounded shadow-lg text-white z-[9999]
            ${{
                            success: "bg-green-500",
                            error: "bg-red-500",
                            warn: "bg-yellow-500",
                        }[toast.type] || "bg-green-500"
                        }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
