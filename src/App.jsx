import React from "react";
// Import useLocation hook to check the current route
import {Routes, Route, useLocation} from "react-router-dom"; 
import LoginPage from "./features/auth/pages/LoginPage";
import VendorPage from "./features/vendor/pages/VendorPage";
import ProjectPage from "./features/project/pages/ProjectPage";
import ProtectedRoute from "./core/components/ProtectedRoute";
import PMPage from "./features/pm/pages/PMPage";
import Navbar from "./core/components/NavBar";
import UserPage from "./features/user/pages/UserPage";
import PMDetailPage from "./features/pm/pages/PMDetailPage";
import UnitPage from "./features/unit/pages/UnitPage";

export default function App () {
    const location = useLocation();
    // Check if the current route is the login page or the root path
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';

    return (
        <div>
            {/* 1. Conditionally render the Navbar. It is hidden on the login page. */}
            {!isLoginPage && <Navbar />} 
            
            {/* 2. Use a conditional class for the layout wrapper (optional, but good practice) */}
            <div className={isLoginPage ? "Auth-Layout" : "App-Layout"}> 
                <Routes>
                    {/* Routes that DON'T need the Navbar (Login/Root) */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* VENDOR LIST */}
                    <Route
                        path="/vendor"
                        element={
                            <ProtectedRoute>
                                <VendorPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROJECT LIST BY VENDOR */}
                    <Route
                        path="/vendor/:vendorId"
                        element={
                            <ProtectedRoute>
                                <ProjectPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROJECT MAINTENANCE */}
                    <Route
                        path="/vendor/:vendorId/project/:projectId"
                        element={
                            <ProtectedRoute>
                                <PMPage />
                            </ProtectedRoute>
                        }
                    />

                     {/* PROJECT MAINTENANCE */}
                    <Route
                        path="/vendor/:vendorId/project/:projectId/pm/:pmId"
                        element={
                            <ProtectedRoute>
                                <PMDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* USER LIST */}
                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute>
                                <UserPage />
                            </ProtectedRoute>
                        }
                    />

                    
                    {/* UNIT LIST */}
                    <Route
                        path="/unit"
                        element={
                            <ProtectedRoute>
                                <UnitPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </div>
        </div>
    );
}