import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentUserId } from "../utils/auth.js";
import { login } from "../services/authService";

import "./Login.css";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!email || !password) {

            setError(
                "Ingresa tu correo y contraseña."
            );

            return;
        }

        try {

            setLoading(true);

            const data = await login(
                email,
                password
            );


            if (data.user.role === "admin") {

                navigate("/admin");
                setCurrentUserId(data.user.id);
            } else {
                setCurrentUserId(data.user.id);
                navigate("/");
            }

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="login-page">

            <div className="login-container">

                <div className="login-logo">
                    🎬
                </div>

                <h1>
                    CineCraft
                </h1>

                <p className="login-subtitle">
                    Tu espacio cinematográfico
                </p>


                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Ingresa tu contraseña"
                            autoComplete="current-password"
                        />

                    </div>


                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"
                        }

                    </button>

                </form>


                <p className="login-register">

                    ¿No tienes una cuenta?

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/registro")
                        }
                    >
                        Solicitar registro
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;