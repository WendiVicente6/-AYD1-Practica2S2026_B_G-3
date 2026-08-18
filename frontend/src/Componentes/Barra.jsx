import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./barra.css";
import { useState } from "react";
import { logout } from "../services/authservice"
import { useNavigate } from "react-router-dom";
import { setCurrentUserId } from "../utils/auth.js";

function Barra() {

    const [tipoUsuario, setTipoUsuario] = useState(true); // Cambia a false para simular un usuario normal
    const navigate = useNavigate();
    const [logOutError, setLogoutError] = useState("");
    const [mensajeLogout, setMensajeLogout] = useState("");

    const handleLogout = async () => {
        try {
            await logout();
            setMensajeLogout("Cerrando Sesión...");

            // Damos 1 segundo para que el usuario pueda ver el mensaje en pantalla antes de redirigir
            setTimeout(() => {
                navigate("/login");
                setCurrentUserId(null);
            }, 2000);
        } catch (err) {
            setLogoutError("Error al cerrar sesión.");
        }
    };

    return (
        <aside className="barra">

            {tipoUsuario && (
                <p className="user-type">Usuario</p>
            )}

            <div className="logo">
                <span>CineCraft</span>
            </div>
            <nav className="navigation">
                <p className="menu-title">MENÚ PRINCIPAL</p>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <span>⌂</span>
                    Inicio
                </NavLink>
                <NavLink
                    to="/mis-resenas"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Mis reseñas
                </NavLink>

                <NavLink
                    to="/destacadas"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Destacadas
                </NavLink>

                <NavLink
                    to="/archivadas"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Archivadas
                </NavLink>
                <NavLink
                    to="/compartidas"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Compartidas
                </NavLink>
                <p className="menu-title secondary-title">
                    CUENTA
                </p>
                <NavLink
                    to="/notificaciones"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Notificaciones
                </NavLink>
                <NavLink
                    to="/perfil"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Mi perfil
                </NavLink>
            </nav>

            <div className="barra-bottom">
                <button
                    className="logout-button"
                    id="logout-button"
                    name="logout-button"
                    type="button"
                    onClick={handleLogout}>
                    Cerrar Sesión
                </button>
                {logOutError && <p className="text-sm text-green-600 mt-2 text-center">{logOutError}</p>}
                {mensajeLogout && <p className="text-sm text-red-600 mt-2 text-center">{mensajeLogout}</p>}
            </div>
        </aside>
    );
}
export default Barra;