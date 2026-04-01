from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, date
import os
import random

# -------------------------------
# Inicializa o app Flask
# -------------------------------
app = Flask(__name__)
CORS(app, supports_credentials=True)

# -------------------------------
# Configurações
# -------------------------------
app.config['SECRET_KEY'] = os.urandom(24)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'ecochat.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(basedir, 'uploads')

# Criar pasta uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Extensões permitidas
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

db = SQLAlchemy(app)

# -------------------------------
# MODELOS
# -------------------------------

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)

class Amizade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    status = db.Column(db.String(20), default="pendente")

class UserStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False, unique=True)
    pontos = db.Column(db.Integer, default=0)
    tarefas_completas = db.Column(db.Integer, default=0)
    dias_ativos = db.Column(db.Integer, default=0)
    nivel = db.Column(db.String(50), default="Eco Iniciante")
    streak_atual = db.Column(db.Integer, default=0)  # 🔥 NOVO: Contador de streak
    ultima_missao = db.Column(db.Date, nullable=True)  # 🔥 NOVO: Data da última missão
    ultimo_acesso = db.Column(db.DateTime, default=db.func.current_timestamp())

class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.String(500))
    pontos = db.Column(db.Integer, default=10)
    categoria = db.Column(db.String(20), default="daily")
    icone = db.Column(db.String(50), default="Leaf")

class TarefaUsuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    tarefa_id = db.Column(db.Integer, db.ForeignKey("tarefa.id"), nullable=False)
    completada_em = db.Column(db.DateTime, default=db.func.current_timestamp())

# 🔥 NOVO: Modelo para Missões Diárias do EcoReal
class MissaoDiaria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False, unique=True)
    tarefa_id = db.Column(db.Integer, db.ForeignKey("tarefa.id"), nullable=False)
    criada_em = db.Column(db.DateTime, default=db.func.current_timestamp())

