from flask import Flask, jsonify
from flask_cors import CORS
from routes.routes import resenas_bp
from routes.autenticacion import auth_bp
#from routes.perfi import user_bp
from routes.admin import admin_bp
from routes.perfi import user_bp
import os

app = Flask(__name__)

# 1. Clave secreta para firmar las cookies de sesión
app.secret_key = os.getenv("SECRET_KEY", "clave-temporal")

# 2. Configuración estricta de cookies para desarrollo local cruzado
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",  # 'Lax' es el estándar moderno seguro para localhost entre puertos
    SESSION_COOKIE_SECURE=False,   # Falso porque no estás usando HTTPS en tu computadora

)
# 3. Configuración avanzada de CORS para admitir credenciales y cabeceras de sesión
CORS(
    app,
    supports_credentials=True,

    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    expose_headers=["Set-Cookie"],   # Obliga al navegador a aceptar la cookie del servidor
    allow_headers=["Content-Type"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
   
)

app.register_blueprint(resenas_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)



app.register_blueprint(user_bp)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "message": "CineCraft API funcionando"
    })


@app.route("/api/user", methods=["GET"])
def get_user():
    return jsonify({
        "id": 1,
        "name": "Usuario Demo",
        "email": "usuario@cinecraft.com"
    })



if __name__ == "__main__":


    app.run(
        debug=True,
        port=9000
    )