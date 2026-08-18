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

                {/* =====================================
                    LOGIN
                ====================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =====================================
                    DASHBOARD USUARIO
                ====================================== */}

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


                {/* =====================================
                    MIS RESEÑAS
                ====================================== */}

                <Route
                    path="/mis-resenas"
                    element={
                        //<ProtectedRoute requiredRole={1}>
                        <UsuarioLayout>
                            <MisResenas />
                        </UsuarioLayout>
                        //</ProtectedRoute>
                    }
                />


                {/* =====================================
                    DESTACADAS
                ====================================== */}

                <Route
                    path="/destacadas/*"
                    element={
                        <ProtectedRoute requiredRole={1}>
                            <UsuarioLayout>
                                <Featured />
                            </UsuarioLayout>
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    ARCHIVADAS
                ====================================== */}

                <Route
                    path="/archivadas/*"
                    element={
                        //<ProtectedRoute requiredRole={1}>
                        <UsuarioLayout>
                            <Archived />
                        </UsuarioLayout>
                        //</ProtectedRoute>
                    }
                />


                {/* =====================================
                    COMPARTIDAS
                ====================================== */}

                <Route
                    path="/compartidas"
                    element={
                        //<ProtectedRoute requiredRole={1}>
                        <UsuarioLayout>
                            <Compartidas />
                        </UsuarioLayout>
                        //</ProtectedRoute>
                    }
                />


                {/* =====================================
                    NOTIFICACIONES
                ====================================== */}

                <Route
                    path="/notificaciones/*"
                    element={
                        <ProtectedRoute requiredRole={1}>
                            <UsuarioLayout>
                                <Notificaciones />
                            </UsuarioLayout>
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    PERFIL
                ====================================== */}

                <Route
                    path="/perfil/*"
                    element={
                        //<ProtectedRoute requiredRole={1}>
                        <UsuarioLayout>
                            <Placeholder title="Mi perfil" />
                        </UsuarioLayout>
                        //</ProtectedRoute>
                    }
                />


                {/* =====================================
                    RUTA PRINCIPAL
                ====================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* =====================================
                    SOLICITUDES ADMINISTRADOR
                ====================================== */}


                <Route
                    path="/admin/Solicitudes"
                    element={<Solicitudes />}
                />

                {/* =====================================
                    ADMINISTRADOR - MODO DEMO
                    No requiere Backend ni MySQL.
                ====================================== */}
                <Route
                    path="/adminuser/*"
                    element={
                        <ProtectedRoute requiredRole={0}>
                            <AdminUser />
                        </ProtectedRoute>
                    }


                />


                {/* =====================================
                    USUARIO NORMAL
                ====================================== */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute requiredRole={0}>
                            <AdminUser />
                        </ProtectedRoute>
                    }


                />

                {/* =====================================
                    HISTORIAL ADMINISTRADOR
                ====================================== */}
                <Route
                    path="/adminuser/historial"
                    element={
                        <ProtectedRoute requiredRole={0}>
                            <AdminHistorial />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    REPORTES ADMINISTRADOR
                ====================================== */}


                <Route
                    path="/adminuser/reportes"
                    element={
                        <ProtectedRoute requiredRole={0}>
                            <AdminReportes />
                        </ProtectedRoute>
                    }
                />


                {/* =====================================
                    REGISTRO DE USUARIO
                ====================================== */}

                <Route
                    path="/registro"
                    element={
                        <Registro />
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