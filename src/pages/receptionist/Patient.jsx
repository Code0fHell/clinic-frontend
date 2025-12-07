import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import CreatePatientForm from "./components/CreatePatientForm";
import CreateVisitForm from "./components/CreateVisitForm";
import { getTodayVisit, getDetailVisit, createVisit } from "../../api/visit.api";
import { getAllPatient, createPatient, getAvailableDoctorToday } from "../../api/patient.api";
import { PatientInfo } from "./components/PatientInfo";
import CreateInvoiceForm from "./components/CreateInvoiceForm";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { createMedicalTicket } from "../../api/medical-ticket.api";
import { createBill } from "../../api/bill.api";
import { paymentCash } from "../../api/payment.api";

export default function Patient() {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // <-- THÊM STATE VỊ TRÍ
    const [searchVisit, setSearchVisit] = useState("");
    const [searchPatient, setSearchPatient] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateVisitForm, setShowCreateVisitForm] = useState(false);
    const [showCreateInvoiceForm, setShowCreateInvoiceForm] = useState(false);
    const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
    const [createdInvoice, setCreatedInvoice] = useState(null);
    const [selectedForVisit, setSelectedForVisit] = useState(null);
    const [dataVisit, setDataVisit] = useState([]);
    const [dataPatient, setDataPatient] = useState([]);
    const [doctorAvailable, setDoctorAvailable] = useState([]);

    const menuRefs = useRef([]);

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

    useEffect(() => {
        const fetchDataPatient = async () => {
            try {
                const data = await getAllPatient();
                setDataPatient(data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu Visit:", err);
            }
        };

        fetchDataPatient();
    }, []);

    useEffect(() => {
        const fetchDoctorAvailable = async () => {
            try {
                const data = await getAvailableDoctorToday();
                setDoctorAvailable(data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu bác sĩ trống lịch:", err);
            }
        };
        fetchDoctorAvailable();
    }, []);

    const handleCreateVisit = async (dataVisit) => {
        if (!selectedForVisit) {
            alert("⚠️ Chưa chọn bệnh nhân để tạo thăm khám!");
            return;
        }
        const res = await createVisit(dataVisit);
        // console.log("Dữ liệu visit được tạo:", res);
        setDataVisit((prev) => [...prev, res]);
        setShowCreateVisitForm(false);
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
                setSelectedPatient(null);
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
        if (selectedPatient || showCreateForm || showCreateVisitForm || showCreateInvoiceForm) {
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
    }, [selectedPatient, showCreateForm, showCreateVisitForm, showCreateInvoiceForm]);

    // Hàm render bảng – GIỮ NGUYÊN CẤU TRÚC CỦA BẠN
    const renderTable = (data, headers, rowRenderer, showScroll = true) => {
        const shouldScroll = showScroll && data.length > 5;

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <div
                        className={`relative ${shouldScroll ? "max-h-[500px] overflow-y-scroll scrollbar-hidden" : ""
                            }`}
                    >
                        <table className="min-w-full table-fixed text-sm border-collapse">
                            <thead>
                                <tr>
                                    {headers.map((header, i) => (
                                        <th
                                            key={i}
                                            className="px-4 py-3 text-left bg-gray-100 text-2xl font-bold text-gray-700 sticky top-0 z-10 border-b border-gray-200 whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 divide-y divide-gray-200">
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="text-xl text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {rowRenderer(item, index)}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={headers.length}
                                            className="px-5 py-8 text-center text-gray-500 text-base"
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
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <div className="fixed top-16 bottom-0 left-0 w-20 bg-white border-r border-gray-200 z-40 ml-2">
                    <Sidebar />
                </div>

                {/* Main */}
                <main className="flex-1 ml-20 p-6 bg-gray-50 overflow-y-auto">
                    {/* === DANH SÁCH THĂM KHÁM === */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-3xl font-bold text-gray-700 mb-5 text-left">Danh sách thăm khám hôm nay</h2>

                        {/* Ô TÌM KIẾM - ĐỒNG BỘ CHIỀU RỘNG VỚI BẢNG */}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên bệnh nhân"
                                    value={searchVisit}
                                    onChange={(e) => {
                                        setSearchVisit(e.target.value);
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

                        {renderTable(
                            dataVisit,
                            ["TT", "Tên bệnh nhân", "Giới tính", "Địa chỉ", "Trạng thái", "Hành động"],
                            (item, index) => (
                                <>
                                    <td className="px-4 py-3 text-left">{item.queue_number}</td>
                                    <td className="px-4 py-3 text-left">{item.patient?.patient_full_name || "Không rõ"}</td>
                                    <td className="px-4 py-3 text-left">{item.patient?.patient_gender === "NU" ? "Nữ" : "Nam" || "Không rõ"}</td>
                                    <td className="px-4 py-3 text-left">{item.patient?.patient_address || "Không rõ"}</td>
                                    {/* Trạng thái */}
                                    <td className="px-4 py-3 text-left">
                                        <span className="px-2 py-1 rounded-full text-xl">
                                            {item.visit_status === "CHECKED_IN" ? "Đã xác nhận đến khám" : "Chưa xác định"}
                                        </span>
                                    </td>
                                    {/* === CHỈ SỬA PHẦN NÀY: NÚT MỞ MENU === */}
                                    <td className="px-4 py-3 text-left relative" ref={(el) => (menuRefs.current[index] = el)}>
                                        <button
                                            onClick={(e) => handleOpenMenu(index, e)}
                                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer"
                                            title="Hành động"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                            </svg>
                                        </button>
                                    </td>
                                </>
                            )
                        )}
                    </div>

                    {/* === DANH SÁCH BỆNH NHÂN === */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {/* Tiêu đề + Nút */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-bold text-gray-700">Danh sách bệnh nhân</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-teal-700 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                >
                                    <i className="fas fa-plus"></i> Thêm bệnh nhân
                                </button>

                                <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <i className="fas fa-file-excel"></i> Nhập từ Excel
                                </button>
                                <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <i className="fas fa-download"></i> Xuất ra Excel
                                </button>
                            </div>
                        </div>

                        {/* Ô TÌM KIẾM danh sách bệnh nhân*/}
                        <div className="mb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên bệnh nhân"
                                    value={searchPatient}
                                    onChange={(e) => {
                                        setSearchPatient(e.target.value);
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

                        {/* BẢNG */}
                        {renderTable(
                            dataPatient,
                            ["TT", "Tên bệnh nhân", "Giới tính", "Điện thoại", "Địa chỉ", "Ngày sinh", "Hành động"],
                            (patient, index) => {
                                // Check bệnh nhân này có visit CHECKED_IN hay không
                                const hasActiveVisit = dataVisit.some(
                                    (visit) =>
                                        visit.patient?.id === patient.id && visit.visit_status === "CHECKED_IN"
                                );

                                return (
                                    <>
                                        <td className="px-4 py-3 text-left align-middle truncate">{index + 1}</td>
                                        <td className="px-4 py-3 text-left align-middle truncate">{patient.patient_full_name}</td>
                                        <td className="px-4 py-3 text-left align-middle truncate">{patient.patient_gender === "NU" ? "Nữ" : "Nam"}</td>
                                        <td className="px-4 py-3 text-left align-middle truncate">{patient.patient_phone}</td>
                                        <td className="px-4 py-3 text-left align-middle truncate">{patient.patient_address}</td>
                                        <td className="px-4 py-3 text-left align-middle truncate">{patient.patient_dob.slice(0, 10).split('-').reverse().join('-')}</td>
                                        <td className="px-4 py-3 text-left align-middle whitespace-nowrap">
                                            <button
                                                className="text-teal-600 hover:text-teal-800 cursor-pointer mr-3 text-sm font-medium transition"
                                                onClick={() => {
                                                    setSelectedPatient(patient);
                                                }}
                                            >
                                                Chi tiết
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedForVisit(patient);
                                                    setShowCreateVisitForm(true);
                                                }}
                                                disabled={hasActiveVisit}
                                                className={`font-semibold py-3 px-6 rounded-lg text-base shadow-md transition duration-200
              ${hasActiveVisit
                                                        ? "bg-gray-400 cursor-not-allowed text-white"
                                                        : "hover:cursor-pointer bg-[#008080] hover:bg-teal-600 text-white"
                                                    }`}
                                            >
                                                Thêm vào thăm khám
                                            </button>
                                        </td>
                                    </>
                                );
                            },
                            true
                        )}

                    </div>
                </main>
            </div>

            {/* Hiển thị form tạo thăm khám */}
            {showCreateVisitForm && selectedForVisit && (
                <CreateVisitForm
                    onSubmit={handleCreateVisit}
                    onClose={() => setShowCreateVisitForm(false)}
                    patient={selectedForVisit}
                    availableDoctors={doctorAvailable}
                />
            )}

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


            {/* === MODAL CHI TIẾT BỆNH NHÂN - CÓ LỚP MỜ NỀN === */}
            {selectedPatient && createPortal(
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    onClick={() => setSelectedPatient(null)} // Click nền mờ → đóng
                >
                    {/* LỚP MỜ NỀN */}
                    <div className="absolute inset-0 bg-white/60 bg-opacity-50 transition-opacity"></div>

                    {/* MODAL NỔI */}
                    <div
                        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hidden animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào modal
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">Chi tiết bệnh nhân</h3>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* Cột 1: Thông tin cơ bản */}
                                <div className="space-y-5">
                                    {/* <PatientInfo label="Mã bệnh nhân" value={selectedPatient.id} /> */}
                                    <PatientInfo label="Họ & tên" value={selectedPatient.patient_full_name} />
                                    <PatientInfo label="Giới tính" value={selectedPatient.patient_gender} />
                                    <PatientInfo label="Ngày sinh" value={selectedPatient.patient_dob} />
                                    <PatientInfo label="Số điện thoại" value={selectedPatient.patient_phone} />
                                    <PatientInfo label="Địa chỉ" value={selectedPatient.patient_address} />

                                </div>

                                {/* Cột 2: Thông tin sức khỏe */}
                                <div className="space-y-5">
                                    <PatientInfo label="Họ & tên bố / mẹ" value={selectedPatient.fatherORmother_name} />
                                    <PatientInfo label="SĐT bố / mẹ" value={selectedPatient.mother_phone} />
                                    <PatientInfo label="Chiều cao" value={selectedPatient.height} />
                                    <PatientInfo label="Cân nặng" value={selectedPatient.weight} />
                                    <PatientInfo label="Nhóm máu" value={selectedPatient.blood_type} />
                                    <PatientInfo label="Huyết áp" value={selectedPatient.respiratory_rate} />
                                    <PatientInfo label="Tiền xử bệnh lý" value={selectedPatient.medical_history} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* === MODAL THÊM BỆNH NHÂN === */}
            {showCreateForm && createPortal(
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    onClick={() => setShowCreateForm(false)} // Click nền mờ → đóng
                >
                    {/* LỚP MỜ NỀN */}
                    <div className="absolute inset-0 bg-white/60 bg-opacity-50 transition-opacity"></div>

                    {/* FORM MODAL */}
                    <div
                        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hidden animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click trong modal
                    >
                        <CreatePatientForm
                            onSubmit={async (data) => {
                                try {
                                    // console.log("Gửi dữ liệu bệnh nhân:", data);

                                    const newPatient = await createPatient(data);
                                    console.log("Tạo bệnh nhân thành công:", newPatient);

                                    setDataPatient((prev) => [...prev, newPatient]);

                                    // Đóng form
                                    setShowCreateForm(false);
                                } catch (error) {
                                    console.error("Lỗi khi tạo bệnh nhân:", error);
                                    // alert(error.response?.data?.message || "Không thể tạo bệnh nhân, vui lòng thử lại!");
                                }
                            }}
                            onClose={() => setShowCreateForm(false)}
                        />

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