import {API_URL} from "./compartir.js";
import {getCurrentUserId} from "../utils/auth.js";


let cod_usuario = getCurrentUserId();

export async function obtenerResenias(){
    let res = await fetch(`${API_URL}/resenas/obtener/usuario/${cod_usuario}`);
    let data = await res.json();
    if(!res.ok){
        throw new Error(data.error || "No se pudieron cargar las reseñas");
    }
    return data;

}

export async function destacarResenia(codResena, check){
    let res = await fetch(`${API_URL}/resenas/destacar/${cod_usuario}/${codResena}/${check}`,
    {method: 'POST'}
    );
    let data = await res.json();
    if(!res.ok){
        throw new Error(data.error || "No se pudo destacar la reseña");
    }
    return data;
}