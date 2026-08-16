import {API_URL} from "./compartir.js";

export async function obtenerPerfil() {
    const res = await fetch(`${API_URL}/usuario/perfil`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
}


export async function actualizarDatosPerfil(datos){
    const res = fetch(`${API_URL}/usuario/perfil/actualizar`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    return res;
}