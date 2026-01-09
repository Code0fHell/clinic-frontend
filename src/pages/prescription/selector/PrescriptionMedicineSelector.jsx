import React, { useState, useEffect, useRef } from "react";
import { searchMedicines } from "../../../api/medicine.api";

const PrescriptionMedicineSelector = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchMedicines(query);
        setResults(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Lỗi tìm kiếm thuốc:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSelect = (medicine) => {
    onSelect(medicine);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        Tìm kiếm thuốc <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
          placeholder="Nhập tên thuốc để tìm kiếm..."
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-emerald-500"
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
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-20 w-full border-2 border-slate-200 rounded-lg mt-2 bg-white shadow-xl max-h-64 overflow-auto">
          {results.map((m) => (
            <li
              key={m.id}
              onClick={() => handleSelect(m)}
              className="px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
            >
              <div className="font-semibold text-slate-800">{m.name}</div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                {m.unit && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {m.unit}
                  </span>
                )}
                {m.price && (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {m.price.toLocaleString()} đ
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute z-20 w-full bg-white border-2 border-slate-200 rounded-lg mt-2 px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2 text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Không tìm thấy thuốc phù hợp</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionMedicineSelector;
