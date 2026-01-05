import React, { useState, useEffect, useRef } from "react";
import Toast from '../../components/modals/Toast';
import { createPortal } from "react-dom";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import CreatePatientForm from "./components/CreatePatientForm";
import CreateVisitForm from "./components/CreateVisitForm";
import { createVisit } from "../../api/visit.api";
import { getAllPatient, createPatient, getAvailableDoctorToday, exportPatientExcel } from "../../api/patient.api";
import { PatientInfo } from "./components/PatientInfo";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function Patient() {
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateVisitForm, setShowCreateVisitForm] = useState(false);
    const [selectedForVisit, setSelectedForVisit] = useState(null);
    const [dataPatient, setDataPatient] = useState([]);
    const [doctorAvailable, setDoctorAvailable] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [searchInput, setSearchInput] = useState(""); // giá trị gõ ngay lập tức
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // số phần tử trong 1 page
    const pageSizeOptions = [5, 10, 25, 50, 100];
    const [visitFilter, setVisitFilter] = useState("all");
    const debounceRef = useRef(null); // Tránh gọi API liên tục khi tìm kiếm

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 2000);
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
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
        const fetchDataPatient = async () => {
            try {
                const res = await getAllPatient({
                    visitFilter,
                    keyword,
                    page: currentPage,
                    limit: itemsPerPage
                });

                setDataPatient(res.data);
                setTotalPages(res.pagination.totalPages);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu Patient:", err);
            }
        };

        fetchDataPatient();

    }, [currentPage, itemsPerPage, keyword, visitFilter]);

    // reset debounce để tránh leak memory
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
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
            // alert("⚠️ Chưa chọn bệnh nhân để tạo thăm khám!");
            return;
        }
        const res = await createVisit(dataVisit);
        showToast("Thêm thăm khám trong ngày thành công", "success");
        setShowCreateVisitForm(false);
    };

    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSelectedPatient(null);
                setShowCreateForm(false);
                setShowCreateVisitForm(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // === KHÓA SCROLL + ÉP NỀN TRẮNG KHI MODAL MỞ ===
    useEffect(() => {
        if (selectedPatient || showCreateForm || showCreateVisitForm) {
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
    }, [selectedPatient, showCreateForm, showCreateVisitForm]);

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
        { label: "Thao tác", align: "left", hasFilter: true },
    ];

    // Hàm render bảng
    const renderTable = (data, headers, rowRenderer, showScroll = true) => {
        const shouldScroll = showScroll && data.length > 5;

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <div
                        className={`relative ${shouldScroll ? "max-h-[460px] overflow-y-scroll scrollbar-hidden" : ""
                            }`}
                    >
                        <table className="min-w-full table-fixed text-sm border-collapse">
                            <thead>
                                <tr>
                                    {headers.map((header, i) => (
                                        <th
                                            key={i}
                                            className={`px-3 py-2
                                            ${header.align === "right" ? "text-right" : "text-left"}
                                            bg-gray-100 text-sm font-semibold text-gray-700
                                            sticky top-0 z-10
                                            border-b border-gray-200 border-r border-gray-200
                                            whitespace-nowrap
                                        `}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{header.label}</span>

                                                {header.hasFilter && (
                                                    <select
                                                        value={visitFilter}
                                                        onChange={(e) => {
                                                            setVisitFilter(e.target.value);
                                                            setCurrentPage(1);
                                                        }}
                                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs
               focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    >
                                                        <option value="all">Tất cả</option>
                                                        <option value="added">Đã thêm thăm khám</option>
                                                        <option value="not_added">Chưa thêm thăm khám</option>
                                                    </select>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 divide-y divide-gray-200">
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="text-[15px] text-gray-700 hover:bg-gray-50 transition-colors"
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
                    {/* === DANH SÁCH BỆNH NHÂN === */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">

                        {/* Tiêu đề + Nút */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-700 text-left">Danh sách bệnh nhân</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setShowCreateForm(true);
                                        setOpenCreate(true);
                                    }}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-teal-700 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                                >
                                    <i className="fas fa-plus"></i> Thêm bệnh nhân
                                </button>

                                {/* <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <i className="fas fa-file-excel"></i> Nhập từ Excel
                                </button> */}
                                <button
                                    onClick={() =>
                                        exportPatientExcel({
                                            keyword,
                                            visitFilter,
                                        })
                                    }
                                    className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                    <i className="fas fa-download"></i> Xuất ra Excel
                                </button>
                            </div>
                        </div>

                        {/* Ô TÌM KIẾM danh sách bệnh nhân*/}
                        <div className="mb-2">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                                    value={searchInput}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchInput(value);

                                        if (debounceRef.current) {
                                            clearTimeout(debounceRef.current);
                                        }

                                        debounceRef.current = setTimeout(() => {
                                            setKeyword(value);
                                            setCurrentPage(1);
                                        }, 500); // delay 500ms
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
                            headers,
                            (patient, index) => {
                                // Check bệnh nhân này có visit CHECKED_IN hay không
                                // const hasActiveVisit = async()=>await checkVisitToday(patient.id);

                                return (
                                    <>
                                        <td className="pl-2 pr-4 py-2 text-right align-middle truncate border-r border-gray-200">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">{patient.patient_full_name}</td>
                                        <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">{patient.patient_gender === "NU" ? "Nữ" : "Nam"}</td>
                                        <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">{patient.patient_phone}</td>
                                        <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">{patient.patient_address}</td>
                                        <td className="px-3 py-2 text-left align-middle truncate border-r border-gray-200">
                                            {patient.patient_dob
                                                ? patient.patient_dob.slice(0, 10).split("-").reverse().join("-")
                                                : "Không rõ"}

                                            {patient.patient_dob && (
                                                <span className="ml-1 text-gray-500 text-[12px] italic">
                                                    ({calculateAge(patient.patient_dob)} tuổi)
                                                </span>
                                            )}
                                        </td>

                                        <td className="w-[100px] px-2 py-2 text-left align-middle whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {/* Thêm vào thăm khám */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedForVisit(patient);
                                                        setShowCreateVisitForm(true);
                                                    }}
                                                    disabled={patient.hasVisitToday}
                                                    className={`font-semibold py-2 px-4 rounded-lg text-[13px] shadow-md transition duration-150
                                                    ${patient.hasVisitToday
                                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                                            : "hover:cursor-pointer bg-[#008080] hover:bg-teal-600 text-white"
                                                        }`}
                                                >
                                                    Thêm vào thăm khám
                                                </button>

                                                {/* Chi tiết */}
                                                <button
                                                    title="Chi tiết"
                                                    className="p-2 rounded-full text-teal-600 hover:bg-teal-50 hover:text-teal-800 hover:cursor-pointer transition"
                                                    onClick={() => setSelectedPatient(patient)}
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {/* Cập nhật */}
                                                {/* <button
                                                    title="Cập nhật"
                                                    className="p-2 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-800 hover:cursor-pointer transition"
                                                    // onClick={() => setSelectedPatientForEdit(patient)}
                                                >
                                                    <Pencil size={18} />
                                                </button> */}

                                                {/* Xóa */}
                                                {/* <button
                                                    title="Xóa"
                                                    className="p-2 rounded-full text-red-600 hover:bg-red-50 hover:text-red-800 hover:cursor-pointer transition"
                                                    onClick={() => handleDeletePatient(patient.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </>
                                );
                            },
                            true
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

            {/* Hiển thị form tạo thăm khám */}
            {showCreateVisitForm && selectedForVisit && (
                <CreateVisitForm
                    onSubmit={handleCreateVisit}
                    onClose={() => setShowCreateVisitForm(false)}
                    patient={selectedForVisit}
                    availableDoctors={doctorAvailable}
                />
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
                                    <PatientInfo label="Giới tính" value={selectedPatient.patient_gender === "NAM" ? "Nam" : "Nữ"} />
                                    <PatientInfo label="Ngày sinh" value={selectedPatient.patient_dob} />
                                    <PatientInfo label="Số điện thoại" value={selectedPatient.patient_phone} />
                                    <PatientInfo label="Địa chỉ" value={selectedPatient.patient_address} />
                                    <PatientInfo label="Họ & tên người thân" value={selectedPatient.fatherORmother_name} />
                                    <PatientInfo label="SĐT người thân" value={selectedPatient.mother_phone} />
                                </div>

                                {/* Cột 2: Thông tin sức khỏe */}
                                <div className="space-y-5">
                                    <PatientInfo label="Chiều cao (cm)" value={selectedPatient.height} />
                                    <PatientInfo label="Cân nặng (kg)" value={selectedPatient.weight} />
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
                    onClick={() => {
                        setShowCreateForm(false);
                        setOpenCreate(false);
                    }}
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
                                    await createPatient(data);
                                    setShowCreateForm(false);
                                    setOpenCreate(false);
                                    showToast("Thêm bệnh nhân thành công!", "success");
                                } catch (error) {
                                    // console.error("Lỗi khi tạo bệnh nhân:", error);
                                    const message = error?.response?.data?.message || error.message || "Thêm bệnh nhân không thành công!";
                                    setShowCreateForm(false);
                                    setOpenCreate(false);
                                    showToast(message, "error");
                                }
                            }}
                            onClose={() => {
                                setShowCreateForm(false);
                                setOpenCreate(false);
                            }}
                        />

                    </div>
                </div>,
                document.body
            )}

            {/* Toast */}
            {toast &&
                createPortal(
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />,
                    document.body
                )
            }

        </div>
    );
}