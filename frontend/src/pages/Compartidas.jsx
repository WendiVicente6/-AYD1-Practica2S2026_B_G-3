import { useEffect, useState } from "react";
import { obtenerMisCompartidas, dejarDeCompartir } from "../api/compartir";
import { getCurrentUserId } from "../utils/auth";
import "./compartidas.css";

function Compartidas() {
    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const codUsuario = getCurrentUserId();

    const cargar = async () => {
        setCargando(true);
        setError("");
        try {
            const data = await obtenerMisCompartidas(codUsuario);
            setResenas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleDejarDeCompartir = async (codResena, codUsuarioDestino) => {
        try {
            await dejarDeCompartir(codResena, codUsuarioDestino);
            cargar();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="welcome-text">Tus reseñas compartidas</p>
                    <h1>Compartidas</h1>
                </div>
            </header>

            {cargando && <p className="estado-info">Cargando...</p>}
            {error && <p className="estado-error">{error}</p>}

            {!cargando && !error && resenas.length === 0 && (
                <p className="estado-info">
                    Todavía no has compartido ninguna reseña con otros usuarios.
                </p>
            )}

            <div className="lista-compartidas">
                {resenas.map((r) => (
                    <div className="compartida-card" key={r.cod_resena}>
                        <div className="compartida-header">
                            <h3>{r.titulo_pelicula}</h3>
                        </div>
                        <p className="compartida-subtitulo">
                            Compartida con {r.destinatarios.length}{" "}
                            {r.destinatarios.length === 1 ? "persona" : "personas"}
                        </p>
                        <ul className="destinatarios-lista">
                            {r.destinatarios.map((d) => (
                                <li key={d.cod_usuario}>
                                    <span>{d.nombre_completo}</span>
                                    <button
                                        className="btn-quitar"
                                        onClick={() =>
                                            handleDejarDeCompartir(
                                                r.cod_resena,
                                                d.cod_usuario
                                            )
                                        }
                                    >
                                        Dejar de compartir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Compartidas;
