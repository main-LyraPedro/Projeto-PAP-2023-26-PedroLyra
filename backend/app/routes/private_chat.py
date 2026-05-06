from flask import Blueprint, jsonify, session
from ..services.private_chat_service import get_conversations, get_messages

private_chat_bp = Blueprint('private_chat', __name__)


def _get_user_id():
    """Obtém o user_id da sessão. Nunca confia em dados do frontend."""
    return session.get('user_id')


@private_chat_bp.route('/api/private-chat/conversations', methods=['GET'])
def conversations():
    user_id = _get_user_id()
    if not user_id:
        return jsonify({'erro': 'Não autenticado'}), 401

    data = get_conversations(user_id)
    return jsonify(data)


@private_chat_bp.route('/api/private-chat/messages/<int:friend_id>', methods=['GET'])
def messages(friend_id: int):
    user_id = _get_user_id()
    if not user_id:
        return jsonify({'erro': 'Não autenticado'}), 401

    msgs, erro = get_messages(user_id, friend_id)
    if erro:
        status = 404 if 'não encontrado' in erro else 403
        return jsonify({'erro': erro}), status

    return jsonify(msgs)
