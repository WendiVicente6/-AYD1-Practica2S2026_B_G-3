import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Barra from "./Componentes/Barra";

import Dashboard from "./pages/Dashboard";
import Compartidas from "./pages/Compartidas";
import Notificaciones from "./pages/Notificaciones";


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
                                <Placeholder title="Mis reseñas" />
                            }
                        />

                        <Route
                            path="/destacadas"
                            element={
                                <Placeholder title="Reseñas destacadas" />
                            }
                        />

                        <Route
                            path="/archivadas"
                            element={
                                <Placeholder title="Reseñas archivadas" />
                            }
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
                                <Placeholder title="Mi perfil" />
                            }
                        />

                    </Routes>

                </main>

            </div>

        </BrowserRouter>
    );
}

export default App;