# 🔥 NOVO: Modelo para Fotos das Missões
class FotoMissao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    missao_id = db.Column(db.Integer, db.ForeignKey("missao_diaria.id"), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    enviada_em = db.Column(db.DateTime, default=db.func.current_timestamp())

# -------------------------------
# Funções auxiliares
# -------------------------------

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def gerar_missao_do_dia():
    """Gera a missão do dia se ainda não existe"""
    hoje = date.today()
    
    # Verificar se já existe missão para hoje
    missao_existente = MissaoDiaria.query.filter_by(data=hoje).first()
    if missao_existente:
        return missao_existente
    
    # Buscar tarefas diárias
    tarefas_disponiveis = Tarefa.query.filter_by(categoria='daily').all()
    
    if not tarefas_disponiveis:
        return None
    
    # Escolher tarefa aleatória
    tarefa_escolhida = random.choice(tarefas_disponiveis)
    
    # Criar missão do dia
    nova_missao = MissaoDiaria(data=hoje, tarefa_id=tarefa_escolhida.id)
    db.session.add(nova_missao)
    db.session.commit()
    
    return nova_missao

# -------------------------------
# Inicialização do banco
# -------------------------------
def inicializar_db():
    with app.app_context():
        db.create_all()

        usuarios_teste = [
            {"nome": "Usuário Teste", "email": "teste@eco.com", "senha": "123456"},
            {"nome": "Maria Silva", "email": "maria@email.com", "senha": "123456"},
            {"nome": "João Pedro", "email": "joao@email.com", "senha": "123456"},
            {"nome": "Ana Costa", "email": "ana@email.com", "senha": "123456"},
            {"nome": "Pedro Lyra", "email": "pedro@gmail.com", "senha": "123456"},
        ]

        for user_data in usuarios_teste:
            if not Usuario.query.filter_by(email=user_data["email"]).first():
                novo = Usuario(
                    nome=user_data["nome"],
                    email=user_data["email"],
                    senha=generate_password_hash(user_data["senha"])
                )
                db.session.add(novo)
        
        db.session.commit()
        
        usuarios = Usuario.query.all()
        for usuario in usuarios:
            if not UserStats.query.filter_by(user_id=usuario.id).first():
                stats = UserStats(
                    user_id=usuario.id,
                    pontos=random.randint(100, 2500),
                    tarefas_completas=random.randint(5, 50),
                    dias_ativos=random.randint(1, 30),
                    streak_atual=random.randint(0, 10)
                )
                db.session.add(stats)
        
        db.session.commit()
        
        if Tarefa.query.count() == 0:
            tarefas_padrao = [
                {"titulo": "Separar lixo reciclável", "descricao": "Separe plástico, papel e vidro", "pontos": 10, "categoria": "daily", "icone": "Recycle"},
                {"titulo": "Economizar água", "descricao": "Tome um banho de 5 minutos", "pontos": 15, "categoria": "daily", "icone": "Droplet"},
                {"titulo": "Apagar luzes", "descricao": "Desligue luzes ao sair do ambiente", "pontos": 5, "categoria": "daily", "icone": "Zap"},
                {"titulo": "Usar sacola reutilizável", "descricao": "Vá às compras com sua própria sacola", "pontos": 20, "categoria": "weekly", "icone": "Leaf"},
                {"titulo": "Plantar uma árvore", "descricao": "Contribua com o reflorestamento", "pontos": 50, "categoria": "weekly", "icone": "Leaf"},
                {"titulo": "Reduzir consumo de carne", "descricao": "Faça 3 refeições vegetarianas", "pontos": 30, "categoria": "weekly", "icone": "Leaf"},
                {"titulo": "Limpar uma área pública", "descricao": "Organize ou participe de mutirão", "pontos": 100, "categoria": "monthly", "icone": "Recycle"},
                {"titulo": "Educar 5 pessoas", "descricao": "Compartilhe dicas de sustentabilidade", "pontos": 75, "categoria": "monthly", "icone": "Leaf"},
            ]
            
            for tarefa_data in tarefas_padrao:
                tarefa = Tarefa(**tarefa_data)
                db.session.add(tarefa)
            
            db.session.commit()
            print("✅ Tarefas padrão criadas!")
        
        print("✅ Banco de dados inicializado!")


# -------------------------------
# ROTAS BÁSICAS
# -------------------------------

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "mensagem": "🌱 EcoChat API está ativa!",
        "rotas_disponiveis": [
            "/api/login",
            "/api/register",
            "/api/chat",
            "/api/status",
            "/api/friends/*",
            "/api/profile/<user_id>",
            "/api/tasks/*",
            "/api/ranking",
            "/api/ecoreal/*"
        ]
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and check_password_hash(usuario.senha, senha):
        session['user_id'] = usuario.id
        return jsonify({
            "sucesso": True,
            "mensagem": "Login OK!",
            "user": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email
            }
        })

    return jsonify({"sucesso": False, "mensagem": "Email ou senha inválidos!"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get('email')
    senha = data.get('senha')

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"sucesso": False, "mensagem": "Email já cadastrado!"}), 400

    novo = Usuario(nome=nome, email=email, senha=generate_password_hash(senha))
    db.session.add(novo)
    db.session.commit()

    stats = UserStats(user_id=novo.id)
    db.session.add(stats)
    db.session.commit()

    return jsonify({"sucesso": True, "mensagem": "Conta criada com sucesso!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    mensagem = data.get('message', '').lower()

    respostas = {
        'ola': 'Olá! 🌱 Como posso ajudar?',
        'energia': 'Use LED e desligue aparelhos! 💡',
        'agua': 'Economize água tomando banhos curtos! 💧',
        'default': 'Pergunte sobre energia, água, consumo consciente 💚'
    }

    for chave in respostas:
        if chave in mensagem:
            return jsonify({"response": respostas[chave]})

    return jsonify({"response": respostas["default"]})

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        "status": "ok",
        "usuarios_cadastrados": Usuario.query.count()
    })


# ======================================================
# ==================== SISTEMA DE PERFIL ===============
# ======================================================

@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if not stats:
        stats = UserStats(user_id=user_id)
        db.session.add(stats)
        db.session.commit()
    
    amigos_count = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id)) &
        (Amizade.status == "aceito")
    ).count()
    
    if stats.pontos < 500:
        nivel = "Eco Iniciante"
    elif stats.pontos < 1000:
        nivel = "Guardião Verde"
    elif stats.pontos < 2000:
        nivel = "Defensor Verde"
    else:
        nivel = "Eco Master"
    
    if stats.nivel != nivel:
        stats.nivel = nivel
        db.session.commit()
    
    return jsonify({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "pontos": stats.pontos,
        "nivel": stats.nivel,
        "tarefas_completas": stats.tarefas_completas,
        "dias_ativos": stats.dias_ativos,
        "amigos_count": amigos_count,
        "proximo_nivel": 2000 if stats.pontos < 2000 else 3000,
        "streak": stats.streak_atual  # 🔥 NOVO
    })

