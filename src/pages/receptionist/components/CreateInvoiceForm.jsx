import React, { useState } from "react";
import { createBill } from "../../../api/bill.api";
import { createVietQRPayment } from "../../../api/payment.api";
import formatCurrency from "../../../utils/formatCurrency";
import Toast from "../../../components/modals/Toast";

const initialForm = {
  bill_type: "SERVICE",
  patient_id: "",
  medical_ticket_id: "",
  indication_ticket_id: "",
  prescription_id: "",
};

const CreateInvoiceForm = () => {
  const [form, setForm] = useState(initialForm);
  const [bill, setBill] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const billPayload = {
        bill_type: form.bill_type,
        patient_id: form.patient_id,
      };
      if (form.bill_type === "CLINICAL") {
        billPayload.medical_ticket_id = form.medical_ticket_id;
      } else if (form.bill_type === "SERVICE") {
        billPayload.indication_ticket_id = form.indication_ticket_id;
      } else if (form.bill_type === "MEDICINE") {
        billPayload.prescription_id = form.prescription_id;
      }

      const createdBill = await createBill(billPayload);
      setBill(createdBill);
      setPayment(null);
      showToast("Đã tạo hóa đơn", "success");
    } catch (err) {
      showToast(
        err?.response?.message || err?.message || "Không thể tạo hóa đơn",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVietQR = async () => {
    if (!bill) return;
    try {
      const amount = Number(bill.total);
      if (!amount) {
        showToast("Hóa đơn không có tổng tiền", "error");
        return;
      }
      const paymentInfo = await createVietQRPayment({
        bill_id: bill.id,
        amount,
      });
      setPayment(paymentInfo);
      showToast("Đã tạo mã QR thanh toán", "success");
    } catch (err) {
      showToast(
        err?.response?.message || err?.message || "Không thể tạo mã QR",
        "error"
      );
    }
  };

  const renderReferenceField = () => {
    switch (form.bill_type) {
      case "CLINICAL":
        return (
          <input
            type="text"
            name="medical_ticket_id"
            value={form.medical_ticket_id}
            onChange={handleChange}
            placeholder="Nhập ID phiếu khám"
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        );
      case "SERVICE":
        return (
          <input
            type="text"
            name="indication_ticket_id"
            value={form.indication_ticket_id}
            onChange={handleChange}
            placeholder="Nhập ID phiếu chỉ định"
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        );
      case "MEDICINE":
        return (
          <input
            type="text"
            name="prescription_id"
            value={form.prescription_id}
            onChange={handleChange}
            placeholder="Nhập ID đơn thuốc"
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6 shadow mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Tạo hóa đơn thanh toán
      </h3>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-gray-500">Bệnh nhân *</label>
          <input
            type="text"
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            placeholder="Nhập ID bệnh nhân"
            className="border rounded-lg px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Loại hóa đơn *</label>
          <select
            name="bill_type"
            value={form.bill_type}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="CLINICAL">Khám lâm sàng</option>
            <option value="SERVICE">Dịch vụ cận lâm sàng</option>
            <option value="MEDICINE">Tiền thuốc</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-sm text-gray-500">Tham chiếu *</label>
          {renderReferenceField()}
        </div>

        <div className="col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold ${
              loading
                ? "bg-gray-200 text-gray-500"
                : "bg-[#008080] text-white hover:bg-[#026868]"
            }`}
          >
            {loading ? "Đang tạo..." : "Tạo hóa đơn"}
          </button>

          {bill && (
            <button
              type="button"
              onClick={handleVietQR}
              className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Tạo mã QR
            </button>
          )}
        </div>
      </form>

      {bill && (
        <div className="mt-4 text-sm text-gray-700">
          <p>
            Mã hóa đơn: <span className="font-semibold">{bill.id}</span>
          </p>
          <p>
            Tổng tiền:{" "}
            <span className="font-semibold">
              {formatCurrency(bill.total)}
            </span>
          </p>
        </div>
      )}

      {payment && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Vui lòng quét mã để thanh toán
          </p>
          <img
            src={payment.qrCode}
            alt="VietQR"
            className="w-48 h-48 object-contain border rounded-xl p-2 bg-white"
          />
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default CreateInvoiceForm;

