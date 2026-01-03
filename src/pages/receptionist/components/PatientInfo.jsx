export const PatientInfo = ({ label, value, isTeal = false }) => (
    <div>
        <p className="text-sm font-semibold text-black-900 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-medium mt-1 text-gray-600" >
            {value ?? "Không có"}
        </p>
    </div>
);
