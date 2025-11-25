const PrescriptionDetailTable = ({ medicines, onRemove, onQuantityChange, onDosageChange }) => {
  return (
    <div className="mt-2 relative">
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-3">STT</th>
            <th className="py-2 px-3">Tên thuốc</th>
            <th className="py-2 px-3">Số lượng</th>
            <th className="py-2 px-3">Đơn vị</th>
            <th className="py-2 px-3">Công dụng</th>
            <th className="py-2 px-3">Liều lượng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m, idx) => (
            <tr key={m.id}>
              <td className="py-2 px-3 text-center">{idx + 1}</td>
              <td className="py-2 px-3">{m.medicine.name}</td>
              <td className="py-2 px-3">
                <input
                  type="number"
                  min={1}
                  value={m.quantity}
                  onChange={(e) => onQuantityChange(m.id, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
              </td>
              <td className="py-2 px-3">{m.medicine.unit}</td>
              <td className="py-2 px-3">{m.medicine.description}</td>
              <td className="py-2 px-3">
                <input
                  type="text"
                  value={m.dosage || ""}
                  onChange={(e) => onDosageChange(m.id, e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Ví dụ: 2 viên sau ăn"
                />
              </td>
              <td>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => onRemove(m.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrescriptionDetailTable;
