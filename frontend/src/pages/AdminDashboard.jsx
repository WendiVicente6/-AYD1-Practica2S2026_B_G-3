function AdminDashboard() {

    return (
        <div className="admindashboard">
            <header className="dashboard-header">
                <div>
                    <p className="welcome-text">

                        Bienvenido de nuevo
                    </p>
                    <h1>
                        Recuerda revisar las solicitudes pendientes
                    </h1>
                </div>
                <div className="user-info">
                    <div className="avatar">
                        ADMIN
                    </div>
                </div>
            </header>
            <section className="dashboard-content">
                <div className="welcome-card">
                    <div>
                        <span className="card-icon">
                            <img src="/viendo-una-pelicula.png" 
                                 alt="pelicula"   
                                 style={{ width: '100px', height: '100px' }}  
                            />
                        </span>
                        <h2>
                            Tu espacio administrativo
                        </h2>
                        <p>
                            Administra la creación de usuarios del sistema CineCraft
                            revisa las solicitudes pendientes y genera reportes de las solicitudes.
                        </p>
                    </div>
                </div>
                <div className="section-header">
                    <h2>
                        Accesos rápidos
                    </h2>
                </div>
                <div className="quick-actions">
                    +
                    <div className="quick-card">
                        <img src="/usuarios.png" 
                                 alt="Aprobación de usuarios"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                        <h3>Aprobación de usuarios</h3>
                        <p>
                            Aprueba o rechaza las solicitudes de usuario.
                        </p>
                    </div>
                    <div className="quick-card">
                        <img src="/historial.png" 
                                 alt="historial"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                        <h3>Historial</h3>
                        <p>
                            Muestra el historial de las solicitudes.
                        </p>
                    </div>
                    <div className="quick-card">
                       <img src="/archivado.png" 
                                 alt="reportes"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                        <h3>Reportes</h3>
                        <p>
                            Genera reportes de las solicitudes.
                        </p>
                    </div>
                  
                </div>
            </section>
            
        </div>
    );
}
export default AdminDashboard;


































//import BarraAdmin from "../Componentes/BarraAdmin";
//import HeaderAdmin from "../Componentes/HeaderAdmin";
/*
function AdminDashboard() {
    return (
        <div className="admin-layout">

            

            <main className="admin-main">

                <HeaderAdmin />

                <section className="admin-content">

                    <h2>Resumen</h2>

                    <div className="admin-cards">

                        <div className="admin-card">
                            <span>Solicitudes pendientes</span>
                            <strong>4</strong>
                        </div>

                        <div className="admin-card">
                            <span>Usuarios registrados</span>
                            <strong>120</strong>
                        </div>

                        <div className="admin-card">
                            <span>Total de reseñas</span>
                            <strong>500</strong>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;*/
