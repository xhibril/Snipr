import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AuthGate({ isAuth }) {
    const location = useLocation();
    const path = location.pathname;

    const isAuthPage = path === "/login" || path === "/signup" || path === "/verify/email"; 

    const isProtectedRoute = path === "/dashboard";

    

    if (isAuth === null) return null;

    if (isAuth === false && isProtectedRoute) {
        return <Navigate to="/login" replace />
    }


    if (isAuth === true && isAuthPage) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}