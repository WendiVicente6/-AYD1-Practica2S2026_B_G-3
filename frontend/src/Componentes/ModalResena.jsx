import { useState } from "react";
import { crearResena, modificarResena } from "../api/resenas";
import { getCurrentUserId } from "../utils/auth";
import "./ModalResena.css";

// resenaExistente: si viene, es modo edición. Si es null/undefined, es modo crear.
function ModalResena({ resenaExistente, onClose, onGuardado }) {
    const esEdicion = Boolean(resenaExistente);

    const [titulo, setTitulo] = useState(resenaExistente?.titulo_pelicula || "");
    const [calificacion, setCalificacion] = useState(resenaExistente?.calificacion || 0);
    const [comentario, setComentario] = useState(resenaExistente?.comentario || "");
    const [etiquetas, setEtiquetas] = useState(resenaExistente?.etiquetas || []);
    const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    const codUsuarioActual = getCurrentUserId();

    const handleAgregarEtiqueta = () => {
        const valor = nuevaEtiqueta.trim();
        if (!valor) return;
        if (etiquetas.some((e) => e.toLowerCase() === valor.toLowerCase())) {
            setNuevaEtiqueta("");
            return;
        }
        setEtiquetas([...etiquetas, valor]);
        setNuevaEtiqueta("");
    };

    const handleQuitarEtiqueta = (etiqueta) => {
        setEtiquetas(etiquetas.filter((e) => e !== etiqueta));
    };

    const handleEtiquetaKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAgregarEtiqueta();
        }
    };

    const handleGuardar = async () => {
        if (!titulo.trim()) {
            setError("El título no puede estar vacío");
            return;
        }
        if (!comentario.trim()) {
            setError("El comentario no puede estar vacío");
            return;
        }
        if (calificacion < 1 || calificacion > 5) {
            setError("Selecciona una calificación de 1 a 5 estrellas");
            return;
        }

        setEnviando(true);
        setError("");

        const datos = {
            titulo_pelicula: titulo.trim(),
            calificacion,
            comentario: comentario.trim(),
            etiquetas
        };

        try {
            if (esEdicion) {
                await modificarResena(resenaExistente.cod_resena, datos);
            } else {
                await crearResena({ ...datos, cod_usuario: codUsuarioActual });
            }
            if (onGuardado) onGuardado();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-resena" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{esEdicion ? "Editar reseña" : "Nueva reseña"}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <label htmlFor="titulo-pelicula">Título de la película</label>
                    <input
                        id="titulo-pelicula"
                        type="text"
                        placeholder="Ej. Interestelar"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <label>Calificación</label>
                    <div className="estrellas">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                className={`estrella ${n <= calificacion ? "activa" : ""}`}
                                onClick={() => setCalificacion(n)}
                                aria-label={`${n} estrellas`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <label htmlFor="comentario">Comentario</label>
                    <textarea
                        id="comentario"
                        placeholder="¿Qué te pareció la película?"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />

                    <label htmlFor="etiqueta">Etiquetas / géneros</label>
                    <div className="etiquetas-input-wrap">
                        <input
                            id="etiqueta"
                            type="text"
                            placeholder="Ej. Ciencia ficción"
                            value={nuevaEtiqueta}
                            onChange={(e) => setNuevaEtiqueta(e.target.value)}
                            onKeyDown={handleEtiquetaKeyDown}
                        />
                        <button
                            type="button"
                            className="btn-agregar-etiqueta"
                            onClick={handleAgregarEtiqueta}
                        >
                            Agregar
                        </button>
                    </div>

                    {etiquetas.length > 0 && (
                        <div className="lista-etiquetas">
                            {etiquetas.map((etiqueta) => (
                                <span className="chip-etiqueta" key={etiqueta}>
                                    {etiqueta}
                                    <button
                                        type="button"
                                        onClick={() => handleQuitarEtiqueta(etiqueta)}
                                        aria-label={`Quitar ${etiqueta}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {error && <p className="modal-error">{error}</p>}
                </div>

                <div className="modal-footer">
                    <button className="btn-secundario" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="btn-primario"
                        onClick={handleGuardar}
                        disabled={enviando}
                    >
                        {enviando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear reseña"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalResena;