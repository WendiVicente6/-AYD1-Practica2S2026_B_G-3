import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { getCurrentUser } from "../services/authservice"


function ProtectedRoute({
    children,
    requiredRole
}) {

    const [loading, setLoading] =
        useState(true);

    const [user, setUser] =
        useState(null);


    useEffect(() => {

        async function checkSession() {

            const data =
                await getCurrentUser();

            setUser(data);

            setLoading(false);
        }

        checkSession();

    }, []);


    if (loading) {

        return (
            <div className="loading-screen">
                Verificando sesión...
            </div>
        );
    }


    if (!user?.authenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (
        requiredRole !== undefined &&
        user.user.role_id !== requiredRole
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
}


export default ProtectedRoute;