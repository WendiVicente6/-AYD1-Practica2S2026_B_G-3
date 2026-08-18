import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Barra from "./Componentes/Barra";
import BarraAdmin from "./Componentes/BarraAdmin";
import ProtectedRoute from "./Componentes/Protectedroute";

import Dashboard from "./pages/Dashboard";
import Compartidas from "./pages/Compartidas";
import Notificaciones from "./pages/Notificaciones";
import Featured from "./pages/Featured";
import Archived from "./pages/Archived";
import MisResenas from "./pages/MisResenas";
import Solicitudes from "./pages/Solicitudes";
import AdminUser from "./pages/AdminUser";
import AdminHistorial from "./pages/AdminHistorial";
import AdminReportes from "./pages/AdminReportes";
import Registro from "./pages/Registro";

import MyProfile from "./pages/MyProfile";

function Placeholder({ title }) {
    return (
        <div
            style={{
                padding: "40px",
                color: "#ffffff"
            }}
        >
            <h1>{title}</h1>

            <p style={{ color: "#888" }}>
                Esta sección será implementada posteriormente.
            </p>
        </div>
    );
}


function UsuarioLayout({ children }) {
    return (
        <div className="app">

            <Barra />

            <main style={{ flex: 1 }}>
                {children}
            </main>

        </div>
    );
}


function App() {
    return (
        <BrowserRouter>

            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/usuario/*"
                    element={
                        <ProtectedRoute requiredRole={1}>
                            <UsuarioLayout>
                                <Dashboard />
                            </UsuarioLayout>
                            <div className="app">

                                <Barra />

                                <main style={{ flex: 1 }}>

                                    <Routes>

                                        <Route
                                            path="/"
                                            element={<Dashboard />}
                                        />

                                        <Route
                                            path="/mis-resenas"
                                            element={<MisResenas />}
                                        />

                                        <Route
                                            path="/destacadas"
                                            element={<Featured />}
                                        />

                                        <Route
                                            path="/archivadas"
                                            element={<Archived />}
                                        />

                                        <Route
                                            path="/compartidas"
                                            element={<Compartidas />}
                                        />

                                        <Route
                                            path="/notificaciones"
                                            element={<Notificaciones />}
                                        />

                                        <Route
                                            path="/perfil"
                                            element={
                                                <MyProfile />
                                            }
                                        />

                                    </Routes>

                                </main>

                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/registro"
                    element={
                        <Navigate to="/registro"
                            replace />
                    }
                />

            </Routes>

        </BrowserRouter >
    );
}


export default App;