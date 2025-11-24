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
app.config['SECRET_KEY'] = os.urandom(24)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'ecochat.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------------------------------
# MODELO: Usuário
# -------------------------------
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)

# -------------------------------
# MODELO: Amizade
# -------------------------------
class Amizade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    status = db.Column(db.String(20), default="pendente")  # pendente, aceito

# -------------------------------
# MODELO: Estatísticas do Usuário
# -------------------------------
class UserStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False, unique=True)
    pontos = db.Column(db.Integer, default=0)
    tarefas_completas = db.Column(db.Integer, default=0)
    dias_ativos = db.Column(db.Integer, default=0)
    nivel = db.Column(db.String(50), default="Eco Iniciante")
    ultimo_acesso = db.Column(db.DateTime, default=db.func.current_timestamp())

# -------------------------------
# MODELO: Tarefa (tarefas disponíveis)
# -------------------------------
class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.String(500))
    pontos = db.Column(db.Integer, default=10)
    categoria = db.Column(db.String(20), default="daily")  # daily, weekly, monthly
    icone = db.Column(db.String(50), default="Leaf")

# -------------------------------
# MODELO: TarefaUsuario (tarefas completadas)
# -------------------------------
class TarefaUsuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    tarefa_id = db.Column(db.Integer, db.ForeignKey("tarefa.id"), nullable=False)
    completada_em = db.Column(db.DateTime, default=db.func.current_timestamp())

# -------------------------------
# Inicialização do banco
# -------------------------------
def inicializar_db():
    with app.app_context():
        db.create_all()

        # 🔥 Criar usuários de teste (se não existirem)
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
        
        # 🔥 Criar stats para usuários de teste
        usuarios = Usuario.query.all()
        for usuario in usuarios:
            if not UserStats.query.filter_by(user_id=usuario.id).first():
                # Dados fictícios variados
                import random
                stats = UserStats(
                    user_id=usuario.id,
                    pontos=random.randint(100, 2500),
                    tarefas_completas=random.randint(5, 50),
                    dias_ativos=random.randint(1, 30)
                )
                db.session.add(stats)
        
        db.session.commit()
        
        # 🔥 Criar tarefas padrão
        if Tarefa.query.count() == 0:
            tarefas_padrao = [
                # DIÁRIAS
                {"titulo": "Separar lixo reciclável", "descricao": "Separe plástico, papel e vidro", "pontos": 10, "categoria": "daily", "icone": "Recycle"},
                {"titulo": "Economizar água", "descricao": "Tome um banho de 5 minutos", "pontos": 15, "categoria": "daily", "icone": "Droplet"},
                {"titulo": "Apagar luzes", "descricao": "Desligue luzes ao sair do ambiente", "pontos": 5, "categoria": "daily", "icone": "Zap"},
                
                # SEMANAIS
                {"titulo": "Usar sacola reutilizável", "descricao": "Vá às compras com sua própria sacola", "pontos": 20, "categoria": "weekly", "icone": "Leaf"},
                {"titulo": "Plantar uma árvore", "descricao": "Contribua com o reflorestamento", "pontos": 50, "categoria": "weekly", "icone": "Leaf"},
                {"titulo": "Reduzir consumo de carne", "descricao": "Faça 3 refeições vegetarianas", "pontos": 30, "categoria": "weekly", "icone": "Leaf"},
                
                # MENSAIS
                {"titulo": "Limpar uma área pública", "descricao": "Organize ou participe de mutirão", "pontos": 100, "categoria": "monthly", "icone": "Recycle"},
                {"titulo": "Educar 5 pessoas", "descricao": "Compartilhe dicas de sustentabilidade", "pontos": 75, "categoria": "monthly", "icone": "Leaf"},
            ]
            
            for tarefa_data in tarefas_padrao:
                tarefa = Tarefa(**tarefa_data)
                db.session.add(tarefa)
            
            db.session.commit()
            print("✅ Tarefas padrão criadas!")
        
        print("✅ Usuários e estatísticas criados!")


# -------------------------------
# HOME
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
            "/api/tasks/*"
        ]
    })


# -------------------------------
# LOGIN
# -------------------------------
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


# -------------------------------
# REGISTO
# -------------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nome = data.get("nome")
    email = data.get('email')
    senha = data.get('senha')

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"sucesso": False, "mensagem": "Email já cadastrado!"}), 400

    novo = Usuario(
        nome=nome,
        email=email,
        senha=generate_password_hash(senha)
    )
    db.session.add(novo)
    db.session.commit()

    # Criar stats para o novo usuário
    stats = UserStats(user_id=novo.id)
    db.session.add(stats)
    db.session.commit()

    return jsonify({"sucesso": True, "mensagem": "Conta criada com sucesso!"})


# -------------------------------
# CHAT SIMPLES
# -------------------------------
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


