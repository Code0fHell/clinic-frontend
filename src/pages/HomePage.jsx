import React from "react";
import InfoCard from "../components/cards/InfoCard";
import RoleBasedLayout from "../components/layout/RoleBasedLayout";
import { Link } from "react-router-dom";

const services = [
  {
    icon: <i className="fas fa-pills text-3xl text-blue-400" />,
    title: "Thuốc",
    desc: "Comprehensive care for patients of all ages, treating a wide variety of conditions and diseases.",
    link: "/services/medicine",
  },
  {
    icon: <i className="fas fa-x-ray text-3xl text-blue-400" />,
    title: "X-quang",
    desc: "Expert care for disorders of the nervous system, brain, and spinal cord.",
    link: "/services/xray",
  },
  {
    icon: <i className="fas fa-vial text-3xl text-blue-400" />,
    title: "Xét nghiệm",
    desc: "Comprehensive laboratory services with quick and accurate results for better diagnosis.",
    link: "/services/lab",
  },
];

const doctors = [
  {
    name: "Bác sĩ Nguyễn Thị Mai Lan",
    specialty: "Nội hô hấp",
    desc: "Specializing in cardiovascular health with over 15 years of experience in treating heart conditions.",
    img: "/assets/doctor1.jpg",
  },
  {
    name: "Bác sĩ Nguyễn Trường Sơn",
    specialty: "Chẩn đoán hình ảnh",
    desc: "Expert in diagnosing and treating disorders of the nervous system with a focus on stroke prevention.",
    img: "/assets/doctor2.jpg",
  },
  {
    name: "Bác sĩ Lê Gia Quang",
    specialty: "Ung thư",
    desc: "Dedicated to providing compassionate care for children from infancy through adolescence.",
    img: "/assets/doctor3.jpg",
  },
];

const HeroSection = () => (
  <section className="flex flex-col md:flex-row items-center justify-between py-16 px-8 bg-gradient-to-b from-blue-50 to-white">
    {/* --- Khối nội dung --- */}
    <div className="w-full md:w-1/2 max-w-xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Sức khỏe của bạn là sự ưu tiên của chúng tôi
      </h1>
      <p className="mb-6 text-gray-600">
        Hãy trải nghiệm các dịch vụ khám sức khỏe tại phòng khám với đội ngũ bác sĩ chuyên nghiệp. 
        Chúng tôi đảm bảo sẽ cung cấp sự chăm sóc tận tình cho bạn và gia đình của bạn.
      </p>
      <div className="flex gap-4">
        <Link to="/patient/booking" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Đặt lịch hẹn</Link>
        <Link to="/doctors" className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition">Xem tất cả</Link>
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

const ServicesSection = () => (
  <section className="py-16 px-8 bg-white">
    <h2 className="text-2xl font-bold text-center mb-2">Dịch vụ của chúng tôi</h2>
    <p className="text-center text-gray-500 mb-8">
      Chúng tôi cung cấp các dịch vụ với cơ sở vật chất tiên tiến và đảm bảo
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {services.map((s, idx) => (
        <InfoCard
          key={idx}
          icon={s.icon}
          title={s.title}
          desc={s.desc}
          link={s.link}
        />
      ))}
    </div>
    <div className="flex justify-center">
      <a href="/services" className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition">Xem tất cả</a>
    </div>
  </section>
);

const DoctorsSection = () => (
  <section className="py-16 px-8 bg-white">
    <h2 className="text-2xl font-bold text-center mb-2">Các bác sĩ</h2>
    <p className="text-center text-gray-500 mb-8">
      Đội ngũ bác sĩ chuyên khoa hô hấp với nhiều năm kinh nghiệm
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {doctors.map((d, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <img src={d.img} alt={d.name} className="w-28 h-28 rounded-full object-cover mb-4" />
          <h3 className="font-bold text-lg mb-1">{d.name}</h3>
          <span className="text-blue-600 font-medium mb-2">{d.specialty}</span>
          <p className="text-gray-500 text-center mb-4">{d.desc}</p>
          <a href="/booking" className="text-blue-600 hover:underline text-sm">Đặt lịch hẹn &rarr;</a>
        </div>
      ))}
    </div>
    <div className="flex justify-center">
      <a href="/doctors" className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition">Xem tất cả</a>
    </div>
  </section>
);

const BookingSection = () => (
  <section className="py-16 px-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center">
    <h2 className="text-2xl font-bold mb-2">Sẵn sàng để xếp lịch cho chuyên thăm khám của bạn?</h2>
    <p className="mb-6">Đặt lịch hẹn với bác sĩ của chúng tôi ngay hôm nay để nhận những tư vấn hữu ích nhất</p>
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Link to="/patient/booking" className="bg-white text-blue-600 px-8 py-2 rounded font-semibold hover:bg-blue-50 transition">Đặt lịch hẹn</Link>
      <Link to="/services" className="bg-white text-blue-600 px-8 py-2 rounded font-semibold hover:bg-blue-50 transition">Dịch vụ của chúng tôi</Link>
    </div>
  </section>
);

const HomePage = () => (
  <RoleBasedLayout>
    <div className="bg-gray-50">
        <HeroSection />
        <ServicesSection />
        <DoctorsSection />
        <BookingSection />
    </div>
  </RoleBasedLayout>
);

export default HomePage;