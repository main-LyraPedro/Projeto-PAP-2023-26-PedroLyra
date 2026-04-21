from ..models.friends import Amizade
from ..models.user import Usuario
from ..extensions import db


def listar_amigos(user_id: int) -> list:
    amizades = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id))
        & (Amizade.status == "aceito")
    ).all()

    amigos = []
    for a in amizades:
        amigo_id = a.friend_id if a.user_id == user_id else a.user_id
        alvo = Usuario.query.get(amigo_id)
        amigos.append({"id": alvo.id, "nome": alvo.nome, "email": alvo.email})
    return amigos


def listar_pendentes(user_id: int) -> list:
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
    return pendentes


def adicionar_amigo(user_id: int, alvo):
    """alvo pode ser int (id) ou str (email/nome)."""
    if isinstance(alvo, int):
        amigo = Usuario.query.get(alvo)
    else:
        amigo = Usuario.query.filter(
            (Usuario.email == alvo) | (Usuario.nome == alvo)
        ).first()

    if not amigo:
        return None, "Usuário não encontrado"

    if amigo.id == user_id:
        return None, "Você não pode adicionar a si mesmo"

    existente = Amizade.query.filter(
        ((Amizade.user_id == user_id) & (Amizade.friend_id == amigo.id))
        | ((Amizade.user_id == amigo.id) & (Amizade.friend_id == user_id))
    ).first()

    if existente:
        return None, "Vocês já são amigos" if existente.status == "aceito" else "Pedido já enviado"

    amizade = Amizade(user_id=user_id, friend_id=amigo.id, status="pendente")
    db.session.add(amizade)
    db.session.commit()
    return amizade, None


def aceitar_amizade(user_id: int, friend_id: int):
    amizade = Amizade.query.filter(
        (Amizade.user_id == friend_id)
        & (Amizade.friend_id == user_id)
        & (Amizade.status == "pendente")
    ).first()

    if not amizade:
        return False, "Pedido não encontrado"

    amizade.status = "aceito"
    db.session.commit()
    return True, None


def recusar_amizade(user_id: int, friend_id: int):
    amizade = Amizade.query.filter(
        (Amizade.user_id == friend_id)
        & (Amizade.friend_id == user_id)
        & (Amizade.status == "pendente")
    ).first()

    if not amizade:
        return False, "Pedido não encontrado"

    db.session.delete(amizade)
    db.session.commit()
    return True, None


def remover_amigo(user_id: int, friend_id: int):
    amizade = Amizade.query.filter(
        ((Amizade.user_id == user_id) & (Amizade.friend_id == friend_id))
        | ((Amizade.user_id == friend_id) & (Amizade.friend_id == user_id))
    ).first()

    if not amizade:
        return False, "Amizade não encontrada"

    db.session.delete(amizade)
    db.session.commit()
    return True, None
