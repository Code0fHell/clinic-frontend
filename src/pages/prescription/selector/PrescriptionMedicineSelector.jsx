import React, { useState } from "react";
import { searchMedicines } from "../../../api/medicine.api";

const PrescriptionMedicineSelector = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      const data = await searchMedicines(value);
      setResults(data);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Thêm thuốc</label>
      <input
        className="border rounded p-2 w-full"
        value={query}
        onChange={handleSearch}
        placeholder="Nhập tên thuốc cần tìm..."
      />
      {results.length > 0 && (
        <div className="bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto">
          {results.map((m) => (
            <div
              key={m.id}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
              onClick={() => {
                onSelect(m);
                setQuery("");
                setResults([]);
              }}
            >
              {m.name} {m.unit ? `(${m.unit})` : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionMedicineSelector;