import React, { useState } from "react";
import IndicationDetailModal from "../modals/IndicationDetailModal";
import PrescriptionDetailModal from "../modals/PrescriptionDetailModal";

const MedicalRecordTabs = ({
    indications,
    prescriptions,
    labTestResults = [],
    imageResults = [],
}) => {
    const [tab, setTab] = useState("indication");
    const [selectedIndication, setSelectedIndication] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [selectedLabTest, setSelectedLabTest] = useState(null);
    const [selectedImageResult, setSelectedImageResult] = useState(null);

    return (
        <div>
            <div className="flex gap-8 border-b mb-6">
                <button
                    className={`pb-2 px-2 border-b-2 transition font-medium ${
                        tab === "indication"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setTab("indication")}
                >
                    Phiếu chỉ định
                </button>
                <button
                    className={`pb-2 px-2 border-b-2 transition font-medium ${
                        tab === "prescription"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setTab("prescription")}
                >
                    Đơn thuốc
                </button>
                <button
                    className={`pb-2 px-2 border-b-2 transition font-medium ${
                        tab === "labtest"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setTab("labtest")}
                >
                    Kết quả xét nghiệm
                </button>
                <button
                    className={`pb-2 px-2 border-b-2 transition font-medium ${
                        tab === "imaging"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setTab("imaging")}
                >
                    Kết quả chẩn đoán hình ảnh
                </button>
            </div>
            {tab === "indication" && (
                <div>
                    <table className="w-full mb-4 text-sm">
                        <thead>
                            <tr className="bg-[#f7f7f9] text-gray-700">
                                <th className="p-2 font-medium">STT</th>
                                <th className="p-2 font-medium">Ngày chỉ định</th>
                                <th className="p-2 font-medium">Bác sĩ</th>
                                <th className="p-2 font-medium">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {indications.map((ind, idx) => (
                                <tr key={ind.id} className="border-b">
                                    <td className="p-2 text-center">
                                        {idx + 1}
                                    </td>
                                    <td className="p-2 text-center">
                                        {ind.indication_date?.slice(0, 10)}
                                    </td>
                                    <td className="p-2">{ind.doctor.user.full_name}</td>
                                    <td className="p-2 text-center">
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                setSelectedIndication(ind)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedIndication && (
                        <IndicationDetailModal
                            indication={selectedIndication}
                            onClose={() => setSelectedIndication(null)}
                        />
                    )}
                </div>
            )}
            {tab === "prescription" && (
                <div>
                    <table className="w-full mb-4 text-sm">
                        <thead>
                            <tr className="bg-[#f7f7f9] text-gray-700">
                                <th className="p-2 font-medium">STT</th>
                                <th className="p-2 font-medium">Ngày kê đơn</th>
                                <th className="p-2 font-medium">Bác sĩ</th>
                                <th className="p-2 font-medium">Kết luận</th>
                                <th className="p-2 font-medium">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map((pres, idx) => (
                                <tr key={pres.id} className="border-b">
                                    <td className="p-2 text-center">
                                        {idx + 1}
                                    </td>
                                    <td className="p-2 text-center">
                                        {pres.created_at?.slice(0, 10)}
                                    </td>
                                    <td className="p-2">{pres.doctor_name}</td>
                                    <td className="p-2">{pres.conclusion}</td>
                                    <td className="p-2 text-center">
                                        <button
                                            className="text-blue-600 underline"
                                            onClick={() =>
                                                setSelectedPrescription(pres)
                                            }
                                        >
                                            Xem đơn thuốc
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedPrescription && (
                        <PrescriptionDetailModal
                            prescription={selectedPrescription}
                            onClose={() => setSelectedPrescription(null)}
                        />
                    )}
                </div>
            )}
            {tab === "labtest" && (
                <div>
                    <table className="w-full mb-4 text-sm">
                        <thead>
                            <tr className="bg-[#f7f7f9] text-gray-700">
                                <th className="p-2 font-medium">STT</th>
                                <th className="p-2 font-medium">Ngày</th>
                                <th className="p-2 font-medium">Bác sĩ LAB</th>
                                <th className="p-2 font-medium">Barcode</th>
                                <th className="p-2 font-medium">Kết quả</th>
                                <th className="p-2 font-medium">Kết luận</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labTestResults.map((lab, idx) => (
                                <tr key={lab.id} className="border-b">
                                    <td className="p-2 text-center">
                                        {idx + 1}
                                    </td>
                                    <td className="p-2 text-center">
                                        {lab.created_at?.slice(0, 10)}
                                    </td>
                                    <td className="p-2">
                                        {lab.doctor?.user?.full_name ||
                                            lab.lab_staff_name}
                                    </td>
                                    <td className="p-2">{lab.barcode}</td>
                                    <td className="p-2 whitespace-pre-line">
                                        {lab.result}
                                    </td>
                                    <td className="p-2">{lab.conclusion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {tab === "imaging" && (
                <div>
                    <table className="w-full mb-4 text-sm">
                        <thead>
                            <tr className="bg-[#f7f7f9] text-gray-700">
                                <th className="p-2 font-medium">STT</th>
                                <th className="p-2 font-medium">Ngày</th>
                                <th className="p-2 font-medium">Bác sĩ CĐHA</th>
                                <th className="p-2 font-medium">Barcode</th>
                                <th className="p-2 font-medium">Ảnh</th>
                                <th className="p-2 font-medium">Kết quả</th>
                                <th className="p-2 font-medium">Kết luận</th>
                            </tr>
                        </thead>
                        <tbody>
                            {imageResults.map((img, idx) => (
                                <tr key={img.id} className="border-b">
                                    <td className="p-2 text-center">
                                        {idx + 1}
                                    </td>
                                    <td className="p-2 text-center">
                                        {img.created_at?.slice(0, 10)}
                                    </td>
                                    <td className="p-2">
                                        {img.doctor?.user?.full_name}
                                    </td>
                                    <td className="p-2">{img.barcode}</td>
                                    <td className="p-2">
                                        {img.image_url && (
                                            <a
                                                href={img.image_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt="Ảnh CĐHA"
                                                    className="h-16 object-contain"
                                                />
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-2 whitespace-pre-line">
                                        {img.result}
                                    </td>
                                    <td className="p-2">{img.conclusion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordTabs;
