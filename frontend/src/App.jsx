import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import Barra from "./Componentes/Barra";
import BarraAdmin from "./Componentes/BarraAdmin";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";


function Placeholder({ title, onClick }) {
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

            {onClick && (
                <button
                    onClick={onClick}
                    style={{
                        padding: "10px 20px",
                        marginTop: "20px",
                        cursor: "pointer"
                    }}
                >
                    Cerrar Sesión
                </button>
            )}


        </div>
    );
}


function CerrarSesion() {
    localStorage.clear();
    window.location.href = "/login";
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


function AdminLayout({ children }) {
    return (
        <div className="app">

            <BarraAdmin />

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

                {/* ================= LOGIN ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />


                {/* ================= USUARIO ================= */}

                <Route
                    path="/usuario"
                    element={
                        <UsuarioLayout>
                            <Dashboard />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/mis-resenas"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Mis reseñas" />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/destacadas"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Reseñas destacadas" />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/archivadas"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Reseñas archivadas" />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/compartidas"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Reseñas compartidas" />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/notificaciones"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Notificaciones" />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Mi perfil" />
                        </UsuarioLayout>
                    }
                />

                <Route
                    path="/CerrarSesion"
                    element={
                        <UsuarioLayout>
                            <Placeholder title="Cerrar Sesión" 
                             onClick={CerrarSesion}
                            />
                        </UsuarioLayout>
        
        }

        
    
/>  
            


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    }
                />



                <Route
                    path="/Solicitudes"
                    element={
                        <AdminLayout>
                            <Placeholder title="Solicitudes" />
                        </AdminLayout>
                    }
                />

                <Route
                    path="/Historial"
                    element={
                        <AdminLayout>
                            <Placeholder title="Historial" />
                        </AdminLayout>
                    }
                />

                <Route
                    path="/reportes"
                    element={
                        <AdminLayout>
                            <Placeholder title="Reportes" />
                        </AdminLayout>
                    }
                />

                <Route
                    path="/CerrarSesion"
                    element={
                        <AdminLayout>
                            <Placeholder title="Cerrar Sesión" 
                             onClick={CerrarSesion}
                            />
                        </AdminLayout>
        
        }

        
    
/>  







            </Routes>

        </BrowserRouter>
    );
}


export default App;



