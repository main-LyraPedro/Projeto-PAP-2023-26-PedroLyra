from ..extensions import db


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
