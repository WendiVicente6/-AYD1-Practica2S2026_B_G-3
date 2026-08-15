import { useEffect, useState } from "react";
import { obtenerMisResenas, eliminarResena } from "../api/eliminar.js";
import ModalConfirmarEliminar from "../Componentes/ModalConfirmarEliminar.jsx";

export default function MisResenas() {
    const [resenias, setResenias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resenaAEliminar, setResenaAEliminar] = useState(null);

    const cargarResenias = async () => {
        try {
            setLoading(true);
            const data = await obtenerMisResenas();
            setResenias(data);
            setError("");
        } catch (err) {
            setError("Error al cargar las reseñas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarResenias();
    }, []);

    const handleEliminar = async () => {
        await eliminarResena(resenaAEliminar.cod_resena);
        setResenias((prev) =>
            prev.filter((r) => r.cod_resena !== resenaAEliminar.cod_resena)
        );
        setResenaAEliminar(null);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                Cargando...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6 md:p-8" id="mis-resenas-container">
            <div className="mb-8 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-3xl font-extrabold text-gray-900">
                    Mis reseñas
                </h2>
            </div>

            {resenias.length === 0 ? (
                <div className="w-full flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Aún no tienes reseñas
                        </h3>
                        <p className="text-gray-500">
                            Cuando agregues una reseña, aparecerá aquí.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="w-full min-w-[900px] table-auto text-center text-sm text-gray-700">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-8 py-5 text-center font-semibold">ID</th>
                                <th className="px-8 py-5 text-center font-semibold">Título</th>
                                <th className="px-8 py-5 text-center font-semibold">Calificación</th>
                                <th className="px-8 py-5 text-center font-semibold">Comentario/Opinión</th>
                                <th className="px-8 py-5 text-center font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {resenias.map((r) => (
                                <tr key={r.cod_resena} className="transition-colors hover:bg-gray-50">
                                    <td className="px-8 py-6 text-center font-medium text-gray-900">
                                        {r.cod_resena}
                                    </td>
                                    <td className="px-8 py-6 text-center text-gray-900">
                                        {r.titulo_pelicula}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="font-bold text-amber-600">
                                            {r.calificacion}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center text-gray-600">
                                        {r.comentario}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                            onClick={() => setResenaAEliminar(r)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
