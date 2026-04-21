# Re-exporta todos os modelos para que o SQLAlchemy os registe
# e para facilitar imports em outros módulos

from .user import Usuario, UserStats
from .friends import Amizade
from .tasks import Tarefa, TarefaUsuario
from .ecoreal import MissaoDiaria, FotoMissao
from .social import Publicacao, Like, Comentario

from ..extensions import db
from werkzeug.security import generate_password_hash
import random


def init_db():
    """Cria tabelas e seed de dados iniciais (idêntico ao original)."""
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
            db.session.add(Tarefa(**tarefa_data))

        db.session.commit()

    print("Banco de dados inicializado!")
