from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os

# -------------------------------
# Inicializa o app Flask
# -------------------------------
app = Flask(__name__)
CORS(app, supports_credentials=True)

# -------------------------------
# Configurações de segurança
# -------------------------------
# Chave secreta para sessões (pode ser aleatória)
app.config['SECRET_KEY'] = os.urandom(24)

# Caminho absoluto do banco de dados
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'ecochat.db')}"

# Desativa warnings de modificações de objetos
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# -------------------------------
# Inicializa o SQLAlchemy
# -------------------------------
db = SQLAlchemy(app)

# -------------------------------
# Modelo da tabela Usuario
# -------------------------------
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)

# -------------------------------
# Inicializa banco e usuário padrão
# -------------------------------
def inicializar_db():
    with app.app_context():
        # Cria as tabelas do banco
        db.create_all()

        # Verifica se o usuário padrão já existe
        usuario_padrao = Usuario.query.filter_by(email='teste@eco.com').first()
        if not usuario_padrao:
            novo_usuario = Usuario(
                email='teste@eco.com',
                senha=generate_password_hash('123456')
            )
            db.session.add(novo_usuario)
            db.session.commit()
            print("✅ Usuário padrão criado: teste@eco.com / 123456")
        else:
            print("✅ Usuário padrão já existe no banco de dados")

# -------------------------------
# Rotas da API
# -------------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    usuario = Usuario.query.filter_by(email=email).first()
    if usuario and check_password_hash(usuario.senha, senha):
        session['user_id'] = usuario.id
        session['user_email'] = usuario.email
        return jsonify({"sucesso": True, "mensagem": "Login OK!"})
    else:
        return jsonify({"sucesso": False, "mensagem": "Email ou senha inválidos!"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"sucesso": False, "mensagem": "Email já cadastrado!"}), 400

    novo_usuario = Usuario(email=email, senha=generate_password_hash(senha))
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"sucesso": True, "mensagem": "Conta criada com sucesso!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    mensagem = data.get('message', '').lower()

    respostas = {
        'ola': 'Olá! 🌱 Sou o EcoBot. Como posso ajudar na sua jornada sustentável?',
        'consumo consciente': 'Consumo consciente é comprar apenas o necessário e preferir produtos duráveis. ♻️',
        'energia': 'Desligue aparelhos, use LED e aproveite luz natural! 💡',
        'agua': 'Economize água: banhos curtos e conserte vazamentos! 💧',
        'default': 'EcoBot 🌿: Pergunte sobre consumo consciente, energia ou água.'
    }

    resposta = respostas.get('default')
    for chave, resp in respostas.items():
        if chave in mensagem:
            resposta = resp
            break

    return jsonify({"response": resposta})

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "ok", "usuarios_cadastrados": Usuario.query.count()})

# -------------------------------
# Inicializa servidor
# -------------------------------
if __name__ == '__main__':
    inicializar_db()
    print("\n🌱 EcoChat Backend atualizado e rodando!")
    print("📍 Acesse: http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
