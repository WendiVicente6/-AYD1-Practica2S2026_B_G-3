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

































/*const API_URL = "http://localhost:9000";

// Modo DEMO: no necesita Backend ni MySQL para probar la interfaz administrativa.
// Cambia a false cuando la base de datos esté disponible.
export const MODO_DEMO_ADMIN = false;

const solicitudesDemoIniciales = [
    { cod_solicitud: 1, cod_usuario: 101, nombres: "Juan", apellidos: "Pérez", correo: "juan.perez@gmail.com", fec_solicitud: "2026-08-16 08:30:00", cod_estado: 1, tipo_estado: "Pendiente", motivo_rechazo: null, fec_respuesta: null, cod_admin: null },
    { cod_solicitud: 2, cod_usuario: 102, nombres: "María", apellidos: "Gómez", correo: "maria.gomez@gmail.com", fec_solicitud: "2026-08-16 08:45:00", cod_estado: 1, tipo_estado: "Pendiente", motivo_rechazo: null, fec_respuesta: null, cod_admin: null },
    { cod_solicitud: 3, cod_usuario: 103, nombres: "Carlos", apellidos: "López", correo: "carlos.lopez@gmail.com", fec_solicitud: "2026-08-15 16:20:00", cod_estado: 1, tipo_estado: "Pendiente", motivo_rechazo: null, fec_respuesta: null, cod_admin: null }
];

const historialDemo = [
    { cod_solicitud: 10, cod_usuario: 90, usuario: "Ana Castillo", correo: "ana.castillo@gmail.com", fec_solicitud: "2026-08-12 09:00:00", cod_estado: 2, tipo_estado: "Aprobada", motivo_rechazo: null, fec_respuesta: "2026-08-12 10:15:00", cod_admin: 1, administrador: "Administrador Demo" },
    { cod_solicitud: 11, cod_usuario: 91, usuario: "Luis Ramírez", correo: "luis.ramirez@gmail.com", fec_solicitud: "2026-08-11 14:00:00", cod_estado: 3, tipo_estado: "Rechazada", motivo_rechazo: "Los datos de registro estaban incompletos.", fec_respuesta: "2026-08-11 15:30:00", cod_admin: 1, administrador: "Administrador Demo" }
];

let solicitudesDemo = [...solicitudesDemoIniciales];
let historialDemoActual = [...historialDemo];

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export async function obtenerSolicitudes() {
    if (MODO_DEMO_ADMIN) {
        await delay();
        return [...solicitudesDemo];
    }

    const res = await fetch(`${API_URL}/api/admin/solicitudes`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudieron cargar las solicitudes");
    return data;
}

export async function aprobarSolicitud(codSolicitud) {
    if (MODO_DEMO_ADMIN) {
        await delay();
        const index = solicitudesDemo.findIndex(s => s.cod_solicitud === codSolicitud);
        if (index === -1) throw new Error("La solicitud ya fue procesada.");
        const solicitud = solicitudesDemo.splice(index, 1)[0];
        historialDemoActual.unshift({ ...solicitud, cod_estado: 2, tipo_estado: "Aprobada", fec_respuesta: new Date().toLocaleString(), cod_admin: 1, administrador: "Administrador Demo", usuario: `${solicitud.nombres} ${solicitud.apellidos}` });
        return { message: "Solicitud aprobada correctamente" };
    }

    const res = await fetch(`${API_URL}/api/admin/solicitudes/${codSolicitud}/aprobar`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo aprobar la solicitud");
    return data;
}

export async function rechazarSolicitud(codSolicitud, motivo) {
    if (MODO_DEMO_ADMIN) {
        await delay();
        if (!motivo?.trim()) throw new Error("Debe indicar el motivo del rechazo");
        const index = solicitudesDemo.findIndex(s => s.cod_solicitud === codSolicitud);
        if (index === -1) throw new Error("La solicitud ya fue procesada.");
        const solicitud = solicitudesDemo.splice(index, 1)[0];
        historialDemoActual.unshift({ ...solicitud, cod_estado: 3, tipo_estado: "Rechazada", motivo_rechazo: motivo.trim(), fec_respuesta: new Date().toLocaleString(), cod_admin: 1, administrador: "Administrador Demo", usuario: `${solicitud.nombres} ${solicitud.apellidos}` });
        return { message: "Solicitud rechazada correctamente (modo demo)" };
    }

    const res = await fetch(`${API_URL}/api/admin/solicitudes/${codSolicitud}/rechazar`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo_rechazo: motivo })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo rechazar la solicitud");
    return data;
}

export async function obtenerHistorial() {
    if (MODO_DEMO_ADMIN) {
        await delay();
        return [...historialDemoActual];
    }

    const res = await fetch(`${API_URL}/api/admin/solicitudes/historial`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo cargar el historial");
    return data;
}

export function obtenerReporteDemo() {
    return {
        pendientes: solicitudesDemo.length,
        aprobadas: historialDemoActual.filter(s => s.cod_estado === 2).length,
        rechazadas: historialDemoActual.filter(s => s.cod_estado === 3).length,
        total: solicitudesDemo.length + historialDemoActual.length
    };
}





































/*const API_URL = "http://localhost:9000";

export async function obtenerSolicitudes() {
    const response = await fetch(
        `${API_URL}/api/admin/solicitudes`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.error || "No se pudieron cargar las solicitudes"
        );
    }

    return data;
}*/