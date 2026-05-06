from datetime import datetime, timezone
from sqlalchemy import or_, and_
from ..extensions import db
from ..models.private_message import PrivateMessage
from ..models.friends import Amizade
from ..models.user import Usuario


# ─── helpers ──────────────────────────────────────────────────────────────────

def _sao_amigos(user_a: int, user_b: int) -> bool:
    """Verifica se dois utilizadores têm amizade aceite (bidirecional)."""
    return db.session.query(Amizade).filter(
        or_(
            and_(Amizade.user_id == user_a, Amizade.friend_id == user_b),
            and_(Amizade.user_id == user_b, Amizade.friend_id == user_a)
        ),
        Amizade.status == "aceito"
    ).first() is not None


def _usuario_existe(user_id: int) -> bool:
    return db.session.get(Usuario, user_id) is not None


# ─── serviços públicos ────────────────────────────────────────────────────────

def get_conversations(user_id: int) -> list:
    """
    Retorna a lista de conversas recentes do utilizador.
    Cada item inclui o outro utilizador, última mensagem, hora e contagem de não lidas.
    """
    # Busca todos os interlocutores distintos
    sent = db.session.query(PrivateMessage.receiver_id).filter(
        PrivateMessage.sender_id == user_id
    ).distinct()
    received = db.session.query(PrivateMessage.sender_id).filter(
        PrivateMessage.receiver_id == user_id
    ).distinct()

    interlocutores_ids = set()
    for row in sent:
        interlocutores_ids.add(row[0])
    for row in received:
        interlocutores_ids.add(row[0])

    conversations = []
    for other_id in interlocutores_ids:
        other = db.session.get(Usuario, other_id)
        if not other:
            continue

        # Última mensagem da conversa
        last_msg = PrivateMessage.query.filter(
            or_(
                and_(PrivateMessage.sender_id == user_id, PrivateMessage.receiver_id == other_id),
                and_(PrivateMessage.sender_id == other_id, PrivateMessage.receiver_id == user_id)
            )
        ).order_by(PrivateMessage.created_at.desc()).first()

        # Mensagens não lidas (recebidas pelo user_id e ainda não lidas)
        unread_count = PrivateMessage.query.filter(
            PrivateMessage.sender_id == other_id,
            PrivateMessage.receiver_id == user_id,
            PrivateMessage.read_at.is_(None)
        ).count()

        conversations.append({
            'friend': {'id': other.id, 'nome': other.nome, 'email': other.email},
            'last_message': last_msg.content if last_msg else '',
            'last_at': last_msg.created_at.isoformat() if last_msg else '',
            'unread_count': unread_count,
        })

    # Ordenar pela mensagem mais recente
    conversations.sort(key=lambda c: c['last_at'], reverse=True)
    return conversations


def get_messages(user_id: int, friend_id: int) -> tuple[list, str | None]:
    """
    Retorna o histórico de mensagens entre user_id e friend_id.
    Marca as mensagens recebidas como lidas.
    Retorna (lista, erro).
    """
    if not _usuario_existe(friend_id):
        return [], "Utilizador não encontrado"

    if not _sao_amigos(user_id, friend_id):
        return [], "Não são amigos"

    # Marcar mensagens recebidas como lidas
    unread = PrivateMessage.query.filter(
        PrivateMessage.sender_id == friend_id,
        PrivateMessage.receiver_id == user_id,
        PrivateMessage.read_at.is_(None)
    ).all()

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    for msg in unread:
        msg.read_at = now
    if unread:
        db.session.commit()

    # Histórico completo ordenado
    messages = PrivateMessage.query.filter(
        or_(
            and_(PrivateMessage.sender_id == user_id, PrivateMessage.receiver_id == friend_id),
            and_(PrivateMessage.sender_id == friend_id, PrivateMessage.receiver_id == user_id)
        )
    ).order_by(PrivateMessage.created_at.asc()).all()

    return [m.to_dict() for m in messages], None


def save_message(sender_id: int, receiver_id: int, content: str) -> tuple:
    """
    Salva uma mensagem privada no banco de dados.
    O sender_id vem SEMPRE da sessão — nunca do frontend.
    Retorna (dict_da_mensagem, erro).
    """
    content = (content or '').strip()
    if not content:
        return None, "Mensagem não pode estar vazia"

    if not _usuario_existe(receiver_id):
        return None, "Destinatário não encontrado"

    if sender_id == receiver_id:
        return None, "Não podes enviar mensagem a ti mesmo"

    if not _sao_amigos(sender_id, receiver_id):
        return None, "Não são amigos"

    msg = PrivateMessage(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content
    )
    db.session.add(msg)
    db.session.commit()
    return msg.to_dict(), None
