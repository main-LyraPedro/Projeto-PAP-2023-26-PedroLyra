from ..extensions import db


class MissaoDiaria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False, unique=True)
    tarefa_id = db.Column(db.Integer, db.ForeignKey("tarefa.id"), nullable=False)
    criada_em = db.Column(db.DateTime, default=db.func.current_timestamp())


class FotoMissao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), nullable=False)
    missao_id = db.Column(db.Integer, db.ForeignKey("missao_diaria.id"), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    enviada_em = db.Column(db.DateTime, default=db.func.current_timestamp())