# -------------------------------
# STATUS
# -------------------------------
@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        "status": "ok",
        "usuarios_cadastrados": Usuario.query.count()
    })


# ======================================================
# ==================== SISTEMA DE PERFIL ===============
# ======================================================

# -------------------------------
# Buscar dados do perfil
# -------------------------------
@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    """Busca todos os dados do perfil do usuário"""
    
    # Buscar usuário
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    # Buscar ou criar estatísticas
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if not stats:
        stats = UserStats(user_id=user_id)
        db.session.add(stats)
        db.session.commit()
    
    # Contar amigos aceitos
    amigos_count = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id)) &
        (Amizade.status == "aceito")
    ).count()
    
    # Determinar nível baseado em pontos
    if stats.pontos < 500:
        nivel = "Eco Iniciante"
    elif stats.pontos < 1000:
        nivel = "Guardião Verde"
    elif stats.pontos < 2000:
        nivel = "Defensor Verde"
    else:
        nivel = "Eco Master"
    
    # Atualizar nível se mudou
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
        "proximo_nivel": 2000 if stats.pontos < 2000 else 3000
    })


# -------------------------------
# Atualizar perfil
# -------------------------------
@app.route('/api/profile/update', methods=['POST'])
def update_profile():
    """Atualiza nome e email do usuário"""
    data = request.get_json()
    user_id = data.get('user_id')
    novo_nome = data.get('nome')
    novo_email = data.get('email')
    
    if not user_id:
        return jsonify({"erro": "ID do usuário é obrigatório"}), 400
    
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    # Verificar se email já existe (se mudou)
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
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    })


# -------------------------------
# Atualizar senha
# -------------------------------
@app.route('/api/profile/change-password', methods=['POST'])
def change_password():
    """Altera a senha do usuário"""
    data = request.get_json()
    user_id = data.get('user_id')
    senha_atual = data.get('senha_atual')
    senha_nova = data.get('senha_nova')
    
    if not all([user_id, senha_atual, senha_nova]):
        return jsonify({"erro": "Todos os campos são obrigatórios"}), 400
    
    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    
    # Verificar senha atual
    if not check_password_hash(usuario.senha, senha_atual):
        return jsonify({"erro": "Senha atual incorreta"}), 401
    
    # Atualizar senha
    usuario.senha = generate_password_hash(senha_nova)
    db.session.commit()
    
    return jsonify({
        "sucesso": True,
        "mensagem": "Senha alterada com sucesso!"
    })


# ======================================================
# ==================== SISTEMA DE TAREFAS ==============
# ======================================================

