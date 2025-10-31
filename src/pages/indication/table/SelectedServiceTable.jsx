const SelectedServiceTable = ({ services }) => (
  <div className="border rounded-lg overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-3 text-left">STT</th>
          <th className="py-2 px-3 text-left">Tên dịch vụ</th>
          <th className="py-2 px-3 text-left">Đơn vị</th>
        </tr>
      </thead>
      <tbody>
        {services.map((s, idx) => (
          <tr key={s.id} className="border-t">
            <td className="py-2 px-3">{idx + 1}</td>
            <td className="py-2 px-3">{s.service_name}</td>
            <td className="py-2 px-3">{s.unit || "Lần"}</td>
          </tr>
        ))}
        {services.length === 0 && (
          <tr>
            <td colSpan="3" className="text-center text-gray-400 py-3">
              Chưa chọn dịch vụ nào
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
export default SelectedServiceTable;
