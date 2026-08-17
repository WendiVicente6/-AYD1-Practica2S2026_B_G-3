import { useState, useEffect } from "react";
import { obtenerMisResenas, eliminarResena } from "../api/resenas";
import { ArchivarResena } from "../api/archivar";
import { destacarResenia } from "../api/destacar";
import { getCurrentUserId } from "../utils/auth";
import ModalResena from "../Componentes/ModalResena";
import ModalConfirmarEliminar from "../Componentes/ModalConfirmarEliminar";
import "./MisResenas.css";

function MisResenas() {
    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [resenaEditar, setResenaEditar] = useState(null);
    const [resenaAEliminar, setResenaAEliminar] = useState(null);

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

    const handleEliminar = async () => {
        await eliminarResena(resenaAEliminar.cod_resena);
        setResenas((prev) =>
            prev.filter((r) => r.cod_resena !== resenaAEliminar.cod_resena)
        );
        setResenaAEliminar(null);
    };

    const handleToggleArchivada = async (resena) => {
        const nuevoValor = resena.archivada === "S" ? "N" : "S";
        setResenas((prev) =>
            prev.map((r) =>
                r.cod_resena === resena.cod_resena ? { ...r, archivada: nuevoValor } : r
            )
        );
        try {
            await ArchivarResena(resena.cod_resena, nuevoValor === "S" ? 1 : 0);
        } catch (err) {
            setResenas((prev) =>
                prev.map((r) =>
                    r.cod_resena === resena.cod_resena ? { ...r, archivada: resena.archivada } : r
                )
            );
            setError(err.message);
        }
    };

    const handleToggleDestacada = async (resena) => {
        const nuevoValor = resena.destacada === "S" ? "N" : "S";
        setResenas((prev) =>
            prev.map((r) =>
                r.cod_resena === resena.cod_resena ? { ...r, destacada: nuevoValor } : r
            )
        );
        try {
            await destacarResenia(resena.cod_resena, nuevoValor === "S" ? 1 : 0);
        } catch (err) {
            setResenas((prev) =>
                prev.map((r) =>
                    r.cod_resena === resena.cod_resena ? { ...r, destacada: resena.destacada } : r
                )
            );
            setError(err.message);
        }
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
                        <div className="tarjeta-resena-acciones">
                            <button
                                className="btn-secundario"
                                onClick={() => handleEditar(r)}
                            >
                                Editar
                            </button>
                            <button
                                className={`btn-secundario${r.destacada === "S" ? " activo-destacar" : ""}`}
                                onClick={() => handleToggleDestacada(r)}
                            >
                                {r.destacada === "S" ? "★ Destacada" : "☆ Destacar"}
                            </button>
                            <button
                                className={`btn-secundario${r.archivada === "S" ? " activo-archivar" : ""}`}
                                onClick={() => handleToggleArchivada(r)}
                            >
                                {r.archivada === "S" ? "Desarchivar" : "Archivar"}
                            </button>
                            <button
                                className="btn-eliminar-resena"
                                onClick={() => setResenaAEliminar(r)}
                            >
                                Eliminar
                            </button>
                        </div>
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

            {resenaAEliminar && (
                <ModalConfirmarEliminar
                    titulo={resenaAEliminar.titulo_pelicula}
                    onClose={() => setResenaAEliminar(null)}
                    onConfirmar={handleEliminar}
                />
            )}
        </div>
    );
}

export default MisResenas;
