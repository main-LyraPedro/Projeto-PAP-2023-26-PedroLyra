from flask import Blueprint, request, jsonify, send_from_directory, current_app
from ..services.feed_service import criar_post, get_feed, toggle_like, get_comments, add_comment

feed_bp = Blueprint('feed', __name__)


@feed_bp.route('/api/posts', methods=['POST'])
def criar_publicacao():
    user_id = None
    descricao = None
    categoria = 'geral'
    imagem_file = None

    if request.content_type and 'multipart' in request.content_type:
        user_id = request.form.get('user_id')
        descricao = request.form.get('descricao')
        categoria = request.form.get('categoria', 'geral')
        if 'imagem' in request.files:
            imagem_file = request.files['imagem']
    else:
        data = request.get_json()
        user_id = data.get('user_id')
        descricao = data.get('descricao')
        categoria = data.get('categoria', 'geral')

    if not user_id or not descricao:
        return jsonify({"erro": "user_id e descricao são obrigatórios"}), 400

    nova_pub, usuario = criar_post(user_id, descricao, categoria, imagem_file)

    return jsonify({
        "sucesso": True,
        "mensagem": "Publicação criada! +5 pontos 🌱",
        "post": {
            "id": nova_pub.id,
            "descricao": nova_pub.descricao,
            "categoria": nova_pub.categoria,
            "imagem_url": f"/api/uploads/{nova_pub.imagem}" if nova_pub.imagem else None,
            "criada_em": nova_pub.criada_em.isoformat(),
            "usuario": {"id": usuario.id, "nome": usuario.nome},
            "likes": 0,
            "comentarios": 0,
            "user_liked": False,
        }
    }), 201


@feed_bp.route('/api/feed/<int:user_id>', methods=['GET'])
def get_feed_route(user_id):
    return jsonify(get_feed(user_id))


@feed_bp.route('/api/posts/<int:post_id>/like', methods=['POST'])
def toggle_like_route(post_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"erro": "user_id é obrigatório"}), 400

    acao, likes = toggle_like(post_id, user_id)
    return jsonify({"sucesso": True, "acao": acao, "likes": likes})


@feed_bp.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments_route(post_id):
    return jsonify(get_comments(post_id))


@feed_bp.route('/api/posts/<int:post_id>/comments', methods=['POST'])
def add_comment_route(post_id):
    data = request.get_json()
    user_id = data.get('user_id')
    texto = data.get('texto')
    if not user_id or not texto:
        return jsonify({"erro": "Dados insuficientes"}), 400

    comentario, usuario = add_comment(post_id, user_id, texto)
    return jsonify({
        "sucesso": True,
        "comentario": {
            "id": comentario.id,
            "texto": comentario.texto,
            "criada_em": comentario.criada_em.isoformat(),
            "usuario": {"id": usuario.id, "nome": usuario.nome},
        }
    })


@feed_bp.route('/api/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
