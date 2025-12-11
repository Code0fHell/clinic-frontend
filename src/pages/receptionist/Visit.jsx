import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import { getTodayVisit, getDetailVisit } from "../../api/visit.api";
import CreateInvoiceForm from "./components/CreateInvoiceForm";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { createMedicalTicket } from "../../api/medical-ticket.api";
import { createBill } from "../../api/bill.api";
import { paymentCash } from "../../api/payment.api";

export default function Visit() {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // <-- THÊM STATE VỊ TRÍ
    const [searchVisit, setSearchVisit] = useState("");
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [showCreateVisitForm, setShowCreateVisitForm] = useState(false);
    const [showCreateInvoiceForm, setShowCreateInvoiceForm] = useState(false);
    const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
    const [createdInvoice, setCreatedInvoice] = useState(null);
    const [dataVisit, setDataVisit] = useState([]);
    const dateInputRef = useRef(null);
    const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const pageSizeOptions = [5, 10, 25, 50, 100];
    const menuRefs = useRef([]);

    // Phân trang, lọc
    const filteredData = useMemo(() => {
        return dataVisit.filter((item) => {
            const name = (item.patient?.patient_full_name || "Không có tên").toLowerCase();
            const nameMatch = name.includes(searchVisit.toLowerCase());

            if (!dateFilter) return nameMatch;

            const itemDate = item.scheduled_date ? new Date(item.scheduled_date).toISOString().slice(0, 10) : null;
            const dateMatch = itemDate === dateFilter;

            return nameMatch && dateMatch;
        });
    }, [dataVisit, searchVisit, dateFilter]);

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

    useEffect(() => {
        const fetchDataVisit = async () => {
            try {
                const data = await getTodayVisit();
                setDataVisit(data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu Visit:", err);
            }
        };

        fetchDataVisit();
    }, []);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN')
            .format(date)
            .split('/')
            .join('-');
    };

    const handleSelectVisit = async (visitId) => {
        const visit = await getDetailVisit(visitId);

        const patient = {
            id: visit.patient.id,
            name: visit.patient.patient_full_name,
        };

        const doctor = {
            id: visit.doctor.id,
            name: visit.doctor.user.full_name,
        };

        const medicalTicketId = visit.medicalTickets?.[0]?.id || null;
        const clinical_fee = visit.medicalTickets?.[0]?.clinical_fee || null;
        const creator = visit.created_by;

        setSelectedVisit({
            id: visit.id,
            patient,
            doctor,
            medicalTicketId,
            clinical_fee,
            creator
        });


        setShowCreateInvoiceForm(true);
    };

    const handlePrintTicket = async (visitId) => {
        if (!visitId) return;

        try {
            const ticket = await createMedicalTicket(visitId);

            setDataVisit((prev) =>
                prev.map((v) => (v.id === visitId ? { ...v, is_printed: true } : v))
            );

            const printWindow = window.open('', '_blank');
            if (!printWindow) return;

            printWindow.document.write(`
                <html>
                <head>
                    <title>Phiếu khám lâm sàng</title>
                    <style>
                        @page { size: A4; margin: 20mm; }

                        body {
                            font-family: "Times New Roman", serif;
                            font-size: 25px;
                            color: #000;
                            width: 210mm;
                            height: 297mm;
                            margin: 0;
                            padding: 0;
                        }

                        .ticket {
                            width: 100%;
                            padding: 25mm;
                            box-sizing: border-box;
                        }

                        .header {
                            text-align: center;
                            margin-bottom: 15px;
                        }

                        .header h2 {
                            margin: 0;
                            font-size: 16px;
                            font-weight: bold;
                        }

                        .header h3 {
                            margin: 5px 0;
                            font-size: 20px;
                            font-weight: bold;
                        }

                        .barcode {
                            display: block;
                            margin: 5px auto;
                        }

                        .barcode-text {
                            text-align: center;
                            font-size: 13px;
                            margin-bottom: 15px;
                        }

                        /* Bảng chính */
                        table {
                            width: 100%;
                            border: 1px solid #221f1fff; /* chỉ viền ngoài */
                            border-collapse: collapse;
                        }

                        tr {
                            border-bottom: 1px solid #000;
                        }

                        tr:last-child {
                            border-bottom: none;
                        }

                        td {
                            padding: 6px 12px;
                            border: none; /* bỏ viền giữa */
                            vertical-align: top;
                        }

                        td:first-child {
                            width: 30%;
                            font-weight: bold;
                        }

                        @media print {
                            .ticket {
                                padding: 20mm;
                            }
                        }
                    </style>
                    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                </head>
                <body>
                    <div class="ticket">
                        <div class="header">
                            <h5>PHIẾU KHÁM LÂM SÀNG</h2>
                            <h3>STT: ${ticket.queue_number}</h3>
                        </div>

                        <svg class="barcode"></svg>
                        <div class="barcode-text">${ticket.barcode}</div>

                        <table>
                            <tr>
                                <td>Tên bác sĩ:</td>
                                <td>${ticket.doctor_name || ""}</td>
                            </tr>
                            <tr>
                                <td>Tên bệnh nhân:</td>
                                <td>${ticket.patient_name || ""}</td>
                            </tr>
                            <tr>
                                <td>Năm sinh:</td>
                                <td>${formatDate(ticket.patient_dob) || ""}</td>
                            </tr>
                            <tr>
                                <td>Điện thoại:</td>
                                <td>${ticket.patient_phone || ""}</td>
                            </tr>
                            <tr>
                                <td>Địa chỉ:</td>
                                <td>${ticket.patient_address || ""}</td>
                            </tr>
                            <tr>
                                <td>Người tạo:</td>
                                <td>${ticket.createdByName || ""}</td>
                            </tr>
                            <tr>
                                <td>Ngày khám:</td>
                                <td>${ticket.issued_at ? ticket.issued_at.slice(0, 10).split('-').reverse().join('-') : ""}</td>
                            </tr>
                        </table>


                    <script>
                        // Tạo barcode
                        JsBarcode(".barcode","${ticket.barcode}", {
                            format: "CODE128",
                            displayValue: false,
                            fontSize: 13,
                            width: 1,
                            height: 20,
                            textMargin: 2
                        });

                        // Đóng cửa sổ sau in hoặc cancel
                        window.onafterprint = () => {
                            window.close();
                        };

                        // fallback: đóng khi người dùng bấm Cancel
                        setTimeout(() => {
                            window.addEventListener('focus', () => {
                                window.close();
                            });
                        }, 500);
                    </script>
                </body>
                </html>
        `);

            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

        } catch (error) {
            alert('Không thể tạo hoặc lấy Medical Ticket: ' + (error.response?.data?.message || error.message));
        }
    };

    // === HÀM MỞ MENU + LẤY VỊ TRÍ ===
    const handleOpenMenu = (index, e) => {
        e.stopPropagation();
        if (openMenuIndex === index) {
            setOpenMenuIndex(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 4,
            left: rect.right - 192,
        });
        setOpenMenuIndex(index);
    };

    // Đóng khi cuộn trang
    useEffect(() => {
        const handleScroll = () => setOpenMenuIndex(null);
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpenMenuIndex(null);
                setShowCreateForm(false);
                setShowCreateVisitForm(false);
                setShowCreateInvoiceForm(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // === KHÓA SCROLL + ÉP NỀN TRẮNG KHI MODAL MỞ ===
    useEffect(() => {
        if (showCreateVisitForm || showCreateInvoiceForm) {
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
    }, [showCreateVisitForm, showCreateInvoiceForm]);

    // Tính số tuổi
    const calculateAge = (dob) => {
        if (!dob) return "";

        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        return age;
    };

    // Số căn phải, chữ căn trái
    const headers = [
        { label: "STT", align: "right" },
        { label: "Bệnh nhân", align: "left" },
        { label: "Giới tính", align: "left" },
        { label: "Số ĐT", align: "left" },
        { label: "Địa chỉ", align: "left" },
        { label: "Ngày sinh", align: "left" },
        { label: "Trạng thái", align: "left" },
        { label: "Thao tác", align: "left" },
    ];

    const renderTable = (data, headers, rowRenderer, showScroll = true) => {
        const shouldScroll = showScroll && data.length > 5;

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <div
                        className={`relative ${shouldScroll ? "max-h-[450px] overflow-y-scroll scrollbar-hidden" : ""
                            }`}
                    >
                        <table className="min-w-full table-fixed text-sm border-collapse">
                            {/* ==== THEAD ==== */}
                            <thead>
                                <tr>
                                    {headers.map((header, i) => (
                                        <th
                                            key={i}
                                            className={`
                                            px-3 py-2
                                            ${header.align === "right" ? "text-right" : "text-left"}
                                            bg-gray-100 text-sm font-semibold text-gray-700
                                            sticky top-0 z-10
                                            border-b border-r border-gray-200
                                            whitespace-nowrap
                                        `}
                                        >
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* ==== TBODY ==== */}
                            <tbody className="text-gray-700 divide-y divide-gray-200">
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="text-[15px] hover:bg-gray-50 transition-colors"
                                        >
                                            {rowRenderer(item, index)}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={headers.length}
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
        );
    };


    return (
        <div className="h-screen bg-gray-50 font-sans flex flex-col overflow-hidden">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16 overflow-hidden">
                {/* Sidebar */}
                <div className="fixed top-16 bottom-0 left-0 w-18 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* Main */}
                <main className="flex-1 ml-24 flex flex-col overflow-hidden">
                    {/* === DANH SÁCH THĂM KHÁM === */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-700 mb-3 text-left">Danh sách thăm khám</h2>

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
                                        max={new Date().toISOString().slice(0, 10)}
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
                                    value={searchVisit}
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

                        {renderTable(
                            dataVisit,
                            headers,
                            (item, index) => (
                                <>
                                    <td className="px-3 py-2 text-right align-middle truncate border-r border-gray-200">
                                        {item.queue_number}
                                    </td>

                                    <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                        {item.patient?.patient_full_name || "Không rõ"}
                                    </td>

                                    <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                        {item.patient?.patient_gender === "NU" ? "Nữ" : "Nam"}
                                    </td>

                                    <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                        {item.patient?.patient_phone || "Không rõ"}
                                    </td>

                                    <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                        {item.patient?.patient_address || "Không rõ"}
                                    </td>

                                    <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                        {formatDate(item.patient?.patient_dob) || "Không rõ"}

                                        {item.patient?.patient_dob && (
                                            <span className="ml-1 text-gray-500 text-[12px] italic">
                                                ({calculateAge(item.patient?.patient_dob)} tuổi)
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                        <span className="px-2 py-1 rounded-full text-[15px]">
                                            {item.visit_status === "CHECKED_IN"
                                                ? "Đã xác nhận đến khám"
                                                : "Chưa xác định"}
                                        </span>
                                    </td>

                                    {/* ACTION BUTTON */}
                                    <td
                                        className="px-3 py-2 text-left align-middle truncate border-r border-gray-200 relative"
                                        ref={(el) => (menuRefs.current[index] = el)}
                                    >
                                        <button
                                            onClick={(e) => handleOpenMenu(index, e)}
                                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
                                            title="Hành động"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 9l6 6 6-6"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                </>
                            )
                        )}

                        {/* Phân trang */}
                        <div className="border-t border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Hiển thị:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008080] cursor-pointer"
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
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
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
                                            className={`w-6 h-6 text-sm font-semibold flex items-center justify-center transition rounded-md
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
                                        className={`flex items-center justify-center w-6 h-6 text-sm font-semibold transition rounded-md
                                            ${currentPage === totalPages
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer hover:text-[#008080]"}`}
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

            {/* === PORTAL: DROPDOWN KHÔNG BỊ CẮT, ĐÈ TRÊN MỌI THỨ === */}
            {openMenuIndex !== null && createPortal(
                <div
                    className="fixed inset-0 z-[99999]"
                    onMouseDown={(e) => {
                        // Nếu click ngoài dropdown → đóng
                        const dropdown = e.currentTarget.querySelector('.dropdown-menu');
                        if (dropdown && !dropdown.contains(e.target)) {
                            setOpenMenuIndex(null);
                        }
                    }}
                >
                    <div
                        className="dropdown-menu fixed bg-white border border-gray-200 rounded-xl shadow-2xl py-2 w-48"
                        style={{
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`,
                        }}
                        onMouseDown={(e) => e.stopPropagation()} // Ngăn đóng khi click vào dropdown
                    >
                        {/** Lấy visitId của bệnh nhân đang mở menu */}
                        {(() => {
                            const visitId = dataVisit[openMenuIndex]?.id; // cần có visitId trong mảng visitPatients
                            return (
                                <>
                                    <button
                                        className="ml-2 flex items-center gap-3 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
                                        onClick={() => {
                                            if (!visitId) return;
                                            // TODO: gọi API tạo hóa đơn ở đây
                                            handleSelectVisit(visitId);
                                            setOpenMenuIndex(null);
                                        }}
                                    >
                                        <i className="fa-solid fa-file-invoice text-teal-600 text-base"></i>
                                        <span className="text-base text-gray-700">Tạo hóa đơn</span>
                                    </button>

                                    <button
                                        className="ml-2 flex items-center gap-3 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
                                        onClick={() => {
                                            if (!visitId) return;
                                            // alert(`In phiếu cho visitId: ${visitId}`);
                                            handlePrintTicket(visitId);
                                            setOpenMenuIndex(null);
                                        }}
                                    >
                                        <i className="fa-solid fa-print text-indigo-600 text-base"></i>
                                        {dataVisit[openMenuIndex]?.is_printed ? (
                                            <span className="text-base text-gray-700">In lại phiếu</span>
                                        ) : (
                                            <span className="text-base text-gray-700">In phiếu</span>
                                        )}

                                    </button>

                                    <button
                                        className="ml-2 flex items-center gap-3 px-4 py-2 w-full text-left text-red-700 hover:bg-red-50 text-sm cursor-pointer"
                                        onClick={() => {
                                            if (!visitId) return;
                                            alert(`Xóa visitId: ${visitId}`);
                                            // TODO: gọi API xóa visit ở đây
                                            setOpenMenuIndex(null);
                                        }}
                                    >
                                        <i className="fa-solid fa-trash-can text-red-500 text-base"></i>
                                        <span className="text-base text-gray-700">Xóa</span>
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </div>,
                document.body
            )}

            {/* Form Bill */}
            {showCreateInvoiceForm && createPortal(
                <CreateInvoiceForm
                    visit={selectedVisit} // Truyền selectedVisit qua form
                    onSubmit={async (payload) => {
                        try {
                            console.log("Payload gửi createBill:", payload);
                            // Gọi API tạo hóa đơn
                            const res = await createBill(payload);
                            // console.log("Dữ liệu trả về:", JSON.stringify(res));

                            setCreatedInvoice(res);
                            setShowCreateInvoiceForm(false);
                            setShowPaymentMethodForm(true);
                        } catch (error) {
                            console.error("Error object:", error);
                            const errorMsg = error.response?.data?.message
                                ? Array.isArray(error.response.data.message)
                                    ? error.response.data.message.join(", ")
                                    : error.response.data.message
                                : error.message;
                            alert("Lỗi tạo hóa đơn:\n" + errorMsg);
                        }
                    }}
                    onClose={() => setShowCreateInvoiceForm(false)}
                />,
                document.body
            )}

            {/* Form Payment */}
            {showPaymentMethodForm && createdInvoice &&
                createPortal(
                    <PaymentMethodForm
                        bill={createdInvoice}
                        onSubmit={async ({ dto, method }) => {
                            try {
                                if (method === "CASH") {
                                    // Gọi API thanh toán tiền mặt
                                    const res = await paymentCash(dto);
                                    console.log("Thanh toán tiền mặt thành công!", res);
                                }
                                else if (method === "BANK_TRANSFER") {
                                    // VietQR thanh toán đã được xử lý trong CreateVietQRModal
                                    // và onSuccess callback sẽ gọi onSubmit khi thanh toán thành công
                                    console.log("Thanh toán chuyển khoản VietQR thành công!");
                                }

                                setShowPaymentMethodForm(false);
                            } catch (error) {
                                console.error("Lỗi thanh toán:", error);
                                alert("Lỗi thanh toán: " + (error.response?.data?.message || error.message));
                            }
                        }}
                        onClose={() => setShowPaymentMethodForm(false)}
                    />,
                    document.body
                )
            }
        </div>
    );
}