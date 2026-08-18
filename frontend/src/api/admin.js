const API_URL = "http://localhost:9000";

// false = utilizar el Backend y la base de datos real
export const MODO_DEMO_ADMIN = false;

// Administrador de prueba actual de la base de datos
const COD_ADMIN = 1;


// ==================================================
// OBTENER SOLICITUDES PENDIENTES
// ==================================================

export async function obtenerSolicitudes() {

    if (MODO_DEMO_ADMIN) {
        return [];
    }

    const res = await fetch(
        `${API_URL}/api/admin/solicitudes`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.error || "No se pudieron cargar las solicitudes"
        );
    }

    return data;
}


// ==================================================
// APROBAR SOLICITUD
// ==================================================

export async function aprobarSolicitud(codSolicitud) {

    if (MODO_DEMO_ADMIN) {
        return {
            message: "Solicitud aprobada correctamente"
        };
    }

    const res = await fetch(
        `${API_URL}/api/admin/solicitudes/${codSolicitud}/aprobar`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cod_admin: COD_ADMIN
            })
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.error || "No se pudo aprobar la solicitud"
        );
    }

    return data;
}


// ==================================================
// RECHAZAR SOLICITUD
// ==================================================

export async function rechazarSolicitud(codSolicitud, motivo) {

    if (!motivo || !motivo.trim()) {
        throw new Error(
            "Debe indicar el motivo del rechazo"
        );
    }

    if (MODO_DEMO_ADMIN) {
        return {
            message: "Solicitud rechazada correctamente"
        };
    }

    const res = await fetch(
        `${API_URL}/api/admin/solicitudes/${codSolicitud}/rechazar`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cod_admin: COD_ADMIN,
                motivo_rechazo: motivo.trim()
            })
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.error || "No se pudo rechazar la solicitud"
        );
    }

    return data;
}


// ==================================================
// OBTENER HISTORIAL
// ==================================================

export async function obtenerHistorial() {

    if (MODO_DEMO_ADMIN) {
        return [];
    }

    const res = await fetch(
        `${API_URL}/api/admin/solicitudes/historial`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            data.error || "No se pudo cargar el historial"
        );
    }

    return data;
}


// ==================================================
// REPORTE
// ==================================================

export function obtenerReporteDemo() {
    return null;
}




