@app.route('/api/profile/update', methods=['POST'])
def update_profile():
    data = request.get_json()
    user_id = data.get('user_id')
    novo_nome = data.get('nome')
    novo_email = data.get('email')
    
    if not user_id:
        return jsonify({"erro": "ID do usuário é obrigatório"}), 400
    
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    if novo_email and novo_email != usuario.email:
        email_existe = Usuario.query.filter_by(email=novo_email).first()
        if email_existe:
            return jsonify({"erro": "Este email já está em uso"}), 400
        usuario.email = novo_email
    
    if novo_nome:
        usuario.nome = novo_nome
    
    db.session.commit()
    
    return jsonify({
        "sucesso": True,
        "mensagem": "Perfil atualizado com sucesso!",
        "usuario": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}
    })

@app.route('/api/profile/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    user_id = data.get('user_id')
    senha_atual = data.get('senha_atual')
    senha_nova = data.get('senha_nova')
    
    if not all([user_id, senha_atual, senha_nova]):
        return jsonify({"erro": "Todos os campos são obrigatórios"}), 400
    
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    if not check_password_hash(usuario.senha, senha_atual):
        return jsonify({"erro": "Senha atual incorreta"}), 401
    
    usuario.senha = generate_password_hash(senha_nova)
    db.session.commit()
    
    return jsonify({"sucesso": True, "mensagem": "Senha alterada com sucesso!"})


# ======================================================
# ==================== SISTEMA DE TAREFAS ==============
# ======================================================

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tarefas = Tarefa.query.all()
    return jsonify([{
        "id": t.id, "titulo": t.titulo, "descricao": t.descricao,
        "pontos": t.pontos, "categoria": t.categoria, "icone": t.icone
    } for t in tarefas])

@app.route('/api/tasks/user/<int:user_id>', methods=['GET'])
def get_user_tasks(user_id):
    todas_tarefas = Tarefa.query.all()
    tarefas_completadas = TarefaUsuario.query.filter_by(user_id=user_id).all()
    tarefas_completadas_ids = [tc.tarefa_id for tc in tarefas_completadas]
    
    resultado = []
    for tarefa in todas_tarefas:
        resultado.append({
            "id": tarefa.id, "titulo": tarefa.titulo, "descricao": tarefa.descricao,
            "pontos": tarefa.pontos, "categoria": tarefa.categoria, "icone": tarefa.icone,
            "completada": tarefa.id in tarefas_completadas_ids
        })
    
    return jsonify(resultado)

@app.route('/api/tasks/complete', methods=['POST'])
def complete_task():
    data = request.get_json()
    user_id = data.get('user_id')
    tarefa_id = data.get('tarefa_id')
    
    if not user_id or not tarefa_id:
        return jsonify({"erro": "Dados insuficientes"}), 400
    
    tarefa = Tarefa.query.get(tarefa_id)
    if not tarefa:
        return jsonify({"erro": "Tarefa não encontrada"}), 404
    
    ja_completada = TarefaUsuario.query.filter_by(user_id=user_id, tarefa_id=tarefa_id).first()
    if ja_completada:
        return jsonify({"erro": "Tarefa já foi completada"}), 400
    
    tarefa_usuario = TarefaUsuario(user_id=user_id, tarefa_id=tarefa_id)
    db.session.add(tarefa_usuario)
    
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if stats:
        stats.pontos += tarefa.pontos
        stats.tarefas_completas += 1
        
        if stats.pontos < 500:
            stats.nivel = "Eco Iniciante"
        elif stats.pontos < 1000:
            stats.nivel = "Guardião Verde"
        elif stats.pontos < 2000:
            stats.nivel = "Defensor Verde"
        else:
            stats.nivel = "Eco Master"
    
    db.session.commit()
    
    return jsonify({
        "sucesso": True,
        "mensagem": f"Parabéns! +{tarefa.pontos} pontos",
        "novos_pontos": stats.pontos if stats else 0,
        "nivel": stats.nivel if stats else "Eco Iniciante"
    })

@app.route('/api/tasks/uncomplete', methods=['POST'])
def uncomplete_task():
    data = request.get_json()
    user_id = data.get('user_id')
    tarefa_id = data.get('tarefa_id')
    
    if not user_id or not tarefa_id:
        return jsonify({"erro": "Dados insuficientes"}), 400
    
    tarefa_usuario = TarefaUsuario.query.filter_by(user_id=user_id, tarefa_id=tarefa_id).first()
    if not tarefa_usuario:
        return jsonify({"erro": "Tarefa não estava completada"}), 404
    
    tarefa = Tarefa.query.get(tarefa_id)
    db.session.delete(tarefa_usuario)
    
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if stats and tarefa:
        stats.pontos = max(0, stats.pontos - tarefa.pontos)
        stats.tarefas_completas = max(0, stats.tarefas_completas - 1)
        
        if stats.pontos < 500:
            stats.nivel = "Eco Iniciante"
        elif stats.pontos < 1000:
            stats.nivel = "Guardião Verde"
        elif stats.pontos < 2000:
            stats.nivel = "Defensor Verde"
        else:
            stats.nivel = "Eco Master"
    
    db.session.commit()
    
    return jsonify({
        "sucesso": True,
        "mensagem": "Tarefa desmarcada",
        "novos_pontos": stats.pontos if stats else 0
    })


# ======================================================
# ==================== SISTEMA DE AMIGOS ===============
# ======================================================

@app.route("/api/friends/<int:user_id>", methods=["GET"])
def listar_amigos(user_id):
    amizades = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id)) &
        (Amizade.status == "aceito")
    ).all()

    amigos = []
    for a in amizades:
        amigo_id = a.friend_id if a.user_id == user_id else a.user_id
        alvo = Usuario.query.get(amigo_id)
        amigos.append({"id": alvo.id, "nome": alvo.nome, "email": alvo.email})

    return jsonify(amigos)

