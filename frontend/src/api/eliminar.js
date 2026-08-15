import { API_URL } from "./compartir.js";
import { getCurrentUserId } from "../utils/auth.js";

export async function obtenerMisResenas() {
    const cod_usuario = getCurrentUserId();
    const res = await fetch(`${API_URL}/api/resenas/mias/${cod_usuario}`);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "No se pudieron cargar las reseñas");
    }
    return data;
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
