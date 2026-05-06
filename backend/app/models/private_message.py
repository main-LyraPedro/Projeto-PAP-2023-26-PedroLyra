from ..extensions import db
from datetime import datetime


class PrivateMessage(db.Model):
    """Mensagem privada entre dois utilizadores amigos."""
    __tablename__ = 'private_message'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read_at = db.Column(db.DateTime, nullable=True)

    # Relações para acesso fácil ao objeto Usuario
    sender = db.relationship('Usuario', foreign_keys=[sender_id], backref='sent_messages')
    receiver = db.relationship('Usuario', foreign_keys=[receiver_id], backref='received_messages')

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'sender_nome': self.sender.nome if self.sender else None,
        }
