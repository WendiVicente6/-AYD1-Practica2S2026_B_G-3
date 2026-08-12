import React from "react";


export default function Featured() {


    const usuariosPrueba = [
        { id: 1, titulo: "Reseña 1", calificacion: 5, comentario: "Excelente producto", genero: "Acción" },
        { id: 2, titulo: "Reseña 2", calificacion: 4, comentario: "Buen producto", genero: "Aventura" },
        { id: 3, titulo: "Reseña 3", calificacion: 3, comentario: "Producto regular", genero: "RPG" },
    ];

    return (
        <div
            className="w-full min-h-screen bg-gray-50 p-6 md:p-8"
            id="featured-container"
        >

            {/* ENCABEZADO */}
            <div
                className="mb-8 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                id="header-featured"
            >
                <h2 className="mb-2 text-3xl font-extrabold text-gray-900">
                    Reseñas destacadas
                </h2>

                <p className="text-lg text-gray-600">
                    Marque o desmarque las reseñas para destacarlas.
                </p>
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
                            <th className="px-8 py-5 text-center font-semibold">Género</th>
                            <th className="px-8 py-5 text-center font-semibold">Destacar</th>
                        </tr>
                    </thead>


                    {/* CUERPO TABLA*/}
                    <tbody className="divide-y divide-gray-200 bg-white">

                        {usuariosPrueba.map((usuario) => (

                            <tr
                                key={usuario.id}
                                className="transition-colors hover:bg-gray-50"
                            >
                                <td className="px-8 py-6 text-center font-medium text-gray-900">
                                    {usuario.id}
                                </td>

                                <td className="px-8 py-6 text-center text-gray-900">
                                    {usuario.titulo}
                                </td>

                                <td className="px-8 py-6 text-center">
                                    <span className="font-bold text-amber-600">
                                        {usuario.calificacion}
                                    </span>
                                </td>

                                <td className="px-8 py-6 text-center text-gray-600">
                                    {usuario.comentario}
                                </td>

                                <td className="px-8 py-6 text-center">
                                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                                        {usuario.genero}
                                    </span>
                                </td>

                                <td className="px-8 py-6 text-center">
                                    <div className="flex justify-center">
                                        <input
                                            type="checkbox"
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