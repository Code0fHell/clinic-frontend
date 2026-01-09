import React, { useState, useEffect, useRef } from "react";
import { searchMedicalServices } from "../../../api/medical-service.api";

const ServiceSearchBox = ({ onSelect, serviceType }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

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
                console.log("🔍 Searching with serviceType:", serviceType, "query:", query);
                const res = await searchMedicalServices(query, serviceType);
                console.log("📦 Search results:", res);
                setResults(res || []);
                setShowDropdown(true);
            } catch (err) {
                console.error("Lỗi tìm kiếm dịch vụ:", err);
            } finally {
                setLoading(false);
            }
        }, 300);
    }, [query, serviceType]);

    const handleSelect = (service) => {
        onSelect(service);
        setQuery("");
        setShowDropdown(false);
        // Ẩn focus khỏi input sau khi chọn
        if (inputRef.current) inputRef.current.blur();
    };

    const getPlaceholder = () => {
        if (serviceType === "IMAGING") {
            return "Tìm dịch vụ hình ảnh (X-quang, CT, MRI, Siêu âm...)";
        } else if (serviceType === "TEST") {
            return "Tìm dịch vụ xét nghiệm (Máu, Nước tiểu, Sinh hóa...)";
        }
        return "Nhập tên dịch vụ...";
    };

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Tìm kiếm dịch vụ
            </label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    className="border-2 border-slate-200 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder={getPlaceholder()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Loader */}
            {loading && (
                <div className="absolute right-12 top-[46px]">
                    <svg
                        className="animate-spin h-5 w-5 text-blue-500"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}

            {/* Dropdown kết quả */}
            {showDropdown && results.length > 0 && (
                <ul className="absolute z-20 w-full border-2 border-slate-200 rounded-lg mt-2 bg-white shadow-xl max-h-64 overflow-auto">
                    {results.map((r) => (
                        <li
                            key={r.id}
                            onClick={() => handleSelect(r)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="font-medium text-slate-800 text-sm">
                                        {r.service_name}
                                    </div>
                                    {r.description && (
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                                            {r.description}
                                        </div>
                                    )}
                                </div>
                                {r.service_price && (
                                    <div className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                                        {r.service_price.toLocaleString()} đ
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Không tìm thấy */}
            {showDropdown &&
                !loading &&
                results.length === 0 &&
                query.length >= 2 && (
                    <div className="absolute w-full bg-white border-2 border-slate-200 rounded-lg mt-2 px-4 py-3 text-sm text-slate-500 shadow-xl">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Không tìm thấy dịch vụ phù hợp</span>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default ServiceSearchBox;
