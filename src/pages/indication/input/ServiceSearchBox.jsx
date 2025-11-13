import React, { useState, useEffect, useRef } from "react";
import { searchMedicalServices } from "../../../api/medical-service.api";

const ServiceSearchBox = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Gọi API tìm kiếm có debounce 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchMedicalServices(query);
        setResults(res || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Lỗi tìm kiếm dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = (service) => {
    onSelect(service);
    setQuery(service.service_name);
    setShowDropdown(false);
  };

  return (
    <div className="relative mb-4 w-full">
      <label className="block text-gray-600 text-sm mb-1">Tìm dịch vụ</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200 outline-none"
        placeholder="Nhập tên dịch vụ..."
      />

      {/* Loader nhỏ */}
      {loading && (
        <div className="absolute right-3 top-[38px]">
          <svg
            className="animate-spin h-4 w-4 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            ></path>
          </svg>
        </div>
      )}

      {/* Dropdown kết quả */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-20 w-full border rounded mt-1 bg-white shadow-lg max-h-48 overflow-auto">
          {results.map((r) => (
            <li
              key={r.id}
              onClick={() => handleSelect(r)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              <div className="font-medium text-gray-800">{r.service_name}</div>
              {r.service_price && (
                <div className="text-xs text-gray-500">
                  {r.service_price.toLocaleString()} đ
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Không tìm thấy */}
      {showDropdown && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute w-full bg-white border rounded mt-1 px-3 py-2 text-sm text-gray-500 shadow">
          Không tìm thấy dịch vụ phù hợp
        </div>
      )}
    </div>
  );
};

export default ServiceSearchBox;
