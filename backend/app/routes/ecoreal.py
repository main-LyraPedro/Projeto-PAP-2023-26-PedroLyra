from flask import Blueprint, request, jsonify, send_from_directory, current_app
from ..services.ecoreal_service import (
    get_missao_do_dia, get_ecoreal_status, upload_foto_missao, get_feed_ecoreal
)

ecoreal_bp = Blueprint('ecoreal', __name__)


@ecoreal_bp.route('/api/ecoreal/missao-do-dia', methods=['GET'])
def missao_do_dia():
    missao = get_missao_do_dia()
    if not missao:
        return jsonify({"erro": "Nenhuma tarefa disponível"}), 404
    return jsonify(missao)


@ecoreal_bp.route('/api/ecoreal/status/<int:user_id>', methods=['GET'])
def ecoreal_status(user_id):
    return jsonify(get_ecoreal_status(user_id))


@ecoreal_bp.route('/api/ecoreal/upload', methods=['POST'])
def upload_missao():
    if 'foto' not in request.files:
        return jsonify({"erro": "Nenhuma foto enviada"}), 400

    file = request.files['foto']
    user_id = request.form.get('user_id')

    if not user_id:
        return jsonify({"erro": "ID do usuário é obrigatório"}), 400

    if file.filename == '':
        return jsonify({"erro": "Arquivo vazio"}), 400

    resultado, erro = upload_foto_missao(int(user_id), file)

    if erro:
        return jsonify({"erro": erro}), 400

    return jsonify(resultado)


@ecoreal_bp.route('/api/ecoreal/feed/<int:user_id>', methods=['GET'])
def feed_ecoreal(user_id):
    return jsonify(get_feed_ecoreal(user_id))


@ecoreal_bp.route('/api/ecoreal/imagem/<filename>', methods=['GET'])
def get_imagem(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
