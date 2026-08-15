import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = (e) => {
    e.preventDefault();

    // Por ahora simulamos el inicio de sesión
    if (usuario === "admin" && password === "1234") {
      navigate("/admin");
    } else if (usuario === "usuario" && password === "1234") {
      navigate("/usuario");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>CineCraft</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={iniciarSesion}>

          <div>
            <label>Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
          </div>

          <button type="submit">
            Iniciar sesión
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;