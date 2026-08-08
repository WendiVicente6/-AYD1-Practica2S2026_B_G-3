import { NavLink } from "react-router-dom";
import "./barra.css";

function Barra() {
    return (
        <aside className="barra">

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
                <button className="logout-button">
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
export default Barra;