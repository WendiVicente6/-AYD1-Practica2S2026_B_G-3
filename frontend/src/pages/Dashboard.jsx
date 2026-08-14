import { Link } from "react-router-dom";

function Dashboard() {

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="welcome-text">
                        Bienvenido de nuevo
                    </p>
                    <h1>
                        Explora tus reseñas
                    </h1>
                </div>
                <div className="user-info">
                    <div className="notification">
                        NOTI
                    </div>
                    <div className="avatar">
                        USU
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
                            Tu espacio cinematográfico
                        </h2>
                        <p>
                            Administra tus reseñas de películas,
                            descubre tus favoritas y comparte
                            tus opiniones con otros usuarios.
                        </p>
                    </div>
                </div>
                <div className="section-header">
                    <h2>
                        Accesos rápidos
                    </h2>
                </div>
                <div className="quick-actions">
                    <div className="quick-card">
                        <img src="/resenas.png" 
                                 alt="Reseña"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                        <h3>Mis reseñas</h3>
                        <p>
                            Consulta y administra tus reseñas.
                        </p>
                    </div>
                    <div className="quick-card">
                        <img src="/mensaje-destacado.png" 
                                 alt="destacado"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                        <h3>Destacadas</h3>
                        <p>
                            Encuentra tus reseñas favoritas.
                        </p>
                    </div>

                    <Link to="/archivadas" className="quick-card-link">
                        <div className="quick-card">
                            <img src="/archivado.png" 
                                 alt="archivado"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                            <h3>Archivadas</h3>
                            <p>
                                Consulta tus reseñas archivadas.
                            </p>
                        </div>
                    </Link>

                    <div className="quick-card">
                        <img src="/compartir.png" 
                                 alt="compartir"   
                                 style={{ width: '50px', height: '50px' }}  
                            />
                        <h3>Compartidas</h3>
                        <p>
                            Revisa las reseñas compartidas.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default Dashboard;