export const PatientInfo = ({ label, value, isTeal = false }) => (
    <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-semibold mt-1 text-gray-900" >
            {value ?? "Không có"}
        </p>
    </div>
);
