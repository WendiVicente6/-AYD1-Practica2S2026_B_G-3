//import { NavLink } from "react-router-dom";
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
                    to="/destacadas"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    Historial
                </NavLink>

                <NavLink
                    to="/archivadas"
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


