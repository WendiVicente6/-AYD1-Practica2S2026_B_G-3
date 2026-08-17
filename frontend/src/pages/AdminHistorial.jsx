import { useEffect, useState } from "react";
import { obtenerHistorial } from "../api/admin";

export default function AdminHistorial() {
    const [datos, setDatos] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => {
        obtenerHistorial()
            .then(setDatos)
            .catch((e) => setError(e.message));
    }, []);
    return (
        <section className="admin-page">
            <div className="admin-page-title">
                <div>
                    <span className="admin-kicker">ADMINISTRACIÓN</span>
                    <h1>Historial</h1>
                    <p>Solicitudes que ya fueron procesadas.</p>
                </div>
            </div>
            {error && <div className="admin-error">{error}</div>}
            <div className="admin-table-card">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo</th>
                                <th>Solicitud</th>
                                <th>Estado</th>
                                <th>Motivo</th>
                                <th>Respuesta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((s) => (
                                <tr key={s.cod_solicitud}>
                                    <td>
                                        <strong>
                                            {s.usuario || `${s.nombres || ""} ${s.apellidos || ""}`}
                                        </strong>
                                    </td>
                                    <td>{s.correo}</td>
                                    <td>#{s.cod_solicitud}</td>
                                    <td>
                                        <span
                                            className={`status ${s.cod_estado === 2 ? "approved" : "rejected"}`}
                                        >
                                            {s.tipo_estado}
                                        </span>
                                    </td>
                                    <td>{s.motivo_rechazo || "—"}</td>
                                    <td>{s.fec_respuesta || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}




















/*    import { useEffect, useState } from "react";
import { obtenerHistorial } from "../api/admin";

export default function AdminHistorial() {
    const [datos, setDatos] = useState([]); const [error, setError] = useState("");

    useEffect(() => { obtenerHistorial().then(setDatos).catch(e => setError(e.message)); }, []);
<BarraAdmin />
    return 
    
    <section className="admin-page">
        <div className="admin-page-title">
            <div>
                <span className="admin-kicker">ADMINISTRACIÓN</span>
                <h1>Historial</h1>
                <p>Solicitudes que ya fueron procesadas.</p>
                </div>
                </div>{error && <div className="admin-error">{error}</div>}
                <div className="admin-table-card"
                ><div className="admin-table-wrap">
                    <table className="admin-table"><thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Solicitud</th>
                            <th>Estado</th>
                            <th>Motivo</th>
                            <th>Respuesta</th>
                            </tr>
                            </thead>
                            <tbody>{datos.map(s => <tr key={s.cod_solicitud}><td>
                                <strong>{s.usuario || `${s.nombres || ""} ${s.apellidos || ""}`}</strong>
                                </td>
                                <td>{s.correo}</td>
                                <td>#{s.cod_solicitud}</td>
                                <td>
                                    <span className={`status ${s.cod_estado === 2 ? "approved" : "rejected"}`}>{s.tipo_estado}</span>
                                    </td>
                                    <td>{s.motivo_rechazo || "—"}</td>
                                    <td>{s.fec_respuesta || "—"}</td>
                                    </tr>)}
                                    </tbody>
                                    </table>
                                    </div>
                                    </div>
                                    </section>;
}
*/
