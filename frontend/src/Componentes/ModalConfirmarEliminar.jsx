import { useState } from "react";
import "./modalConfirmarEliminar.css";

// - titulo: titulo de la pelicula de la reseña a eliminar
// - onClose: función para cerrar el modal sin eliminar
// - onConfirmar: función async que ejecuta la eliminación real
function ModalConfirmarEliminar({ titulo, onClose, onConfirmar }) {
    const [eliminando, setEliminando] = useState(false);
    const [error, setError] = useState("");

    const handleConfirmar = async () => {
        setEliminando(true);
        setError("");
        try {
            await onConfirmar();
        } catch (err) {
            setError(err.message || "No se pudo eliminar la reseña. Intenta de nuevo.");
            setEliminando(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-eliminar" onClick={(e) => e.stopPropagation()}>
                <h3>¿Eliminar esta reseña?</h3>

                <p>
                    Vas a eliminar permanentemente la reseña de{" "}
                    <strong>"{titulo}"</strong>. Esta acción no se puede deshacer.
                </p>

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-eliminar-footer">
                    <button
                        className="btn-secundario"
                        onClick={onClose}
                        disabled={eliminando}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn-peligro"
                        onClick={handleConfirmar}
                        disabled={eliminando}
                    >
                        {eliminando ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmarEliminar;
