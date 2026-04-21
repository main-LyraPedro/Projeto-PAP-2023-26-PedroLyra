from ..extensions import db


class Publicacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    descricao = db.Column(db.String(500), nullable=False)
    imagem = db.Column(db.String(200), nullable=True)
    categoria = db.Column(db.String(50), default="geral")
    criada_em = db.Column(db.DateTime, default=db.func.current_timestamp())


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    publicacao_id = db.Column(db.Integer, db.ForeignKey("publicacao.id"), nullable=False)


class Comentario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    publicacao_id = db.Column(db.Integer, db.ForeignKey("publicacao.id"), nullable=False)
    texto = db.Column(db.String(500), nullable=False)
    criada_em = db.Column(db.DateTime, default=db.func.current_timestamp())
