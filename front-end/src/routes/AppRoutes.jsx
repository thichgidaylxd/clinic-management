import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Components
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Layout from "../components/layout/Layout";

// Protected Components
import ProtectedRoute from "../components/ProtectedRoute";

// Patient Pages
import MyAppointments from "../pages/MyAppointments";
import AppointmentDetail from "../pages/patient/AppointmentDetail";

// Admin Pages
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSpecialties from "../pages/admin/Specialties";
import AdminServices from "../pages/admin/Services";
import AdminDoctors from "../pages/admin/Doctors";
import AdminSchedules from "../pages/admin/Schedules";
import AdminMedicines from "../pages/admin/Medicines";
import AdminRooms from "../pages/admin/Rooms";
import AdminUsers from "../pages/admin/Users";

// Receptionist Pages
import ReceptionistLayout from "../pages/receptionist/ReceptionistLayout";
import ReceptionistAppointments from "../pages/receptionist/Appointments";
import ReceptionistPatients from "../pages/receptionist/Patients";
import ReceptionistWalkIn from "../pages/receptionist/WalkIn";
import ReceptionistQueue from "../pages/receptionist/Queue";
import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";

// Doctor Pages
import DoctorLayout from "../pages/doctor/DoctorLayout";
// import DoctorDashboard from "../pages/doctor/DoctorDashboard";
// import DoctorSchedule from "../pages/doctor/Schedule";
// import DoctorExamination from "../pages/doctor/Examination";

// ⭐ NEW: Prescription & Medical Records Pages


// Other
import BookingV2 from "../pages/BookingV2";
import PrescriptionPage from "../pages/doctor/PrescriptionPages";
import InvoiceViewPage from "../pages/doctor/InvoiceViewPage";
import MedicalRecordDetail from "../components/medicine/MedicalRecordDetail";
import MedicalRecords from "../components/medicine/Medicalrecords";
import ReceptionistInvoices from "../pages/receptionist/ReceptionistInvoices";
import Examination from "../components/examination/Examination";

function AppRoutes() {
    return (
        <Routes>
            {/* =================== PUBLIC ROUTES =================== */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="booking" element={<BookingV2 />} />
            </Route>

            {/* =================== PATIENT ROUTES =================== */}
            <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['Bệnh nhân']}>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/patient/appointments" replace />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="appointments/:id" element={<AppointmentDetail />} />
            </Route>

            {/* =================== ADMIN ROUTES =================== */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="specialties" element={<AdminSpecialties />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="schedules" element={<AdminSchedules />} />
                <Route path="medicines" element={<AdminMedicines />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* =================== RECEPTIONIST ROUTES =================== */}
            <Route path="/receptionist" element={
                <ProtectedRoute allowedRoles={['Lễ tân']}>
                    <ReceptionistLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
                <Route path="dashboard" element={<ReceptionistDashboard />} />
                <Route path="appointments" element={<ReceptionistAppointments />} />
                <Route path="patients" element={<ReceptionistPatients />} />
                <Route path="walk-in" element={<ReceptionistWalkIn />} />
                <Route path="queue" element={<ReceptionistQueue />} />
                <Route path="invoices" element={<ReceptionistInvoices />} />
            </Route>

            {/* =================== DOCTOR ROUTES =================== */}
            <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['Bác sĩ']}>
                    <DoctorLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/doctor/examination" replace />} />
                {/* <Route path="dashboard" element={<DoctorDashboard />} /> */}
                {/* <Route path="schedule" element={<DoctorSchedule />} /> */}
                <Route path="examination" element={<Examination />} />

                {/* ⭐ NEW: Prescription routes */}
                <Route path="prescription/:appointmentId" element={<PrescriptionPage />} />

                {/* ⭐ NEW: Medical Records routes */}
                <Route path="medical-records" element={<MedicalRecords />} />
                <Route path="medical-records/:recordId" element={<MedicalRecordDetail />} />
            </Route>

            {/* =================== SHARED ROUTES (Multi-role) =================== */}
            {/* ⭐ NEW: Invoice route - Accessible by Doctor, Receptionist, Admin */}
            <Route path="/invoices/:invoiceId" element={
                <ProtectedRoute allowedRoles={['Bác sĩ', 'Lễ tân', 'Admin']}>
                    <InvoiceViewPage />
                </ProtectedRoute>
            } />

            {/* =================== 404 NOT FOUND =================== */}
            <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Trang không tồn tại</p>
                        <a
                            href="/"
                            className="px-6 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition"
                        >
                            Về trang chủ
                        </a>
                    </div>
                </div>
            } />
        </Routes>
    );
}

export default AppRoutes;