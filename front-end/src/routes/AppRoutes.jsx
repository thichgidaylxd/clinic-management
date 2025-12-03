import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../compoments/layout/Layout";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
