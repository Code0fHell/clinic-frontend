const PrescriptionDetailTable = ({ medicines, onRemove, onQuantityChange, onDosageChange }) => {
  if (medicines.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm font-medium">Chưa có thuốc nào được chọn</p>
          <p className="text-xs mt-1">Tìm kiếm và thêm thuốc vào đơn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-12">STT</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[180px]">Tên thuốc</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Số lượng</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">Đơn vị</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">Công dụng</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[220px]">Liều lượng</th>
              <th className="py-3 px-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">Xóa</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {medicines.map((m, idx) => (
              <tr key={m.id} className="hover:bg-emerald-50/50 transition-colors">
                <td className="py-3 px-3 text-center font-medium text-slate-600">{idx + 1}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-800 block">{m.medicine.name}</span>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="number"
                    min={1}
                    value={m.quantity}
                    onChange={(e) => onQuantityChange(m.id, Number(e.target.value))}
                    className="w-full border-2 border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </td>
                <td className="py-3 px-3 text-slate-600 text-sm">{m.medicine.unit}</td>
                <td className="py-3 px-3 text-slate-600 text-sm">
                  <div className="line-clamp-2" title={m.medicine.description}>
                    {m.medicine.description || "—"}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="text"
                    value={m.dosage || ""}
                    onChange={(e) => onDosageChange(m.id, e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 text-sm"
                    placeholder="VD: 2 viên/ngày sau ăn"
                  />
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => onRemove(m.id)}
                    className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-200"
                    title="Xóa thuốc"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionDetailTable;
