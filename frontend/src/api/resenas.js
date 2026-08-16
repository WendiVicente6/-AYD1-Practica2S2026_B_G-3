const API_URL = "http://localhost:5000";

export async function crearResena(datos) {
    const res = await fetch(`${API_URL}/api/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "No se pudo crear la reseña");
    }
    return data;
}

export async function modificarResena(codResena, datos) {
    const res = await fetch(`${API_URL}/api/resenas/${codResena}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "No se pudo modificar la reseña");
    }
    return data;
}

export async function obtenerMisResenas(codUsuario) {
    const res = await fetch(`${API_URL}/api/resenas/usuario/${codUsuario}`);
    if (!res.ok) {
        throw new Error("No se pudieron cargar tus reseñas");
    }
    return res.json();
}

export async function eliminarResena(codResena) {
    const res = await fetch(`${API_URL}/api/resenas/${codResena}`, {
        method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar la reseña");
    }
    return data;
}