import "./barra.css";
import { NavLink, useNavigate } from "react-router-dom";

function BarraAdmin() {

    const navigate = useNavigate();

    return (
        <aside className="barra">

            <p className="user-type">
                Usuario Administrador
            </p>

            <div className="logo">
                <span>CineCraft</span>
            </div>

            <nav className="navigation">

                <p className="menu-title">
                    MENÚ ADMINISTRADOR
                </p>

                {/* INICIO */}
                <NavLink
                    to="/adminuser"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-item active"
                            : "nav-item"
                    }
                    end
                >
                    <span>⌂</span>
                    Inicio
                </NavLink>


                {/* SOLICITUDES */}
                <NavLink
                    to="/adminuser/solicitudes"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-item active"
                            : "nav-item"
                    }
                >
                    <span>📋</span>
                    Solicitudes
                </NavLink>


                {/* HISTORIAL */}
                <NavLink
                    to="/adminuser/historial"
                    className={({ isActive }) =>

                        isActive
                            ? "nav-item active"
                            : "nav-item"
                    }
                >
                    <span>📜</span>
                    Historial
                </NavLink>


                {/* REPORTES */}
                <NavLink
                    to="/adminuser/reportes"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-item active"
                            : "nav-item"
                    }
                >
                    <span>📊</span>
                    Reportes
                </NavLink>

            </nav>


            <div className="barra-bottom">

                <button
                    className="logout-button"
                    onClick={async () => {

                        try {

                            await fetch(
                                "http://localhost:9000/api/auth/logout",
                                {
                                    method: "POST",
                                    credentials: "include"
                                }
                            );

                        } finally {

                            navigate("/login");

                        }

                    }}
                >
                    Cerrar sesión
                </button>

            </div>

        </aside>
    );
}

export default BarraAdmin;

/*import { NavLink } from "react-router-dom";
import "./barra.css";


import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./barra.css";

function BarraAdmin() {

    const [tipoUsuario, setTipoUsuario] = useState(true); // Cambia a false para simular un usuario normal

    return (
        <aside className="barra">

            {tipoUsuario && (
                <p className="user-type">Usuario Administrador</p>
            )}

            <div className="logo">
                <span>CineCraft</span>
            </div>
            <nav className="navigation">
                <p className="menu-title">MENÚ ADMINISTRADOR</p>
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
                    Solicitudes
                </NavLink>

                <NavLink
                    to="/admin/historial"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Historial
                </NavLink>

                <NavLink
                    to="/admin/reportes"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Reportes
                </NavLink>

            </nav>
            <div className="barra-bottom">
                <button className="logout-button">
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
export default BarraAdmin;


*/
