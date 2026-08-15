import {API_URL} from "./compartir.js";
import {getCurrentUserId} from "../utils/auth.js";

export async function ObtenerArchivadas() {
    const cod_usuario = getCurrentUserId();
    let res = await fetch(`${API_URL}/api/resenas/archivadas/${cod_usuario}`);
    let data = await res.json();
    if(!res.ok){
        throw new Error(data.error || "No se pudieron cargar las reseñas archivadas");
    }
    return data;
}

export async function ArchivarResena(codResena, check) {
    const cod_usuario = getCurrentUserId();
    let res = await fetch(`${API_URL}/api/resenas/archivar/${cod_usuario}/${codResena}/${check}`,
    {method: 'POST'}
    );
    let data = await res.json();
    if(!res.ok){
        throw new Error(data.error || "No se pudo archivar la reseña");
    }
    return data;
}