@app.route("/api/friends/pending/<int:user_id>", methods=["GET"])
def listar_pendentes(user_id):
    pedidos = Amizade.query.filter(
        (Amizade.friend_id == user_id) & (Amizade.status == "pendente")
    ).all()

    pendentes = []
    for p in pedidos:
        remetente = Usuario.query.get(p.user_id)
        pendentes.append({
            "amizade_id": p.id, "id": remetente.id,
            "nome": remetente.nome, "email": remetente.email
        })

    return jsonify(pendentes)

@app.route("/api/friends/add", methods=["POST"])
def adicionar_amigo():
    data = request.get_json()
    user_id = data.get("user_id")
    alvo = data.get("alvo")

    if not user_id or not alvo:
        return jsonify({"erro": "Dados insuficientes"}), 400

    amigo = None
    if isinstance(alvo, int):
        amigo = Usuario.query.get(alvo)
    else:
        amigo = Usuario.query.filter((Usuario.email == alvo) | (Usuario.nome == alvo)).first()

    if not amigo:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    if amigo.id == user_id:
        return jsonify({"erro": "Você não pode adicionar a si mesmo"}), 400

    existente = Amizade.query.filter(
        ((Amizade.user_id == user_id) & (Amizade.friend_id == amigo.id)) |
        ((Amizade.user_id == amigo.id) & (Amizade.friend_id == user_id))
    ).first()

    if existente:
        if existente.status == "aceito":
            return jsonify({"erro": "Vocês já são amigos"}), 400
        else:
            return jsonify({"erro": "Pedido já enviado"}), 400

    amizade = Amizade(user_id=user_id, friend_id=amigo.id, status="pendente")
    db.session.add(amizade)
    db.session.commit()

    return jsonify({"sucesso": True, "mensagem": "Pedido enviado!"})

@app.route("/api/friends/accept", methods=["POST"])
def aceitar_amizade():
    data = request.get_json()
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")

    amizade = Amizade.query.filter(
        (Amizade.user_id == friend_id) & 
        (Amizade.friend_id == user_id) &
        (Amizade.status == "pendente")
    ).first()

    if not amizade:
        return jsonify({"erro": "Pedido não encontrado"}), 404

    amizade.status = "aceito"
    db.session.commit()

    return jsonify({"sucesso": True, "mensagem": "Amizade aceita!"})

