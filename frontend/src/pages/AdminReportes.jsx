import { obtenerReporteDemo, obtenerSolicitudes, obtenerHistorial } from "../api/admin";


import { useEffect, useState } from "react";

export default function AdminReportes() {
    const [r, setR] = useState({ pendientes: 0, aprobadas: 0, rechazadas: 0, total: 0 });
    useEffect(() => {
        Promise.all([obtenerSolicitudes(),
        obtenerHistorial()]).then(([p, h]) => setR({
            pendientes: p.length, aprobadas: h.filter(x => x.cod_estado === 2).length,
            rechazadas: h.filter(x => x.cod_estado === 3).length, total: p.length + h.length
        })).catch(() => setR(obtenerReporteDemo()));
    }
        , []);
    return <section className="admin-page">
        <div className="admin-page-title"><div>
            <span className="admin-kicker">ADMINISTRACIÓN</span>
            <h1>Reportes</h1>
            <p>Resumen de solicitudes de registro.</p>
        </div>
        </div>
        <div className="report-grid">
            <div className="report-card"><span>Pendientes</span>
                <strong>{r.pendientes}</strong>
            </div>
            <div className="report-card">
                <span>Aprobadas</span>
                <strong>{r.aprobadas}</strong>
            </div>
            <div className="report-card"><span>Rechazadas</span>
                <strong>{r.rechazadas}</strong>
            </div>
            <div className="report-card"><span>Total procesadas/pendientes</span>
                <strong>{r.total}</strong>
            </div>
        </div>
    </section>;
}