import { useState } from "react";

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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                    ¿Eliminar esta reseña?
                </h3>

                <p className="mb-4 text-gray-600">
                    Vas a eliminar permanentemente la reseña de{" "}
                    <span className="font-semibold text-gray-900">"{titulo}"</span>.
                    Esta acción no se puede deshacer.
                </p>

                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-3">
                    <button
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={eliminando}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
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