@app.route("/api/friends/decline", methods=["POST"])
def recusar_amizade():
    data = request.get_json()
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")

    amizade = Amizade.query.filter(
        (Amizade.user_id == friend_id) & 
        (Amizade.friend_id == user_id) &
        (Amizade.status == "pendente")
    ).first()

    if not amizade:
        return jsonify({"erro": "Pedido não encontrado"}), 404

    db.session.delete(amizade)
    db.session.commit()

    return jsonify({"sucesso": True, "mensagem": "Pedido recusado"})

@app.route("/api/friends/remove", methods=["POST"])
def remover_amigo():
    data = request.get_json()
    user_id = data.get("user_id")
    friend_id = data.get("friend_id")

    amizade = Amizade.query.filter(
        ((Amizade.user_id == user_id) & (Amizade.friend_id == friend_id)) |
        ((Amizade.user_id == friend_id) & (Amizade.friend_id == user_id))
    ).first()

    if not amizade:
        return jsonify({"erro": "Amizade não encontrada"}), 404

    db.session.delete(amizade)
    db.session.commit()

    return jsonify({"sucesso": True, "mensagem": "Amigo removido"})


# ======================================================
# ==================== SISTEMA DE RANKING ==============
# ======================================================

@app.route('/api/ranking', methods=['GET'])
def get_ranking():
    usuarios = Usuario.query.all()
    
    ranking = []
    for usuario in usuarios:
        stats = UserStats.query.filter_by(user_id=usuario.id).first()
        if stats:
            ranking.append({
                "id": usuario.id, "nome": usuario.nome,
                "pontos": stats.pontos, "nivel": stats.nivel,
                "tarefas_completas": stats.tarefas_completas
            })
    
    ranking.sort(key=lambda x: x['pontos'], reverse=True)
    
    for i, user in enumerate(ranking):
        user['posicao'] = i + 1
    
    return jsonify(ranking)


# ======================================================
# ==================== SISTEMA ECOREAL =================
# ======================================================

# 🔥 Buscar missão do dia
@app.route('/api/ecoreal/missao-do-dia', methods=['GET'])
def get_missao_do_dia():
    """Retorna a missão do dia"""
    missao = gerar_missao_do_dia()
    
    if not missao:
        return jsonify({"erro": "Nenhuma tarefa disponível"}), 404
    
    tarefa = Tarefa.query.get(missao.tarefa_id)
    
    return jsonify({
        "id": missao.id,
        "data": missao.data.isoformat(),
        "tarefa": {
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "descricao": tarefa.descricao,
            "pontos": tarefa.pontos,
            "icone": tarefa.icone
        }
    })


# 🔥 Verificar se usuário já completou missão de hoje
@app.route('/api/ecoreal/status/<int:user_id>', methods=['GET'])
def get_ecoreal_status(user_id):
    """Verifica se usuário já completou a missão de hoje"""
    hoje = date.today()
    missao_hoje = MissaoDiaria.query.filter_by(data=hoje).first()
    
    if not missao_hoje:
        missao_hoje = gerar_missao_do_dia()
    
    foto_enviada = FotoMissao.query.filter_by(
        user_id=user_id,
        missao_id=missao_hoje.id
    ).first()
    
    stats = UserStats.query.filter_by(user_id=user_id).first()
    
    return jsonify({
        "completada": foto_enviada is not None,
        "streak": stats.streak_atual if stats else 0,
        "ultima_missao": stats.ultima_missao.isoformat() if stats and stats.ultima_missao else None
    })


