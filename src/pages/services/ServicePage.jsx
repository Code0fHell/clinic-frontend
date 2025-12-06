import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import { getAllMedicalServices } from "../../api/medical-service.api";
import Toast from "../../components/modals/Toast";

const ServiceTypeLabels = {
  IMAGING: "X-quang",
  TEST: "Xét nghiệm",
  EXAMINATION: "Khám bệnh",
  OTHER: "Khác",
};

const ServiceTypeIcons = {
  IMAGING: <i className="fas fa-x-ray text-2xl text-blue-400" />,
  TEST: <i className="fas fa-vial text-2xl text-blue-400" />,
  EXAMINATION: <i className="fas fa-stethoscope text-2xl text-blue-400" />,
  OTHER: <i className="fas fa-heartbeat text-2xl text-blue-400" />,
};

const ServicePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "ALL");
  const [showFilter, setShowFilter] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const limit = 9;

  useEffect(() => {
    fetchServices();
  }, [currentPage, selectedType]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const serviceType = selectedType === "ALL" ? undefined : selectedType;
      const response = await getAllMedicalServices(currentPage, limit, serviceType);
      if (response.success && response.data) {
        setServices(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setToast({
        show: true,
        message: "Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
    if (type === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <RoleBasedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dịch vụ y tế</h1>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <i className="fas fa-filter"></i>
            Lọc theo loại
          </button>
        </div>

        {showFilter && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("ALL")}
                className={`px-4 py-2 rounded transition ${
                  selectedType === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleFilterChange("IMAGING")}
                className={`px-4 py-2 rounded transition ${
                  selectedType === "IMAGING"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                X-quang
              </button>
              <button
                onClick={() => handleFilterChange("TEST")}
                className={`px-4 py-2 rounded transition ${
                  selectedType === "TEST"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Xét nghiệm
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không có dịch vụ nào</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {ServiceTypeIcons[service.service_type] || ServiceTypeIcons.OTHER}
                    <div>
                      <h3 className="font-bold text-lg">{service.service_name}</h3>
                      <span className="text-blue-600 text-sm">
                        {ServiceTypeLabels[service.service_type] || "Khác"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 min-h-[60px]">
                    {service.description || "Dịch vụ y tế chuyên nghiệp"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(service.service_price)}
                    </span>
                    {service.room && (
                      <span className="text-sm text-gray-500">
                        Phòng: {service.room.room_name || "N/A"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {currentPage} / {totalPages} (Tổng: {total})
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
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

export default ServicePage;

