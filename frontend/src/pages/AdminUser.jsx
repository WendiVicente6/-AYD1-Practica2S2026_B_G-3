import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import Solicitudes from "./Solicitudes";
import AdminHistorial from "./AdminHistorial";
import AdminReportes from "./AdminReportes";
import BarraAdmin from "../Componentes/BarraAdmin";

import "../AdminUser.css";

export default function AdminUser() {
    return (

        <div className="admin-layout">



            <main className="admin-main">

                <BarraAdmin />

                <Routes>
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="solicitudes"
                        element={<Solicitudes />}
                    />

                    <Route
                        path="historial"
                        element={<AdminHistorial />}
                    />

                    <Route
                        path="reportes"
                        element={<AdminReportes />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/adminuser"
                                replace
                            />
                        }
                    />
                </Routes>


            </main>

        </div>
    );
}
























/*import {
    NavLink,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Solicitudes from "./Solicitudes";
import AdminHistorial from "./AdminHistorial";
import AdminReportes from "./AdminReportes";
import BarraAdmin from "../Componentes/BarraAdmin";
import "../Adminuser.css";

export default function AdminUser() {
    return (

        <><div className="admin-layout" />
        
                <BarraAdmin /></>

    const navigate = useNavigate();
    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    Cine<span>Craft</span>
                </div>
                <nav>
                    <NavLink end to="/admin">
                        ⌂ <span>Inicio</span>
                    </NavLink>
                    <NavLink to="/admin/solicitudes">
                        👥 <span>Solicitudes</span>
                    </NavLink>
                    <NavLink to="/admin/historial">
                        🗂 <span>Historial</span>
                    </NavLink>
                    <NavLink to="/admin/reportes">
                        📊 <span>Reportes</span>
                    </NavLink>
                </nav>
                <button className="admin-logout" onClick={() => navigate("/login")}>
                    Cerrar sesión
                </button>
            </aside>
            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <strong>Panel de administración</strong>
                        <small>Entorno de pruebas independiente</small>
                    </div>
                    <div className="admin-avatar">A</div>
                </header>
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="solicitudes" element={<Solicitudes />} />
                    <Route path="historial" element={<AdminHistorial />} />
                    <Route path="reportes" element={<AdminReportes />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </main>
        </div>
    );
}
*/