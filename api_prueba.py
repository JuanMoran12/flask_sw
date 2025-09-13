from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({'message': '¡Bienvenido a mi API!'})

@app.route('/usuarios/<int:user_id>')
def get_user(user_id):
    usuarios = {
        1: {'nombre': 'Juan', 'apellido': 'Pérez'},
        2: {'nombre': 'María', 'apellido': 'García'}
    }
    
    usuario = usuarios.get(user_id)
    if usuario:
        return jsonify(usuario)
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

if __name__ == 'main':
    app.run(debug=True)