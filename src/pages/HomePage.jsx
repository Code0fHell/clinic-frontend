import React, { useState, useEffect } from "react";
import InfoCard from "../components/cards/InfoCard";
import RoleBasedLayout from "../components/layout/RoleBasedLayout";
import { Link, useNavigate } from "react-router-dom";
import { getHomepageServices } from "../api/medical-service.api";
import { getHomepageDoctors } from "../api/staff.api";
import { getClinicalDoctors } from "../api/appointment.api";
import Toast from "../components/modals/Toast";

const getServiceIcon = (serviceType) => {
    switch (serviceType) {
        case "IMAGING":
            return <i className="fas fa-x-ray text-3xl text-blue-400" />;
        case "TEST":
            return <i className="fas fa-vial text-3xl text-blue-400" />;
        default:
            return <i className="fas fa-stethoscope text-3xl text-blue-400" />;
    }
};

const HeroSection = () => (
    <section className="flex flex-col md:flex-row items-center justify-between py-16 px-8 bg-gradient-to-b from-blue-50 to-white">
        {/* --- Khối nội dung --- */}
        <div className="w-full md:w-1/2 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Sức khỏe của bạn là sự ưu tiên của chúng tôi
            </h1>
            <p className="mb-6 text-gray-600">
                Hãy trải nghiệm các dịch vụ khám sức khỏe tại phòng khám với đội
                ngũ bác sĩ chuyên nghiệp. Chúng tôi đảm bảo sẽ cung cấp sự chăm
                sóc tận tình cho bạn và gia đình của bạn.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/patient/booking"
                    className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Đặt lịch hẹn
                </Link>
                <Link
                    to="/doctors"
                    className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Xem tất cả
                </Link>
            </div>
        </div>

        {/* --- Khối hình ảnh --- */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
            <div className="w-full max-w-lg aspect-video">
                <img
                    src="src/assets/hero-img.webp"
                    alt="Khám bệnh"
                    className="rounded-2xl w-full h-full object-cover shadow-lg"
                />
            </div>
        </div>
    </section>
);

const ServicesSection = ({ services }) => {
    const navigate = useNavigate();

    const handleViewDetails = (serviceType) => {
        navigate(`/services?type=${serviceType}`);
    };

    return (
        <section className="py-16 px-8 bg-white">
            <h2 className="text-2xl font-bold text-center mb-2">
                Dịch vụ của chúng tôi
            </h2>
            <p className="text-center text-gray-500 mb-8">
                Chúng tôi cung cấp các dịch vụ với cơ sở vật chất tiên tiến và
                đảm bảo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {services.length > 0 ? (
                    services.map((s, idx) => (
                        <div
                            key={idx}
                            className="bg-blue-50 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-lg transition"
                        >
                            <div className="mb-4">
                                {getServiceIcon(s.service_type)}
                            </div>
                            <h3 className="font-bold text-lg mb-2">
                                {s.service_name}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {s.description || "Dịch vụ y tế chuyên nghiệp"}
                            </p>
                            <button
                                onClick={() =>
                                    handleViewDetails(s.service_type)
                                }
                                className="text-blue-600 hover:underline text-sm font-medium"
                            >
                                Xem chi tiết &rarr;
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500">
                        Đang tải dịch vụ...
                    </div>
                )}
            </div>
            <div className="flex justify-center">
                <Link
                    to="/services"
                    className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Xem tất cả
                </Link>
            </div>
        </section>
    );
};

const DoctorsSection = ({ doctors, onBookAppointment }) => {
    return (
        <section className="py-16 px-8 bg-white">
            <h2 className="text-2xl font-bold text-center mb-2">Các bác sĩ</h2>
            <p className="text-center text-gray-500 mb-8">
                Đội ngũ bác sĩ chuyên khoa với nhiều năm kinh nghiệm
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {doctors.length > 0 ? (
                    doctors.map((d, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow p-6 flex flex-col items-center"
                        >
                            <img
                                src={`http://localhost:3000${d.user?.avatar}`}
                                alt={d.user?.full_name || "Bác sĩ"}
                                className="w-28 h-28 rounded-full object-cover mb-4"
                                onError={(e) => {
                                    e.target.src = "/assets/doctor-default.jpg";
                                }}
                            />
                            <h3 className="font-bold text-lg mb-1">
                                {d.user?.full_name || "Bác sĩ"}
                            </h3>
                            <span className="text-blue-600 font-medium mb-2">
                                {d.specialty || d.department || "Chuyên khoa"}
                            </span>
                            <p className="text-gray-500 text-center mb-4">
                                {d.specialty ||
                                    d.position ||
                                    "Bác sĩ chuyên nghiệp"}
                            </p>
                            <button
                                onClick={() => onBookAppointment(d)}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Đặt lịch hẹn &rarr;
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500">
                        Đang tải thông tin bác sĩ...
                    </div>
                )}
            </div>
            <div className="flex justify-center">
                <Link
                    to="/doctors"
                    className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Xem tất cả
                </Link>
            </div>
        </section>
    );
};

const BookingSection = () => (
    <section className="py-16 px-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">
            Sẵn sàng để xếp lịch cho chuyên thăm khám của bạn?
        </h2>
        <p className="mb-6">
            Đặt lịch hẹn với bác sĩ của chúng tôi ngay hôm nay để nhận những tư
            vấn hữu ích nhất
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
                to="/patient/booking"
                className="bg-white text-blue-600 px-8 py-2 rounded font-semibold hover:bg-blue-50 transition"
            >
                Đặt lịch hẹn
            </Link>
            <Link
                to="/services"
                className="bg-white text-blue-600 px-8 py-2 rounded font-semibold hover:bg-blue-50 transition"
            >
                Dịch vụ của chúng tôi
            </Link>
        </div>
    </section>
);

const HomePage = () => {
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, doctorsRes] = await Promise.all([
                    getHomepageServices(),
                    getHomepageDoctors(),
                ]);

                // Chỉ hiển thị 1 dịch vụ cho mỗi loại dịch vụ
                const servicesData = servicesRes.data || [];
                const serviceTypes = ["IMAGING", "TEST"];
                const filteredServices = [];

                serviceTypes.forEach((type) => {
                    const serviceOfType = servicesData.find(
                        (s) => s.service_type === type
                    );
                    if (serviceOfType) {
                        filteredServices.push(serviceOfType);
                    }
                });

                setServices(filteredServices);
                setDoctors(doctorsRes.data || []);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
                setToast({
                    show: true,
                    message: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
                    type: "error",
                });
            }
        };
        fetchData();
    }, []);

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
            <div className="bg-gray-50">
                <HeroSection />
                <ServicesSection services={services} />
                <DoctorsSection
                    doctors={doctors}
                    onBookAppointment={handleBookAppointment}
                />
                <BookingSection />
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

export default HomePage;
