import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import MyAppointments from "../pages/MyAppointments";
import Layout from "../compoments/layout/Layout";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="booking" element={<Booking />} />
                <Route path="appointments" element={<MyAppointments />} />

                {/* 404 */}
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
            </Route>
        </Routes>
    );
}

export default AppRoutes;