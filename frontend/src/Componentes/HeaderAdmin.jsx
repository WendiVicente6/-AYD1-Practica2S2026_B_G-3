import BarraAdmin from "./BarraAdmin";




function AdminHeader() {
    return (
        <header className="admin-header">

            <div className="admin-header-info">
                <h1>Panel de administración</h1>
                <p>
                    Gestiona las solicitudes y la información de CineCraft.
                </p>
            </div>

            <div className="admin-header-user">
                <div className="admin-avatar">
                    A
                </div>

                <div className="admin-user-info">
                    <span className="admin-user-name">
                        Administrador
                    </span>

                    <span className="admin-user-role">
                        Administrador
                    </span>
                </div>
            </div>

        </header>
    );
}

export default AdminHeader;




