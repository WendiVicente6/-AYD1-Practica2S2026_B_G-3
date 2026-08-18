import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

const API_URL = "http://localhost:9000/api";

export default function Registro() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombres: "",
        apellidos: "",
        genero: "",
        correo: "",
        password: "",
        confirmar_password: ""
    });

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMensaje("");

        if (
            formulario.password !==
            formulario.confirmar_password
        ) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {

            setCargando(true);

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formulario)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "No se pudo completar el registro."
                );
            }

            setMensaje(
                data.message ||
                "Solicitud enviada correctamente."
            );

            setFormulario({
                nombres: "",
                apellidos: "",
                genero: "",
                correo: "",
                password: "",
                confirmar_password: ""
            });

        } catch (error) {

            console.error("ERROR REGISTRO:", error);

            setError(error.message);

        } finally {

            setCargando(false);

        }
    };

    return (
        <div className="registro-page">

            <div className="registro-card">

                <h1>Crear cuenta</h1>

                <p className="registro-subtitulo">
                    Regístrate en CineCraft
                </p>

                {error && (
                    <div className="registro-error">
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div className="registro-success">
                        {mensaje}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="campo">
                        <label>Nombres</label>

                        <input
                            type="text"
                            name="nombres"
                            value={formulario.nombres}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Apellidos</label>

                        <input
                            type="text"
                            name="apellidos"
                            value={formulario.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Género</label>

                        <select
                            name="genero"
                            value={formulario.genero}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Selecciona una opción
                            </option>

                            <option value="M">
                                Masculino
                            </option>

                            <option value="F">
                                Femenino
                            </option>
                        </select>
                    </div>

                    <div className="campo">
                        <label>Correo electrónico</label>

                        <input
                            type="email"
                            name="correo"
                            value={formulario.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Contraseña</label>

                        <input
                            type="password"
                            name="password"
                            value={formulario.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Confirmar contraseña</label>

                        <input
                            type="password"
                            name="confirmar_password"
                            value={formulario.confirmar_password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                    >
                        {cargando
                            ? "Enviando..."
                            : "Registrarme"}
                    </button>

                </form>

                <button
                    type="button"
                    className="volver-login"
                    onClick={() => navigate("/login")}
                >
                    Ya tengo una cuenta
                </button>

            </div>

        </div>
    );
}