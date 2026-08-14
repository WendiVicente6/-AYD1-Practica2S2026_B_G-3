import React, { useEffect, useRef, useState } from "react";
import { obtenerResenias, destacarResenia } from "../api/destacar.js";

export default function Featured() {

    const [resenia, setResenia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const fetchingRef = useRef(false);

    const cargarResenias = async (showLoader = false) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        try {
            if (showLoader) setLoading(true);
            const resenias = await obtenerResenias();
            setResenia(resenias);
            setError("");
        } catch (error) {
            setError("Error al cargar las reseñas");
        } finally {
            if (showLoader) setLoading(false);
            fetchingRef.current = false;
        }
    };

    const handleToggleDestacada = async (codResena, checked) => {
        const nuevoValor = checked ? "S" : "N";

        setResenia((prev) =>
            prev.map((item) =>
                item.cod_resena === codResena
                    ? { ...item, destacada: nuevoValor }
                    : item
            )
        );

        try {
            await destacarResenia(codResena, checked ? 1 : 0);
            setError("");
        } catch (error) {
            setResenia((prev) =>
                prev.map((item) =>
                    item.cod_resena === codResena
                        ? { ...item, destacada: checked ? "N" : "S" }
                        : item
                )
            );
            setError("No se pudo actualizar la reseña destacada. Intente nuevamente.");
        }
    };

    useEffect(() => {
        cargarResenias(true);

        const intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                cargarResenias(false);
            }
        }, 30000);

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                cargarResenias(false);
            }
        };

        document.addEventListener("visibilitychange", onVisible);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    if (loading) return <div className="w-full min-h-screen flex items-center justify-center">Cargando...</div>;
    if (error) return <div className="w-full min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    if(resenia.length === 0) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-200 mb-4">No hay Reseñas Destacadas</h2>
                    <p className="text-blue-400">Aún no has destacado ninguna reseña. ¡Destaca tus favoritas para verlas aquí!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6 md:p-8" id="featured-container">
            {/* ENCABEZADO */}
            <div
                className="mb-8 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                id="header-featured"
            >
                <h2 className="mb-2 text-3xl font-extrabold text-gray-900">
                    Mis Reseñas destacadas
                </h2>

            </div>

            {/* TABLA */}
            <div
                className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm"
                id="featured-table"
            >

                <table
                    className="w-full min-w-[900px] table-auto text-center text-sm text-gray-700"
                    id="featured-table-content"
                >

                    {/* ENCABEZADO DE TABLA */}
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-8 py-5 text-center font-semibold">ID</th>
                            <th className="px-8 py-5 text-center font-semibold">Título</th>
                            <th className="px-8 py-5 text-center font-semibold">Calificación</th>
                            <th className="px-8 py-5 text-center font-semibold">Comentario/Opinión</th>
                            <th className="px-8 py-5 text-center font-semibold" style={{ display: "none" }}>Destacar</th>
                        </tr>
                    </thead>


                    {/* CUERPO TABLA*/}
                    <tbody className="divide-y divide-gray-200 bg-white">

                        {resenia.map((r) => (

                            <tr
                                key={r.cod_resena}
                                className="transition-colors hover:bg-gray-50"
                            >
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

                                <td className="px-8 py-6 text-center" style={{ display: "none" }}>
                                    <div className="flex justify-center">
                                        <input
                                            type="checkbox"
                                            checked={(r.destacada || "").toUpperCase() === "S"}
                                            onChange={(e) =>
                                                handleToggleDestacada(r.cod_resena, e.target.checked)
                                            }
                                            className="h-5 w-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}