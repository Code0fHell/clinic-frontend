import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-100 pt-12 pb-6 px-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <h3 className="font-bold text-xl mb-2">PMedClinic</h3>
        <p className="mb-4">Cung cấp dịch vụ khám chữa bệnh hô hấp với chất lượng, công nghệ tiên tiến</p>
        <div className="flex gap-4 text-2xl">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">Phím tắt</h4>
        <ul className="space-y-1">
          <li><Link to="/" className="hover:underline">Trang chủ</Link></li>
          <li><Link to="/services" className="hover:underline">Dịch vụ</Link></li>
          <li><Link to="/doctors" className="hover:underline">Bác sĩ</Link></li>
          <li><Link to="/about" className="hover:underline">Về PMed</Link></li>
          <li><Link to="/contact" className="hover:underline">Liên hệ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">Dịch vụ của chúng tôi</h4>
        <ul className="space-y-1">
          <li>Thuốc thông thường</li>
          <li>X-quang</li>
          <li>Xét nghiệm máu</li>
          <li>Xét nghiệm nước tiểu</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">Liên hệ với chúng tôi</h4>
        <ul className="space-y-1">
          <li>
            <i className="fas fa-map-marker-alt mr-2"></i>
            Km10 Nguyễn Trãi, Phường Mộ Lao, Quận Hà Đông, TP Hà Nội
          </li>
          <li>
            <i className="fas fa-phone mr-2"></i>
            (555) 123-4567
          </li>
          <li>
            <i className="fas fa-envelope mr-2"></i>
            pmed@mediclinic.com
          </li>
          <li>
            <i className="fas fa-clock mr-2"></i>
            T2-T6: 8h Sáng-8h Tối<br />
            Thứ 7: Đóng cửa<br />
            Chủ nhật: Đóng cửa
          </li>
        </ul>
      </div>
    </div>
    <div className="flex justify-between items-center border-t border-gray-700 pt-4 text-gray-400 text-sm">
      <span>&copy; 2025</span>
      <span>PMed</span>
    </div>
  </footer>
);

export default Footer;