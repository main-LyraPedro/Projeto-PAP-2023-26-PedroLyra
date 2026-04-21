from ..models.tasks import Tarefa, TarefaUsuario
from ..models.user import UserStats
from ..extensions import db
from .gamification_service import adicionar_pontos, atualizar_streak, calcular_nivel


def get_user_tasks(user_id: int) -> list:
    todas_tarefas = Tarefa.query.all()
    completadas_ids = {tc.tarefa_id for tc in TarefaUsuario.query.filter_by(user_id=user_id).all()}

    return [
        {
            "id": t.id, "titulo": t.titulo, "descricao": t.descricao,
            "pontos": t.pontos, "categoria": t.categoria, "icone": t.icone,
            "completada": t.id in completadas_ids,
        }
        for t in todas_tarefas
    ]


def completar_tarefa(user_id: int, tarefa_id: int):
    tarefa = Tarefa.query.get(tarefa_id)
    if not tarefa:
        return None, "Tarefa não encontrada"

    if TarefaUsuario.query.filter_by(user_id=user_id, tarefa_id=tarefa_id).first():
        return None, "Tarefa já foi completada"

    db.session.add(TarefaUsuario(user_id=user_id, tarefa_id=tarefa_id))

    stats = UserStats.query.filter_by(user_id=user_id).first()
    novo_nivel = None

    if stats:
        novo_nivel = adicionar_pontos(stats, tarefa.pontos)
        stats.tarefas_completas += 1
        atualizar_streak(stats)

    db.session.commit()

    return {
        "sucesso": True,
        "mensagem": f"Parabéns! +{tarefa.pontos} pontos",
        "novos_pontos": stats.pontos if stats else 0,
        "nivel": stats.nivel if stats else "Eco Iniciante",
        "novo_nivel": novo_nivel,
        "streak": stats.streak_atual if stats else 1,
    }, None


def desmarcar_tarefa(user_id: int, tarefa_id: int):
    tarefa_usuario = TarefaUsuario.query.filter_by(user_id=user_id, tarefa_id=tarefa_id).first()
    if not tarefa_usuario:
        return None, "Tarefa não estava completada"

    tarefa = Tarefa.query.get(tarefa_id)
    db.session.delete(tarefa_usuario)

    stats = UserStats.query.filter_by(user_id=user_id).first()
    if stats and tarefa:
        stats.pontos = max(0, stats.pontos - tarefa.pontos)
        stats.tarefas_completas = max(0, stats.tarefas_completas - 1)
        stats.nivel = calcular_nivel(stats.pontos)

    db.session.commit()

    return {
        "sucesso": True,
        "mensagem": "Tarefa desmarcada",
        "novos_pontos": stats.pontos if stats else 0,
    }, None