# -------------------------------
# ROTA: Listar todas as tarefas
# -------------------------------
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Retorna todas as tarefas disponíveis"""
    tarefas = Tarefa.query.all()
    
    return jsonify([{
        "id": t.id,
        "titulo": t.titulo,
        "descricao": t.descricao,
        "pontos": t.pontos,
        "categoria": t.categoria,
        "icone": t.icone
    } for t in tarefas])


# -------------------------------
# ROTA: Buscar tarefas do usuário
# -------------------------------
@app.route('/api/tasks/user/<int:user_id>', methods=['GET'])
def get_user_tasks(user_id):
    """Retorna tarefas do usuário (com status de completada ou não)"""
    
    # Buscar todas as tarefas
    todas_tarefas = Tarefa.query.all()
    
    # Buscar tarefas completadas pelo usuário
    tarefas_completadas = TarefaUsuario.query.filter_by(user_id=user_id).all()
    tarefas_completadas_ids = [tc.tarefa_id for tc in tarefas_completadas]
    
    resultado = []
    for tarefa in todas_tarefas:
        resultado.append({
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "descricao": tarefa.descricao,
            "pontos": tarefa.pontos,
            "categoria": tarefa.categoria,
            "icone": tarefa.icone,
            "completada": tarefa.id in tarefas_completadas_ids
        })
    
    return jsonify(resultado)


# -------------------------------
# ROTA: Completar tarefa
# -------------------------------
@app.route('/api/tasks/complete', methods=['POST'])
def complete_task():
    """Marca uma tarefa como completada e adiciona pontos"""
    data = request.get_json()
    user_id = data.get('user_id')
    tarefa_id = data.get('tarefa_id')
    
    if not user_id or not tarefa_id:
        return jsonify({"erro": "Dados insuficientes"}), 400
    
    # Verificar se tarefa existe
    tarefa = Tarefa.query.get(tarefa_id)
    if not tarefa:
        return jsonify({"erro": "Tarefa não encontrada"}), 404
    
    # Verificar se já foi completada
    ja_completada = TarefaUsuario.query.filter_by(
        user_id=user_id, 
        tarefa_id=tarefa_id
    ).first()
    
    if ja_completada:
        return jsonify({"erro": "Tarefa já foi completada"}), 400
    
    # Marcar como completada
    tarefa_usuario = TarefaUsuario(user_id=user_id, tarefa_id=tarefa_id)
    db.session.add(tarefa_usuario)
    
    # Adicionar pontos ao usuário
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if stats:
        stats.pontos += tarefa.pontos
        stats.tarefas_completas += 1
        
        # Atualizar nível baseado nos novos pontos
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


# -------------------------------
# ROTA: Desmarcar tarefa (opcional)
# -------------------------------
@app.route('/api/tasks/uncomplete', methods=['POST'])
def uncomplete_task():
    """Desmarca uma tarefa e remove pontos"""
    data = request.get_json()
    user_id = data.get('user_id')
    tarefa_id = data.get('tarefa_id')
    
    if not user_id or not tarefa_id:
        return jsonify({"erro": "Dados insuficientes"}), 400
    
    # Buscar tarefa completada
    tarefa_usuario = TarefaUsuario.query.filter_by(
        user_id=user_id, 
        tarefa_id=tarefa_id
    ).first()
    
    if not tarefa_usuario:
        return jsonify({"erro": "Tarefa não estava completada"}), 404
    
    # Buscar tarefa para pegar pontos
    tarefa = Tarefa.query.get(tarefa_id)
    
    # Remover da lista de completadas
    db.session.delete(tarefa_usuario)
    
    # Remover pontos
    stats = UserStats.query.filter_by(user_id=user_id).first()
    if stats and tarefa:
        stats.pontos = max(0, stats.pontos - tarefa.pontos)
        stats.tarefas_completas = max(0, stats.tarefas_completas - 1)
        
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
        "mensagem": "Tarefa desmarcada",
        "novos_pontos": stats.pontos if stats else 0
    })


# ======================================================
# ==================== SISTEMA DE AMIGOS ===============
# ======================================================

# -------------------------------
# 1 — Listar amigos ACEITOS
# -------------------------------
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

        amigos.append({
            "id": alvo.id,
            "nome": alvo.nome,
            "email": alvo.email
        })

    return jsonify(amigos)


# -------------------------------
# 2 — Listar pedidos PENDENTES
# -------------------------------
@app.route("/api/friends/pending/<int:user_id>", methods=["GET"])
def listar_pendentes(user_id):
    # Pedidos que VOCÊ RECEBEU (onde você é o friend_id e status é pendente)
    pedidos = Amizade.query.filter(
        (Amizade.friend_id == user_id) & 
        (Amizade.status == "pendente")
    ).all()

    pendentes = []
    for p in pedidos:
        remetente = Usuario.query.get(p.user_id)
        pendentes.append({
            "amizade_id": p.id,
            "id": remetente.id,
            "nome": remetente.nome,
            "email": remetente.email
        })

    return jsonify(pendentes)


# -------------------------------
# 3 — Adicionar amigo (pedido)
# -------------------------------
@app.route("/api/friends/add", methods=["POST"])
def adicionar_amigo():
    data = request.get_json()
    user_id = data.get("user_id")
    alvo = data.get("alvo")  # email, nome ou id

    if not user_id or not alvo:
        return jsonify({"erro": "Dados insuficientes"}), 400

    # Buscar usuário alvo
    amigo = None

    if isinstance(alvo, int):
        amigo = Usuario.query.get(alvo)
    else:
        amigo = Usuario.query.filter(
            (Usuario.email == alvo) | (Usuario.nome == alvo)
        ).first()

    if not amigo:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    if amigo.id == user_id:
        return jsonify({"erro": "Você não pode adicionar a si mesmo"}), 400

    # Verificar amizade existente
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


# -------------------------------
# 4 — Aceitar pedido
# -------------------------------
@app.route("/api/friends/accept", methods=["POST"])
def aceitar_amizade():
    data = request.get_json()
    user_id = data.get("user_id")  # Quem está ACEITANDO
    friend_id = data.get("friend_id")  # Quem ENVIOU o pedido

    # Buscar o pedido onde friend_id enviou para user_id
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


# -------------------------------
# 5 — Recusar pedido
# -------------------------------
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


# -------------------------------
# 6 — Remover amigo
# -------------------------------
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


# -------------------------------
# RODAR SERVIDOR
# -------------------------------
if __name__ == '__main__':
    inicializar_db()
    print("\n🌱 EcoChat Backend rodando!")
    print("📍 Acesse: http://127.0.0.1:5000")
    print("\n👥 Usuários de teste criados:")
    print("   - teste@eco.com / 123456")
    print("   - maria@email.com / 123456")
    print("   - joao@email.com / 123456")
    print("   - ana@email.com / 123456")
    print("   - pedro@gmail.com / 123456")
    app.run(debug=True, host='127.0.0.1', port=5000)