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