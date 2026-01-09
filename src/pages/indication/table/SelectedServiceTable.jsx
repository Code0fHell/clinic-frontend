const SelectedServiceTable = ({ services, onRemove }) => (
  <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
    <table className="w-full">
      <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
        <tr>
          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
            STT
          </th>
          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Tên dịch vụ
          </th>
          <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Giá
          </th>
          <th className="py-3 px-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-200">
        {services.map((s, idx) => (
          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
            <td className="py-3 px-4 text-sm text-slate-700 font-medium">
              {idx + 1}
            </td>
            <td className="py-3 px-4">
              <div className="text-sm font-medium text-slate-800">
                {s.service_name}
              </div>
              {s.description && (
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {s.description}
                </div>
              )}
            </td>
            <td className="py-3 px-4 text-sm text-slate-700">
              {s.service_price ? (
                <span className="font-semibold text-blue-600">
                  {s.service_price.toLocaleString()} đ
                </span>
              ) : (
                <span className="text-slate-400">-</span>
              )}
            </td>
            <td className="py-3 px-4 text-center">
              <button
                onClick={() => onRemove(s.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                title="Xóa dịch vụ"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa
              </button>
            </td>
          </tr>
        ))}
        {services.length === 0 && (
          <tr>
            <td colSpan="4" className="text-center py-8">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400 text-sm font-medium">
                  Chưa chọn dịch vụ nào
                </p>
                <p className="text-slate-400 text-xs">
                  Tìm kiếm và chọn dịch vụ ở trên
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
export default SelectedServiceTable;
