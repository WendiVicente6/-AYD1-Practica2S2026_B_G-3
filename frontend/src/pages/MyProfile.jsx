import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authservice";
import { obtenerPerfil, actualizarDatosPerfil } from "../api/usuario.js";
import { useNavigate } from "react-router-dom";
export default function MyProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cod_usuario: "",
        genero: "",
        nombres: "",
        apellidos: "",
        cod_rol: "",
        correo: "",
        password: ""
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const roles = {
        0: "Administrador",
        1: "Usuario",
    };

    const fetchUserData = useCallback(async () => {
        try {
            const user = await obtenerPerfil();
            if (user.data) {
                setFormData(prev => ({
                    ...prev,
                    cod_usuario: user.data.cod_usuario || user.data.id || "",
                    genero: user.data.genero || user.data.gender || "",
                    nombres: user.data.nombres || user.data.nombre || "",
                    apellidos: user.data.apellidos || user.data.apellido || "",
                    cod_rol: user.data.cod_rol || user.data.role_id || "",
                    correo: user.data.correo || user.data.email || "",
                    password: ""
                }));
            }
        } catch (err) {
            setError("No se pudo cargar la información del usuario. Inténtelo más tarde.");
            
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");
        setError("");

        try {
            const res = await actualizarDatosPerfil(formData);
            if (!res) {
                setError("Error al actualizar el perfil.");
            } else {
                setMensaje(res.message || "Perfil actualizado correctamente.");
                await fetchUserData(); // Ahora sí existe en el alcance de la función
            }
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al actualizar el perfil. Inténtelo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-100">Mi Perfil</h1>
                <p className="text-gray-400 mt-1 text-sm md:text-base">
                    Visualiza y actualiza la información de tu cuenta en CineCraft.
                </p>
            </header>

            <div className="bg-gray-800/90 border border-gray-700/80 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Código de Usuario
                        </label>
                        <input
                            type="text"
                            name="cod_usuario"
                            value={formData.cod_usuario}
                            disabled
                            className="bg-gray-900/50 border border-gray-700/60 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Género
                        </label>
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                            <option value="">Selecciona género</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Nombres
                        </label>
                        <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            placeholder="Tus nombres"
                            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Apellidos
                        </label>
                        <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            placeholder="Tus apellidos"
                            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Rol
                        </label>
                        <input
                            type="text"
                            name="cod_rol"
                            value={roles[formData.cod_rol] || "Rol no definido"}
                            disabled
                            className="bg-gray-900/50 border border-gray-700/60 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <label className="text-xs text-gray-400 mt-1">
                            Este correo será utilizado para iniciar sesión.
                        </label>
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold text-gray-300 mb-2">
                            Contraseña Nueva
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-4 pt-4 border-t border-gray-700/60">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>

                {/* Renderizado condicional exclusivo: limpia el conflicto en UI */}
                {mensaje && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-sm">
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}