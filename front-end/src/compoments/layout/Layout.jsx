import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import LoginModal from "../modal/LoginModal";
import RegisterModal from "../modal/RegisterModal";

function Layout() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Lấy user từ localStorage khi load
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
    };

    return (
        <>
            <Nav
                onLoginClick={() => setLoginModalOpen(true)}
                onRegisterClick={() => setRegisterModalOpen(true)}
                onLogout={handleLogout}
                user={user}
            />

            <main className="container mx-auto px-6 py-8">
                <Outlet />
            </main>

            {loginModalOpen && (
                <LoginModal
                    isOpen={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    onSwitchToRegister={() => {
                        setLoginModalOpen(false);
                        setRegisterModalOpen(true);
                    }}
                />
            )}

            {registerModalOpen && (
                <RegisterModal
                    isOpen={registerModalOpen}
                    onClose={() => setRegisterModalOpen(false)}
                    onSwitchToLogin={() => {
                        setRegisterModalOpen(false);
                        setLoginModalOpen(true);
                    }}
                />
            )}


        </>
    );
}

export default Layout;
