import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import CreatePatientForm from "./components/CreatePatientForm";
import CreateVisitForm from "./components/CreateVisitForm";

export default function Patient() {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // <-- THÊM STATE VỊ TRÍ
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateVisitForm, setShowCreateVisitForm] = useState(false);
    const [selectedForVisit, setSelectedForVisit] = useState(null);

    const menuRefs = useRef([]);

    const fakeAvailableDoctors = [
        { id: "D001", full_name: "BS. Nguyễn Văn Minh", specialty: "Nội tổng quát" },
        { id: "D002", full_name: "BS. Trần Thị Lan", specialty: "Nhi khoa" },
        { id: "D003", full_name: "BS. Lê Văn An", specialty: "Tai Mũi Họng" },
    ];

    const visitPatients = [
        { id: "P001", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P002", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P003", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đã xong", statusColor: "bg-green-100 text-green-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
        { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", status: "Đang khám", statusColor: "bg-yellow-100 text-yellow-800" },
    ];

    // const allPatients = [
    //     { id: "P001", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", dob: "1990-05-15" },
    //     { id: "P002", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", dob: "1990-05-15" },
    //     { id: "P003", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", dob: "1990-05-15" },
    //     { id: "P004", name: "Nguyễn Trường Sơn", gender: "Nam", address: "123 Nguyễn Huệ St, HCMC", dob: "1990-05-15" },
    // ];
    const allPatients = [
        {
            id: "P001",
            name: "Nguyễn Trường Sơn",
            gender: "Nam",
            address: "123 Nguyễn Huệ St, HCMC",
            dob: "1990-05-15",
            fatherName: "Nguyễn Văn A",
            motherName: "Trần Thị B",
            fatherPhone: "0912345678",
            motherPhone: "0987654321",
            weight: "75 kg",
            bloodType: "O+",
            bloodPressure: "120/80",
            temperature: "37.0°C",
            occupation: "Engineer"
        },
        {
            id: "P002",
            name: "Lê Gia Quang",
            gender: "Nam",
            address: "456 Lê Lợi St, HCMC",
            dob: "1988-08-22",
            occupation: "Manager"
        },
        {
            id: "P003",
            name: "Bùi Trường Sơn",
            gender: "Nam",
            address: "789 Đồng Khởi St, HCMC",
            dob: "1992-03-10",
            occupation: "Doctor"
        },
        {
            id: "P004",
            name: "Nguyễn Bảo Hoàng",
            gender: "Nam",
            address: "321 Tôn Đức Thắng St, HCMC",
            dob: "1995-07-18",
            occupation: "Student"
        },
        {
            id: "P005",
            name: "John Smith",
            gender: "Nam",
            address: "999 Highway St, New York",
            dob: "1985-12-03",
            occupation: "Accountant"
        },
        {
            id: "P006",
            name: "Sarah Williams",
            gender: "Nữ",
            address: "555 Market St, San Francisco",
            dob: "1992-06-20",
            occupation: "Designer"
        },
    ];

    const handleCreateVisit = (visitData) => {
        if (!selectedForVisit) {
            alert("⚠️ Chưa chọn bệnh nhân để tạo thăm khám!");
            return;
        }

        // console.log("✅ Bệnh nhân được chọn:", selectedForVisit);
        // console.log("📦 Dữ liệu thăm khám gửi lên:", visitData);

        // Ví dụ lưu lại hoặc gọi API
        const newVisit = {
            ...visitData,
            patient_id: selectedForVisit.id,
            patient_name: selectedForVisit.name,
        };

        console.log("🚀 Visit mới được tạo:", newVisit);
        setShowCreateVisitForm(false);
    };


    // === HÀM MỞ MENU + LẤY VỊ TRÍ ===
    const handleOpenMenu = (index, e) => {
        e.stopPropagation();
        if (openMenuIndex === index) {
            setOpenMenuIndex(null); // Đóng nếu ấn lại
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
                                            className="px-4 py-3 text-center bg-gray-100 text-2xl font-bold text-gray-700 sticky top-0 z-10 border-b border-gray-200 whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 divide-y divide-gray-200">
                                {data.map((item, index) => (
                                    <tr key={index} className="text-xl text-gray-700 hover:bg-gray-50 transition-colors">
                                        {rowRenderer(item, index)}
                                    </tr>
                                ))}
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
                        <h2 className="text-3xl font-bold text-gray-700 mb-5 text-left">Danh sách thăm khám</h2>

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

                        {renderTable(
                            visitPatients,
                            ["Mã bệnh nhân", "Tên bệnh nhân", "Giới tính", "Địa chỉ", "Trạng thái", "Hành động"],
                            (patient, index) => (
                                <>
                                    <td className="px-4 py-3 text-center">{patient.id}</td>
                                    <td className="px-4 py-3 text-center">{patient.name}</td>
                                    <td className="px-4 py-3 text-center">{patient.gender}</td>
                                    <td className="px-4 py-3 text-center">{patient.address}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-base font-medium ${patient.statusColor}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    {/* === CHỈ SỬA PHẦN NÀY: NÚT MỞ MENU === */}
                                    <td className="px-4 py-3 text-center relative" ref={(el) => (menuRefs.current[index] = el)}>
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

                        {/* BẢNG */}
                        {renderTable(
                            allPatients,
                            ["Mã bệnh nhân", "Tên bệnh nhân", "Giới tính", "Địa chỉ", "Ngày sinh", "Hành động"],
                            (patient) => (
                                <>
                                    <td className="px-4 py-3 text-center align-middle truncate">{patient.id}</td>
                                    <td className="px-4 py-3 text-center align-middle truncate">{patient.name}</td>
                                    <td className="px-4 py-3 text-center align-middle truncate">{patient.gender}</td>
                                    <td className="px-4 py-3 text-center align-middle truncate">{patient.address}</td>
                                    <td className="px-4 py-3 text-center align-middle truncate">{patient.dob}</td>
                                    <td className="px-4 py-3 text-center align-middle whitespace-nowrap">
                                        <button
                                            className="text-teal-600 hover:text-teal-800 cursor-pointer mr-3 text-sm font-medium transition"
                                            onClick={() => setSelectedPatient(patient)}
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log("🧩 Patient được chọn:", patient);
                                                setSelectedForVisit(patient);
                                                setShowCreateVisitForm(true);
                                            }}
                                            className="bg-[#008080] hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md text-base"
                                        >
                                            Thêm vào thăm khám
                                        </button>


                                    </td>
                                </>
                            ),
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
                    availableDoctors={fakeAvailableDoctors}
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
                        <button
                            className="ml-2 flex items-center gap-3 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
                            onClick={() => {
                                alert(`Tạo hóa đơn cho ${visitPatients[openMenuIndex].id}`);
                                setOpenMenuIndex(null);
                            }}
                        >
                            <i className="fa-solid fa-file-invoice text-teal-600 text-base"></i>
                            <span className="text-base text-gray-700">Tạo hóa đơn</span>
                        </button>

                        <button
                            className="ml-2 flex items-center gap-3 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
                            onClick={() => {
                                alert(`In phiếu cho ${visitPatients[openMenuIndex].id}`);
                                setOpenMenuIndex(null);
                            }}
                        >
                            <i className="fa-solid fa-print text-indigo-600 text-base"></i>
                            <span className="text-base text-gray-700">In phiếu</span>
                        </button>

                        <button
                            className="ml-2 flex items-center gap-3 px-4 py-2 w-full text-left text-red-700 hover:bg-red-50 text-sm cursor-pointer"
                            onClick={() => {
                                alert(`Xóa ${visitPatients[openMenuIndex].id}`);
                                setOpenMenuIndex(null);
                            }}
                        >
                            <i className="fa-solid fa-trash-can text-red-500 text-base"></i>
                            <span className="text-base text-gray-700">Xóa</span>
                        </button>
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
                                {/* Cột 1 */}
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mã bệnh nhân</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Họ và tên</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Giới tính</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.dob}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.address}</p>
                                    </div>
                                    {selectedPatient.occupation && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nghề nghiệp</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.occupation}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Cột 2 */}
                                <div className="space-y-5">
                                    {selectedPatient.fatherName && (
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tên cha</p>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.fatherName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">SĐT cha</p>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.fatherPhone}</p>
                                            </div>
                                        </>
                                    )}
                                    {selectedPatient.motherName && (
                                        <>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tên mẹ</p>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.motherName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">SĐT mẹ</p>
                                                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.motherPhone}</p>
                                            </div>
                                        </>
                                    )}
                                    {selectedPatient.weight && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Cân nặng</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.weight}</p>
                                        </div>
                                    )}
                                    {selectedPatient.bloodType && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nhóm máu</p>
                                            <p className="text-lg font-semibold text-teal-600 mt-1">{selectedPatient.bloodType}</p>
                                        </div>
                                    )}
                                    {selectedPatient.bloodPressure && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Huyết áp</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.bloodPressure}</p>
                                        </div>
                                    )}
                                    {selectedPatient.temperature && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nhiệt độ</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPatient.temperature}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <button className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition font-medium shadow-sm">
                                Thêm vào thăm khám
                            </button>
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
                            onSubmit={(data) => {
                                console.log("Dữ liệu bệnh nhân mới:", data);
                                setShowCreateForm(false);
                            }}
                            onClose={() => setShowCreateForm(false)}
                        />

                    </div>
                </div>,
                document.body
            )}

        </div>
    );
}