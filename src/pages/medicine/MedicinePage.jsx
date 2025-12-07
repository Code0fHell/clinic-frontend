import React, { useState, useEffect } from "react";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import { getAllMedicines, getMedicineById, searchMedicines } from "../../api/medicine.api";
import { vietnameseSearch } from "../../utils/vietnameseSearch";
import Toast from "../../components/modals/Toast";

const MedicineModal = ({ medicine, isOpen, onClose }) => {
  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Hướng dẫn sử dụng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {medicine.image && (
            <div className="mb-4 flex justify-center">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="max-w-full h-auto max-h-64 rounded-lg"
                onError={(e) => {
                  e.target.src = "/assets/medicine-default.jpg";
                }}
              />
            </div>
          )}
          <h3 className="text-xl font-bold mb-4">{medicine.name}</h3>
          {medicine.description && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Mô tả:</h4>
              <p className="text-gray-700">{medicine.description}</p>
            </div>
          )}
          {medicine.manufacturer && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Nhà sản xuất:</h4>
              <p className="text-gray-700">{medicine.manufacturer}</p>
            </div>
          )}
          {medicine.category && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Danh mục:</h4>
              <p className="text-gray-700">{medicine.category}</p>
            </div>
          )}
          {medicine.unit && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Đơn vị:</h4>
              <p className="text-gray-700">{medicine.unit}</p>
            </div>
          )}
          {medicine.price && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Giá:</h4>
              <p className="text-gray-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(medicine.price)}
              </p>
            </div>
          )}
          {medicine.stock !== undefined && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Tồn kho:</h4>
              <p className="text-gray-700">{medicine.stock} {medicine.unit || "đơn vị"}</p>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const MedicinePage = () => {
  const [allMedicines, setAllMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [displayedMedicines, setDisplayedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [categories, setCategories] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterAndPaginateMedicines();
  }, [searchQuery, selectedCategory, allMedicines, currentPage]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await getAllMedicines();
      const medicinesData = response.data || response || [];
      setAllMedicines(medicinesData);
      
      // Extract unique categories
      const uniqueCategories = [
        ...new Set(medicinesData.map((m) => m.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setToast({
        show: true,
        message: "Không thể tải danh sách thuốc. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateMedicines = () => {
    let filtered = [...allMedicines];

    // Filter by category
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(
        (medicine) => medicine.category === selectedCategory
      );
    }

    // Filter by search query (Vietnamese search)
    if (searchQuery.trim()) {
      filtered = filtered.filter((medicine) => {
        const medicineName = medicine.name || "";
        return vietnameseSearch(medicineName, searchQuery);
      });
    }

    setFilteredMedicines(filtered);

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedMedicines(filtered.slice(startIndex, endIndex));
    
    // Reset to page 1 if current page is out of bounds
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleViewInstructions = async (medicineId) => {
    try {
      const response = await getMedicineById(medicineId);
      if (response.data) {
        setSelectedMedicine(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching medicine details:", error);
      setToast({
        show: true,
        message: "Không thể tải thông tin thuốc. Vui lòng thử lại sau.",
        type: "error",
      });
    }
  };

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  return (
    <RoleBasedLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Tiêu đề */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Danh sách thuốc
            </h1>
            <p className="text-gray-600 text-lg">
              Tìm kiếm và xem thông tin chi tiết về các loại thuốc
            </p>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm thuốc theo tên..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Bộ lọc theo category */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleCategoryChange("ALL")}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === "ALL"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Kết quả tìm kiếm */}
          {searchQuery && (
            <div className="mb-4 text-center text-gray-600">
              Tìm thấy {filteredMedicines.length} kết quả
            </div>
          )}

          {/* Danh sách thuốc */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          ) : displayedMedicines.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-pills text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">Không tìm thấy thuốc nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {medicine.image ? (
                      <img
                        src={medicine.image}
                        alt={medicine.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => {
                          e.target.src = "/assets/medicine-default.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
                        <i className="fas fa-pills text-5xl text-blue-400"></i>
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                      {medicine.name}
                    </h3>
                    {medicine.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {medicine.description}
                      </p>
                    )}
                    {medicine.category && (
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        {medicine.category}
                      </span>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-blue-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(medicine.price || 0)}
                      </span>
                      <button
                        onClick={() => handleViewInstructions(medicine.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
                      >
                        <i className="fas fa-info-circle"></i>
                        Xem HDSD
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-400 transition font-medium"
                  >
                    <i className="fas fa-chevron-left mr-1"></i>
                    Trước
                  </button>
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-400 transition font-medium"
                  >
                    Sau
                    <i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <MedicineModal
        medicine={selectedMedicine}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicine(null);
        }}
      />

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

export default MedicinePage;