# 🔥 Upload de foto da missão
@app.route('/api/ecoreal/upload', methods=['POST'])
def upload_foto_missao():
    """Upload de foto para completar a missão do dia"""
    
    if 'foto' not in request.files:
        return jsonify({"erro": "Nenhuma foto enviada"}), 400
    
    file = request.files['foto']
    user_id = request.form.get('user_id')
    
    if not user_id:
        return jsonify({"erro": "ID do usuário é obrigatório"}), 400
    
    user_id = int(user_id)
    
    if file.filename == '':
        return jsonify({"erro": "Arquivo vazio"}), 400
    
    if file and allowed_file(file.filename):
        # Gerar nome único
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = secure_filename(f"user_{user_id}_{timestamp}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        file.save(filepath)
        
        # Buscar missão de hoje
        hoje = date.today()
        missao_hoje = MissaoDiaria.query.filter_by(data=hoje).first()
        
        if not missao_hoje:
            missao_hoje = gerar_missao_do_dia()
        
        # Verificar se já enviou foto hoje
        foto_existente = FotoMissao.query.filter_by(
            user_id=user_id,
            missao_id=missao_hoje.id
        ).first()
        
        if foto_existente:
            return jsonify({"erro": "Você já completou a missão de hoje!"}), 400
        
        # Salvar registro da foto
        nova_foto = FotoMissao(
            user_id=user_id,
            missao_id=missao_hoje.id,
            filename=filename
        )
        db.session.add(nova_foto)
        
        # Buscar tarefa e adicionar pontos BÔNUS (x2)
        tarefa = Tarefa.query.get(missao_hoje.tarefa_id)
        pontos_bonus = tarefa.pontos * 2
        
        stats = UserStats.query.filter_by(user_id=user_id).first()
        if stats:
            stats.pontos += pontos_bonus
            stats.tarefas_completas += 1
            
            # Atualizar streak
            if stats.ultima_missao == hoje - timedelta(days=1):
                stats.streak_atual += 1
            elif stats.ultima_missao != hoje:
                stats.streak_atual = 1
            
            stats.ultima_missao = hoje
            
            # Atualizar nível
            if stats.pontos < 500:
                stats.nivel = "Eco Iniciante"
            elif stats.pontos < 1000:
                stats.nivel = "Guardião Verde"
            elif stats.pontos < 2000:
                stats.nivel = "Defensor Verde"
            else:
                stats.nivel = "Eco Master"
        
        db.session.commit()
        
        return jsonify({
            "sucesso": True,
            "mensagem": f"Missão completada! +{pontos_bonus} pontos (bônus x2) 🔥",
            "filename": filename,
            "pontos_ganhos": pontos_bonus,
            "streak": stats.streak_atual if stats else 1
        })
    
    return jsonify({"erro": "Tipo de arquivo não permitido"}), 400


# 🔥 Feed de missões dos amigos
@app.route('/api/ecoreal/feed/<int:user_id>', methods=['GET'])
def get_feed_ecoreal(user_id):
    """Retorna o feed de missões completadas pelos amigos"""
    
    # Buscar amigos
    amizades = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id)) &
        (Amizade.status == "aceito")
    ).all()
    
    amigos_ids = []
    for a in amizades:
        amigo_id = a.friend_id if a.user_id == user_id else a.user_id
        amigos_ids.append(amigo_id)
    
    # Incluir o próprio usuário
    amigos_ids.append(user_id)
    
    # Buscar fotos recentes (últimos 7 dias)
    sete_dias_atras = date.today() - timedelta(days=7)
    
    fotos = FotoMissao.query.filter(
        FotoMissao.user_id.in_(amigos_ids)
    ).order_by(FotoMissao.enviada_em.desc()).limit(50).all()
    
    feed = []
    for foto in fotos:
        usuario = Usuario.query.get(foto.user_id)
        missao = MissaoDiaria.query.get(foto.missao_id)
        tarefa = Tarefa.query.get(missao.tarefa_id)
        
        feed.append({
            "id": foto.id,
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome
            },
            "tarefa": {
                "titulo": tarefa.titulo,
                "pontos": tarefa.pontos
            },
            "foto_url": f"/api/ecoreal/imagem/{foto.filename}",
            "enviada_em": foto.enviada_em.isoformat(),
            "data_missao": missao.data.isoformat()
        })
    
    return jsonify(feed)


# 🔥 Servir imagens
@app.route('/api/ecoreal/imagem/<filename>', methods=['GET'])
def get_imagem(filename):
    """Retorna a imagem"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# -------------------------------
# RODAR SERVIDOR
# -------------------------------
if __name__ == '__main__':
    inicializar_db()
    print("\n🌱 EcoChat Backend rodando!")
    print("📍 Acesse: http://127.0.0.1:5000")
    print("\n👥 Usuários de teste:")
    print("   - teste@eco.com / 123456")
    print("   - maria@email.com / 123456")
    print("   - joao@email.com / 123456")
    print("   - ana@email.com / 123456")
    print("   - pedro@gmail.com / 123456")
    print("\n📸 Sistema EcoReal ativado!")
    app.run(debug=True, host='127.0.0.1', port=5000)