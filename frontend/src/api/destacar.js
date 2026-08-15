import {API_URL} from "./compartir.js";

localStorage.setItem('cod_usuario', '4'); // Simulación de usuario logueado

let cod_usuario = localStorage.getItem('cod_usuario');

export async function obtenerResenias(){
    let res = await fetch(`${API_URL}/api/resenas/obtener/usuario/${cod_usuario}`);
    let data = await res.json();
    if(!res.ok){
        throw new Error(data.error || "No se pudieron cargar las reseñas");
    }
    return data;

}

export async function destacarResenia(codResena, check){
    let res = await fetch(`${API_URL}/api/resenas/destacar/${cod_usuario}/${codResena}/${check}`,
    {method: 'POST'}
    );
    let data = await res.json();
    if(!res.ok){
        throw new Error(data.error || "No se pudo destacar la reseña");
    }
    return data;
}