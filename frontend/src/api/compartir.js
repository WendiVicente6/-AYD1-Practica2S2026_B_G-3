export const API_URL = "http://localhost:9000";

export async function buscarUsuarios(termino, codUsuarioActual) {
    const params = new URLSearchParams({
        q: termino,
        cod_usuario_actual: codUsuarioActual
    });
    const res = await fetch(`${API_URL}/api/usuarios/buscar?${params}`);
    if (!res.ok) {
        throw new Error("No se pudo buscar usuarios");
    }
    return res.json();
}

export async function compartirResena(codResena, codUsuarioOrigen, codUsuarioDestino) {
    const res = await fetch(`${API_URL}/api/resenas/${codResena}/compartir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cod_usuario_origen: codUsuarioOrigen,
            cod_usuario_destino: codUsuarioDestino
        })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "No se pudo compartir la reseña");
    }
    return data;
}

export async function dejarDeCompartir(codResena, codUsuarioDestino) {
    const res = await fetch(
        `${API_URL}/api/resenas/${codResena}/compartir/${codUsuarioDestino}`,
        { method: "DELETE" }
    );
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "No se pudo dejar de compartir");
    }
    return data;
}

export async function obtenerCompartidasConmigo(codUsuario) {
    const res = await fetch(`${API_URL}/api/compartidas-conmigo/${codUsuario}`);
    if (!res.ok) {
        throw new Error("No se pudieron cargar las reseñas compartidas contigo");
    }
    return res.json();
}

export async function obtenerMisCompartidas(codUsuario) {
    const res = await fetch(`${API_URL}/api/mis-compartidas/${codUsuario}`);
    if (!res.ok) {
        throw new Error("No se pudieron cargar tus reseñas compartidas");
    }
    return res.json();
}
