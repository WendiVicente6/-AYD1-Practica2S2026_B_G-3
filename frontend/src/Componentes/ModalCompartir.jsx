import { useState, useEffect, useRef } from "react";
import { buscarUsuarios, compartirResena } from "../api/compartir";
import { getCurrentUserId } from "../utils/auth";
import "./modalCompartir.css";

// - codResena: id de la reseña que se va a compartir
// - onClose: función para cerrar el modal
// - onCompartido: callback opcional cuando se comparte con éxito
function ModalCompartir({ codResena, onClose, onCompartido }) {
    const [termino, setTermino] = useState("");
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [seleccionado, setSeleccionado] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const debounceRef = useRef(null);

    const codUsuarioActual = getCurrentUserId();

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (termino.trim().length < 2) {
            setResultados([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setBuscando(true);
            setError("");
            try {
                const usuarios = await buscarUsuarios(termino.trim(), codUsuarioActual);
                setResultados(usuarios);
            } catch (err) {
                setError("No se pudo buscar usuarios. Intenta de nuevo.");
            } finally {
                setBuscando(false);
            }
        }, 350);

        return () => clearTimeout(debounceRef.current);
    }, [termino, codUsuarioActual]);

    const handleSeleccionar = (usuario) => {
        setSeleccionado(usuario);
        setResultados([]);
        setTermino(`${usuario.nombres} ${usuario.apellidos}`);
    };

    const handleCompartir = async () => {
        if (!seleccionado) {
            setError("Selecciona un usuario de la lista antes de compartir");
            return;
        }

        setEnviando(true);
        setError("");
        try {
            await compartirResena(codResena, codUsuarioActual, seleccionado.cod_usuario);
            setExito(`Reseña compartida con ${seleccionado.nombres} ${seleccionado.apellidos}`);
            if (onCompartido) {
                onCompartido(seleccionado);
            }
            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-compartir" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Compartir reseña</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <label htmlFor="buscar-usuario">Buscar usuario</label>
                    <input
                        id="buscar-usuario"
                        type="text"
                        placeholder="Nombre, apellido o correo..."
                        value={termino}
                        onChange={(e) => {
                            setTermino(e.target.value);
                            setSeleccionado(null);
                            setExito("");
                        }}
                        autoComplete="off"
                    />

                    {buscando && <p className="modal-hint">Buscando...</p>}

                    {resultados.length > 0 && (
                        <ul className="lista-usuarios">
                            {resultados.map((u) => (
                                <li
                                    key={u.cod_usuario}
                                    onClick={() => handleSeleccionar(u)}
                                >
                                    <span className="usuario-nombre">
                                        {u.nombres} {u.apellidos}
                                    </span>
                                    <span className="usuario-correo">{u.correo}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {termino.trim().length >= 2 &&
                        !buscando &&
                        resultados.length === 0 &&
                        !seleccionado && (
                            <p className="modal-hint">No se encontraron usuarios.</p>
                        )}

                    {error && <p className="modal-error">{error}</p>}
                    {exito && <p className="modal-exito">{exito}</p>}
                </div>

                <div className="modal-footer">
                    <button className="btn-secundario" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="btn-primario"
                        onClick={handleCompartir}
                        disabled={!seleccionado || enviando}
                    >
                        {enviando ? "Compartiendo..." : "Compartir"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalCompartir;
