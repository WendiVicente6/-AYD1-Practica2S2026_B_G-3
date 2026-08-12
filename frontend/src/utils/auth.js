// este helper lo cree temporalmente mientras se hace el modulo de login o autenticación porque no esta integrado xd
// era para probar todo y ver que funcionara la cosa de compartir reseña el que haga lo del login que reemplace esta función
// para que lea el cod_usuario real de la sesión osea el token y eso va

const DEV_USER_ID_KEY = "cinecraft_cod_usuario";

export function getCurrentUserId() {
    const stored = localStorage.getItem(DEV_USER_ID_KEY);
    if (stored) {
        return Number(stored);
    }
    return 1;
}

export function setCurrentUserId(codUsuario) {
    localStorage.setItem(DEV_USER_ID_KEY, String(codUsuario));
}
