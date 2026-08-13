from flask import Flask, jsonify
from flask_cors import CORS
from routes.routes import resenas_bp

app = Flask(__name__)

CORS(app)
app.register_blueprint(resenas_bp)


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