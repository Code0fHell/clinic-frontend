import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import { getAllDoctors } from "../../api/staff.api";
import { getClinicalDoctors } from "../../api/appointment.api";
import { vietnameseSearch } from "../../utils/vietnameseSearch";
import Toast from "../../components/modals/Toast";

// Component tiêu đề
const PageTitle = () => (
    <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Đội ngũ bác sĩ
        </h1>
        <p className="text-gray-600 text-lg">
            Đội ngũ bác sĩ chuyên khoa với nhiều năm kinh nghiệm
        </p>
    </div>
);

// Component thanh tìm kiếm
const SearchBar = ({ searchQuery, onSearchChange }) => (
    <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
            <input
                type="text"
                placeholder="Tìm kiếm bác sĩ theo tên..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
            />
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
    </div>
);

// Component bộ lọc theo chuyên khoa
const SpecialtyFilter = ({ specialties, selectedSpecialty, onSpecialtyChange }) => (
    <div className="mb-6">
        <div className="flex flex-wrap gap-3 justify-center">
            <button
                onClick={() => onSpecialtyChange("ALL")}
                className={`px-6 py-2 rounded-full font-medium transition ${
                    selectedSpecialty === "ALL"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
                Tất cả
            </button>
            {specialties.map((specialty) => (
                <button
                    key={specialty}
                    onClick={() => onSpecialtyChange(specialty)}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                        selectedSpecialty === specialty
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                    }`}
                >
                    {specialty}
                </button>
            ))}
        </div>
    </div>
);

// Component card bác sĩ
const DoctorCard = ({ doctor, onBookAppointment }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="relative">
            <img
                src={
                    doctor.user?.avatar
                        ? `http://localhost:3000${doctor.user.avatar}`
                        : "/assets/doctor-default.jpg"
                }
                alt={doctor.user?.full_name || "Bác sĩ"}
                className="w-full h-64 object-cover"
                onError={(e) => {
                    e.target.src = "/assets/doctor-default.jpg";
                }}
            />
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <i className="fas fa-check-circle mr-1"></i>
                Có sẵn
            </div>
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
                {doctor.user?.full_name || "Bác sĩ"}
            </h3>
            <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <i className="fas fa-user-md mr-1"></i>
                    {doctor.specialty || doctor.department || "Chuyên khoa"}
                </span>
            </div>
            {doctor.position && (
                <p className="text-gray-600 mb-2">
                    <i className="fas fa-briefcase mr-2 text-blue-500"></i>
                    {doctor.position}
                </p>
            )}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {doctor.description ||
                    "Bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực y tế."}
            </p>
            <button
                onClick={() => onBookAppointment(doctor)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
                <i className="fas fa-calendar-check"></i>
                Đặt lịch hẹn
            </button>
        </div>
    </div>
);

// Component danh sách bác sĩ
const DoctorsList = ({ doctors, onBookAppointment }) => {
    if (doctors.length === 0) {
        return (
            <div className="text-center py-12">
                <i className="fas fa-user-md text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">
                    Không tìm thấy bác sĩ nào
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
                <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookAppointment={onBookAppointment}
                />
            ))}
        </div>
    );
};

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [searchQuery, selectedSpecialty, doctors]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await getAllDoctors();
            const doctorsData = response.data || response || [];
            setDoctors(doctorsData);

            // Extract unique specialties
            const uniqueSpecialties = [
                ...new Set(
                    doctorsData
                        .map((d) => d.specialty || d.department)
                        .filter(Boolean)
                ),
            ];
            setSpecialties(uniqueSpecialties);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setToast({
                show: true,
                message: "Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        let filtered = [...doctors];

        // Filter by specialty
        if (selectedSpecialty !== "ALL") {
            filtered = filtered.filter(
                (doctor) =>
                    (doctor.specialty || doctor.department) === selectedSpecialty
            );
        }

        // Filter by search query (Vietnamese search)
        if (searchQuery.trim()) {
            filtered = filtered.filter((doctor) => {
                const doctorName = doctor.user?.full_name || "";
                return vietnameseSearch(doctorName, searchQuery);
            });
        }

        setFilteredDoctors(filtered);
    };

    const handleBookAppointment = async (doctor) => {
        try {
            // Check if doctor is CLINICAL
            const clinicalDoctors = await getClinicalDoctors();
            const isClinical = clinicalDoctors.some((d) => d.id === doctor.id);

            if (!isClinical) {
                setToast({
                    show: true,
                    message:
                        "Chỉ có thể đặt lịch với bác sĩ lâm sàng (CLINICAL). Vui lòng chọn bác sĩ khác.",
                    type: "warning",
                });
                return;
            }

            navigate("/patient/booking", { state: { doctorId: doctor.id } });
        } catch (error) {
            console.error("Error checking doctor type:", error);
            setToast({
                show: true,
                message: "Không thể xác minh loại bác sĩ. Vui lòng thử lại.",
                type: "error",
            });
        }
    };

    return (
        <RoleBasedLayout>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <PageTitle />
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                    <SpecialtyFilter
                        specialties={specialties}
                        selectedSpecialty={selectedSpecialty}
                        onSpecialtyChange={setSelectedSpecialty}
                    />

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Đang tải...</p>
                        </div>
                    ) : (
                        <DoctorsList
                            doctors={filteredDoctors}
                            onBookAppointment={handleBookAppointment}
                        />
                    )}
                </div>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </RoleBasedLayout>
    );
};

export default DoctorsPage;

