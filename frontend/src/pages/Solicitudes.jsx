import { useEffect, useState } from "react";
import { aprobarSolicitud, obtenerSolicitudes, rechazarSolicitud } from "../api/admin";


function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [procesando, setProcesando] = useState(null);
    const [rechazo, setRechazo] = useState(null);
    const [motivo, setMotivo] = useState("");

    async function cargarSolicitudes() {


        try {
            setCargando(true);
            setError("");
            setSolicitudes(await obtenerSolicitudes());
        } catch (err) { setError(err.message); }
        finally { setCargando(false); }
    }

    useEffect(() => { cargarSolicitudes(); }, []);

    async function aceptar(id) {
        if (!window.confirm("¿Deseas aprobar esta solicitud?")) return;
        try {
            setProcesando(id); setMensaje("");
            const data = await aprobarSolicitud(id);
            setMensaje(data.message);
            await cargarSolicitudes();
        } catch (err) { setError(err.message); }
        finally { setProcesando(null); }
    }

    async function confirmarRechazo() {
        if (!rechazo) return;
        try {
            setProcesando(rechazo.cod_solicitud); setError("");
            const data = await rechazarSolicitud(rechazo.cod_solicitud, motivo);
            setMensaje(data.message);
            setRechazo(null); setMotivo("");
            await cargarSolicitudes();
        } catch (err) { setError(err.message); }
        finally { setProcesando(null); }
    }

    if (cargando) return <section className="admin-page"><h1>Solicitudes de registro</h1><p>Cargando solicitudes...</p></section>;

    return (
        <section className="admin-page">
            <div className="admin-page-title">
                <div><span className="admin-kicker">ADMINISTRACIÓN</span><h1>Solicitudes de registro</h1><p>Aprueba o rechaza las solicitudes pendientes.</p></div>
                <button className="admin-secondary-btn" onClick={cargarSolicitudes}>Actualizar</button>
            </div>
            {mensaje && <div className="admin-success">{mensaje}</div>}
            {error && <div className="admin-error">{error}</div>}
            <div className="admin-table-card">
                {solicitudes.length === 0 ? <div className="admin-empty"><h2>Todo al día</h2><p>No hay solicitudes pendientes.</p></div> : (
                    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nombre</th><th>Correo</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>{solicitudes.map(s => <tr key={s.cod_solicitud}><td><strong>{s.nombres} {s.apellidos}</strong><small>Solicitud #{s.cod_solicitud}</small></td><td>{s.correo}</td><td>{s.fec_solicitud}</td><td><span className="status pending">{s.tipo_estado}</span></td><td><div className="admin-actions"><button disabled={procesando === s.cod_solicitud} className="approve-btn" onClick={() => aceptar(s.cod_solicitud)}>Aceptar</button><button disabled={procesando === s.cod_solicitud} className="reject-btn" onClick={() => { setRechazo(s); setMotivo(""); }}>Rechazar</button></div></td></tr>)}</tbody></table></div>
                )}
            </div>
            {rechazo && <div className="admin-modal-backdrop"><div className="admin-modal"><h2>Rechazar solicitud</h2><p>Indica el motivo para <strong>{rechazo.nombres} {rechazo.apellidos}</strong>.</p><textarea value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Motivo del rechazo..." rows="5" /><div className="admin-modal-actions"><button className="admin-secondary-btn" onClick={() => setRechazo(null)}>Cancelar</button><button className="reject-btn" onClick={confirmarRechazo}>Confirmar rechazo</button></div></div></div>}
        </section>
    );
}
export default Solicitudes;















/*function Solicitudes() {
    return (
        <div>
            <h1>Solicitudes de registro</h1>
            <p>La página funciona correctamente.</p>
        </div>
    );
}

export default Solicitudes;




import { useEffect, useState } from "react";
import { obtenerSolicitudes } from "../api/admin";


function Solicitudes() {

    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    async function cargarSolicitudes() {
        try {
            setCargando(true);
            setError("");

            const data = await obtenerSolicitudes();

            setSolicitudes(data);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    if (cargando) {
        return <p>Cargando solicitudes...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Solicitudes de registro</h1>

            {solicitudes.length === 0 ? (
                <p>No hay solicitudes pendientes.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Fecha de solicitud</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {solicitudes.map((solicitud) => (
                            <tr key={solicitud.cod_solicitud}>

                                <td>
                                    {solicitud.nombres}{" "}
                                    {solicitud.apellidos}
                                </td>

                                <td>
                                    {solicitud.correo}
                                </td>

                                <td>
                                    {solicitud.fec_solicitud}
                                </td>

                                <td>
                                    {solicitud.tipo_estado}
                                </td>

                                <td>
                                    <button>
                                        Aceptar
                                    </button>

                                    <button>
                                        Rechazar
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Solicitudes;*/
