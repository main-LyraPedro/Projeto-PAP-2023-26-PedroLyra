from flask import Blueprint, request, jsonify
from ..services.tasks_service import get_user_tasks, completar_tarefa, desmarcar_tarefa
from ..models.tasks import Tarefa

tasks_bp = Blueprint('tasks', __name__)


@tasks_bp.route('/api/tasks', methods=['GET'])
def get_tasks():
    tarefas = Tarefa.query.all()
    return jsonify([{
        "id": t.id, "titulo": t.titulo, "descricao": t.descricao,
        "pontos": t.pontos, "categoria": t.categoria, "icone": t.icone,
    } for t in tarefas])


@tasks_bp.route('/api/tasks/user/<int:user_id>', methods=['GET'])
def get_user_tasks_route(user_id):
    return jsonify(get_user_tasks(user_id))


@tasks_bp.route('/api/tasks/complete', methods=['POST'])
def complete_task():
    data = request.get_json()
    user_id = data.get('user_id')
    tarefa_id = data.get('tarefa_id')

    if not user_id or not tarefa_id:
        return jsonify({"erro": "Dados insuficientes"}), 400

    resultado, erro = completar_tarefa(user_id, tarefa_id)

    if erro:
        status = 404 if "não encontrada" in erro else 400
        return jsonify({"erro": erro}), status

    return jsonify(resultado)


@tasks_bp.route('/api/tasks/uncomplete', methods=['POST'])
def uncomplete_task():
    data = request.get_json()
    user_id = data.get('user_id')
    tarefa_id = data.get('tarefa_id')

    if not user_id or not tarefa_id:
        return jsonify({"erro": "Dados insuficientes"}), 400

    resultado, erro = desmarcar_tarefa(user_id, tarefa_id)

    if erro:
        return jsonify({"erro": erro}), 404

    return jsonify(resultado)
