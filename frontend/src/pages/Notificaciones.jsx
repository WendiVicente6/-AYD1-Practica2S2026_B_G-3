import { useEffect, useState } from "react";
import { obtenerCompartidasConmigo } from "../api/compartir";
import { getCurrentUserId } from "../utils/auth";
import "./compartidas.css";

function Notificaciones() {
    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const codUsuario = getCurrentUserId();

    useEffect(() => {
        const cargar = async () => {
            setCargando(true);
            setError("");
            try {
                const data = await obtenerCompartidasConmigo(codUsuario);
                setResenas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="welcome-text">Compartido conmigo</p>
                    <h1>Notificaciones</h1>
                </div>
            </header>

            {cargando && <p className="estado-info">Cargando...</p>}
            {error && <p className="estado-error">{error}</p>}

            {!cargando && !error && resenas.length === 0 && (
                <p className="estado-info">
                    Nadie ha compartido reseñas contigo todavía.
                </p>
            )}

            <div className="lista-compartidas">
                {resenas.map((r) => (
                    <div className="compartida-card" key={r.cod_compartida}>
                        <div className="compartida-header">
                            <span className="badge-compartida">Compartida</span>
                            <h3>{r.titulo_pelicula}</h3>
                        </div>
                        <p className="compartida-propietario">
                            Por {r.propietario_nombres} {r.propietario_apellidos}
                        </p>
                        <div className="compartida-estrellas">
                            {"★".repeat(r.calificacion)}
                            {"☆".repeat(5 - r.calificacion)}
                        </div>
                        <p className="compartida-comentario">{r.comentario}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notificaciones;
