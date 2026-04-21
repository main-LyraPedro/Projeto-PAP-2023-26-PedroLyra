from ..models.user import Usuario, UserStats
from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


def login_usuario(email: str, senha: str):
    """Valida credenciais e devolve o Usuario ou None."""
    usuario = Usuario.query.filter_by(email=email).first()
    if usuario and check_password_hash(usuario.senha, senha):
        return usuario
    return None


def registrar_usuario(nome: str, email: str, senha: str):
    """Cria novo utilizador. Devolve (usuario, None) ou (None, mensagem_erro)."""
    if Usuario.query.filter_by(email=email).first():
        return None, "Email já cadastrado!"

    novo = Usuario(nome=nome, email=email, senha=generate_password_hash(senha))
    db.session.add(novo)
    db.session.commit()

    stats = UserStats(user_id=novo.id)
    db.session.add(stats)
    db.session.commit()

    return novo, None
