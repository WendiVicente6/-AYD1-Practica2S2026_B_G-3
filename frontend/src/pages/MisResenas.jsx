import { useState, useEffect } from "react";
import { obtenerMisResenas } from "../api/resenas";
import { getCurrentUserId } from "../utils/auth";
import ModalResena from "../Componentes/ModalResena";
import "./MisResenas.css";

function MisResenas() {
    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [resenaEditar, setResenaEditar] = useState(null);

    const codUsuario = getCurrentUserId();

    const cargarResenas = async () => {
        setCargando(true);
        setError("");
        try {
            const data = await obtenerMisResenas(codUsuario);
            setResenas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarResenas();
    }, []);

    const handleNuevaResena = () => {
        setResenaEditar(null);
        setModalAbierto(true);
    };

    const handleEditar = (resena) => {
        setResenaEditar(resena);
        setModalAbierto(true);
    };

    const handleGuardado = () => {
        cargarResenas();
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <p className="welcome-text">Gestiona tus opiniones</p>
                    <h1>Mis reseñas</h1>
                </div>
                <button className="btn-primario" onClick={handleNuevaResena}>
                    + Nueva reseña
                </button>
            </div>

            {cargando && <p className="modal-hint">Cargando tus reseñas...</p>}
            {error && <p className="modal-error">{error}</p>}

            {!cargando && resenas.length === 0 && !error && (
                <p className="modal-hint">Todavía no tienes reseñas. ¡Crea la primera!</p>
            )}

            <div className="lista-resenas">
                {resenas.map((r) => (
                    <div className="tarjeta-resena" key={r.cod_resena}>
                        <div className="tarjeta-resena-header">
                            <h3>{r.titulo_pelicula}</h3>
                            <span className="estrellas-readonly">
                                {"★".repeat(r.calificacion)}
                                {"☆".repeat(5 - r.calificacion)}
                            </span>
                        </div>
                        <p className="tarjeta-comentario">{r.comentario}</p>
                        {r.etiquetas?.length > 0 && (
                            <div className="lista-etiquetas">
                                {r.etiquetas.map((e) => (
                                    <span className="chip-etiqueta" key={e}>{e}</span>
                                ))}
                            </div>
                        )}
                        <button
                            className="btn-secundario"
                            onClick={() => handleEditar(r)}
                        >
                            Editar
                        </button>
                    </div>
                ))}
            </div>

            {modalAbierto && (
                <ModalResena
                    resenaExistente={resenaEditar}
                    onClose={() => setModalAbierto(false)}
                    onGuardado={handleGuardado}
                />
            )}
        </div>
    );
}

export default MisResenas;