import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AppRouter from './routes/AppRouter';
import HomePage from './pages/HomePage';
import DoctorDashBoardPage from './pages/doctor/DoctorDashBoardPage'
import MakeAppointmentPage from './pages/appointment/MakeAppointmentPage';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentPage';
import DoctorVisitPage from './pages/doctor/DoctorVisitPage';
import DoctorPrescriptionListPage from './pages/doctor/DoctorPrescriptionListPage';
import DoctorPrescriptionViewPage from './pages/doctor/DoctorPrescriptionViewPage';
import DoctorPrescriptionEditPage from './pages/doctor/DoctorPrescriptionEditPage';
import ReceptionistDashboard from './pages/receptionist/Dashboard';
import AppointmentPage from './pages/receptionist/Appointment';
import PatientPage from './pages/receptionist/Patient';
import InvoicePage from './pages/receptionist/Invoice';
import TaskPage from './pages/receptionist/Task';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/patient/home' element={<HomePage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient/booking" element={<MakeAppointmentPage/>} />
          <Route path='/doctor/dashboard' element={<DoctorDashBoardPage/>}/>
          <Route path='/doctor/appointment' element={<DoctorAppointmentsPage/>}/>
          <Route path='/doctor/visit' element={<DoctorVisitPage/>}/>
          <Route path='/doctor/prescription' element={<DoctorPrescriptionListPage/>}/>
          <Route path='/doctor/prescription/:id' element={<DoctorPrescriptionViewPage/>}/>
          <Route path='/doctor/prescription/:id/edit' element={<DoctorPrescriptionEditPage/>}/>

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/receptionist/home" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/appointment" element={<AppointmentPage />} />
            <Route path="/receptionist/patient" element={<PatientPage />} />
            <Route path="/receptionist/invoice" element={<InvoicePage />} />
            <Route path="/receptionist/task" element={<TaskPage />} />
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