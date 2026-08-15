import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Barra from "./Componentes/Barra";
import ProtectedRoute from "./Componentes/Protectedroute";

import Dashboard from "./pages/Dashboard";
import Compartidas from "./pages/Compartidas";
import Notificaciones from "./pages/Notificaciones";
import Featured from "./pages/Featured";
import Archived from "./pages/Archived";
import MisResenas from "./pages/MisResenas";


// Página temporal
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


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =====================================
                    LOGIN
                ====================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================
                    USUARIO
                ====================================== */}

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute requiredRole={1}>
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
                                            element={
                                                <Placeholder
                                                    title="Mis reseñas"
                                                />
                                            }
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
                                                <Placeholder
                                                    title="Mi perfil"
                                                />
                                            }
                                        />

                                    </Routes>

                                </main>

                            </div>
                        </ProtectedRoute>
                    }
                />


                


                {/* =====================================
                    CUALQUIER RUTA DESCONOCIDA
                ====================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;