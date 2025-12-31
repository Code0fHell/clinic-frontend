import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AppRouter from "./routes/AppRouter";
import HomePage from "./pages/HomePage";
import DoctorDashBoardPage from "./pages/doctor/DoctorDashBoardPage";
import MakeAppointmentPage from "./pages/appointment/MakeAppointmentPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentPage";
import DoctorVisitPage from "./pages/doctor/DoctorVisitPage";
import DoctorPrescriptionListPage from "./pages/doctor/DoctorPrescriptionListPage";
import DoctorPrescriptionViewPage from "./pages/doctor/DoctorPrescriptionViewPage";
import DoctorPrescriptionEditPage from "./pages/doctor/DoctorPrescriptionEditPage";
import ReceptionistDashboard from "./pages/receptionist/Dashboard";
import AppointmentPage from "./pages/receptionist/Appointment";
import PatientPage from "./pages/receptionist/Patient";
import InvoicePage from "./pages/receptionist/Invoice";
import VisitPage from "./pages/receptionist/Visit";
import PharmacistDashboard from "./pages/pharmacist/Dashboard";
import PharmacistMedicines from "./pages/pharmacist/Medicines";
import PharmacistSchedule from "./pages/pharmacist/Schedule";
import PharmacistPrescriptions from "./pages/pharmacist/Prescriptions";
import PrivateRoute from "./routes/PrivateRoute";
import AccountInfoPage from "./pages/profile/AccountInfoPage";
import MedicalRecordsPage from "./pages/profile/MedicalRecordsPage";
import ServicePage from "./pages/services/ServicePage";
import MedicinePage from "./pages/medicine/MedicinePage";
import DoctorsPage from "./pages/doctors/DoctorsPage";
import AppointmentListPage from "./pages/appointment/AppointmentListPage";

import LabDoctorDashBoardPage from './pages/doctor/lab/LabDoctorDashBoardPage';
import LabIndicationListPage from './pages/doctor/lab/LabIndicationListPage';
import LabTestResultPage from './pages/doctor/lab/LabTestResultPage';
import LabCompletedResultsPage from './pages/doctor/lab/LabCompletedResultsPage';

import DiagnosticDoctorDashBoardPage from './pages/doctor/diagnostic/DiagnosticDoctorDashBoardPage';
import DiagnosticIndicationListPage from './pages/doctor/diagnostic/DiagnosticIndicationListPage';
import DiagnosticImageResultPage from './pages/doctor/diagnostic/DiagnosticImageResultPage';
import DiagnosticCompletedResultsPage from './pages/doctor/diagnostic/DiagnosticCompletedResultsPage';

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManageScheduleStaff from "./pages/owner/ManageScheduleStaff";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/patient/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/patient/booking"
                        element={<MakeAppointmentPage />}
                    />
                    <Route path="/profile/account" element={<AccountInfoPage />} />
                    <Route path="/profile/medical-records" element={<MedicalRecordsPage />} />
                    <Route path="/profile" element={<AccountInfoPage />} />
                    <Route path="/services" element={<ServicePage />} />
                    <Route path="/medicines" element={<MedicinePage />} />
                    <Route path="/doctors" element={<DoctorsPage />} />
                    <Route
                        path="/patient/appointments"
                        element={<AppointmentListPage />}
                    />
                    <Route
                        path="/doctor/dashboard"
                        element={<DoctorDashBoardPage />}
                    />
                    <Route
                        path="/doctor/appointment"
                        element={<DoctorAppointmentsPage />}
                    />
                    <Route path="/doctor/visit" element={<DoctorVisitPage />} />
                    <Route
                        path="/doctor/prescription"
                        element={<DoctorPrescriptionListPage />}
                    />
                    <Route
                        path="/doctor/prescription/:id"
                        element={<DoctorPrescriptionViewPage />}
                    />
                    <Route
                        path="/doctor/prescription/:id/edit"
                        element={<DoctorPrescriptionEditPage />}
                    />

                    {/* Protected routes */}
                    <Route element={<PrivateRoute />}>
                        {/* lab doctor routes */}
                        <Route path='/lab/dashboard' element={<LabDoctorDashBoardPage />} />
                        <Route path='/lab/indications' element={<LabIndicationListPage />} />
                        <Route path='/lab/indication/:id/result' element={<LabTestResultPage />} />
                        <Route path='/lab/completed-results' element={<LabCompletedResultsPage />} />

                        {/* diagnostic doctor routes */}
                        <Route path='/diagnostic/dashboard' element={<DiagnosticDoctorDashBoardPage />} />
                        <Route path='/diagnostic/indications' element={<DiagnosticIndicationListPage />} />
                        <Route path='/diagnostic/indication/:id/result' element={<DiagnosticImageResultPage />} />
                        <Route path='/diagnostic/completed-results' element={<DiagnosticCompletedResultsPage />} />

                        {/* Receptionist routes */}
                        <Route
                            path="/receptionist/home"
                            element={<ReceptionistDashboard />}
                        />
                        <Route
                            path="/receptionist/appointment"
                            element={<AppointmentPage />}
                        />
                        <Route
                            path="/receptionist/visit"
                            element={<VisitPage />}
                        />
                        <Route
                            path="/receptionist/patient"
                            element={<PatientPage />}
                        />
                        <Route
                            path="/receptionist/invoice"
                            element={<InvoicePage />}
                        />

                        {/* Pharmacist routes */}
                        <Route
                            path="/pharmacist/home"
                            element={<PharmacistDashboard />}
                        />
                        <Route
                            path="/pharmacist/prescriptions"
                            element={<PharmacistPrescriptions />}
                        />
                        <Route
                            path="/pharmacist/medicines"
                            element={<PharmacistMedicines />}
                        />
                        <Route
                            path="/pharmacist/schedule"
                            element={<PharmacistSchedule />}
                        />

                        {/* Owner routes */}
                        <Route
                            path="/owner/dashboard"
                            element={<OwnerDashboard />}
                        />

                        <Route
                            path="/owner/manage-schedule-staff"
                            element={<ManageScheduleStaff />}
                        />
                    </Route>

                    {/* Main app routes */}
                    <Route path="/*" element={<AppRouter />} />
                    {/* Redirect unknown routes */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
