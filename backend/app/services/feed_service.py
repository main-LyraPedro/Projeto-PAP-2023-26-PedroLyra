from ..models.social import Publicacao, Like, Comentario
from ..models.user import Usuario, UserStats
from ..models.friends import Amizade
from ..extensions import db
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from flask import current_app


def _allowed_file(filename: str) -> bool:
    return (
        '.' in filename
        and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
    )


def criar_post(user_id, descricao: str, categoria: str = 'geral', imagem_file=None):
    """Cria publicação, adiciona +5 pontos. Devolve (Publicacao, Usuario)."""
    imagem_filename = None

    if imagem_file and imagem_file.filename and _allowed_file(imagem_file.filename):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = secure_filename(f"post_{user_id}_{timestamp}_{imagem_file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        imagem_file.save(filepath)
        imagem_filename = filename

    nova_pub = Publicacao(
        user_id=int(user_id),
        descricao=descricao,
        categoria=categoria,
        imagem=imagem_filename
    )
    db.session.add(nova_pub)

    stats = UserStats.query.filter_by(user_id=int(user_id)).first()
    if stats:
        stats.pontos += 5  # igual ao original — sem recalcular nível

    db.session.commit()

    usuario = Usuario.query.get(int(user_id))
    return nova_pub, usuario


def get_feed(user_id: int) -> list:
    """Devolve o feed do utilizador (posts próprios + amigos)."""
    amizades = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id))
        & (Amizade.status == "aceito")
    ).all()

    amigos_ids = [user_id]
    for a in amizades:
        amigo_id = a.friend_id if a.user_id == user_id else a.user_id
        amigos_ids.append(amigo_id)

    publicacoes = (
        Publicacao.query.filter(Publicacao.user_id.in_(amigos_ids))
        .order_by(Publicacao.criada_em.desc())
        .limit(50)
        .all()
    )

    feed = []
    for pub in publicacoes:
        usuario = Usuario.query.get(pub.user_id)
        likes_count = Like.query.filter_by(publicacao_id=pub.id).count()
        comentarios_count = Comentario.query.filter_by(publicacao_id=pub.id).count()
        user_liked = Like.query.filter_by(publicacao_id=pub.id, user_id=user_id).first() is not None
        feed.append({
            "id": pub.id,
            "descricao": pub.descricao,
            "categoria": pub.categoria,
            "imagem_url": f"/api/uploads/{pub.imagem}" if pub.imagem else None,
            "criada_em": pub.criada_em.isoformat(),
            "usuario": {"id": usuario.id, "nome": usuario.nome},
            "likes": likes_count,
            "comentarios": comentarios_count,
            "user_liked": user_liked,
        })

    return feed


def toggle_like(post_id: int, user_id: int):
    """Liga/desliga like. Devolve (acao, total_likes)."""
    like_existente = Like.query.filter_by(publicacao_id=post_id, user_id=user_id).first()
    if like_existente:
        db.session.delete(like_existente)
        db.session.commit()
        likes = Like.query.filter_by(publicacao_id=post_id).count()
        return "removido", likes
    else:
        db.session.add(Like(user_id=user_id, publicacao_id=post_id))
        db.session.commit()
        likes = Like.query.filter_by(publicacao_id=post_id).count()
        return "adicionado", likes


def get_comments(post_id: int) -> list:
    comentarios = (
        Comentario.query.filter_by(publicacao_id=post_id)
        .order_by(Comentario.criada_em.asc())
        .all()
    )
    return [
        {
            "id": c.id,
            "texto": c.texto,
            "criada_em": c.criada_em.isoformat(),
            "usuario": {"id": Usuario.query.get(c.user_id).id, "nome": Usuario.query.get(c.user_id).nome},
        }
        for c in comentarios
    ]


def add_comment(post_id: int, user_id: int, texto: str):
    """Adiciona comentário. Devolve (Comentario, Usuario)."""
    novo = Comentario(user_id=user_id, publicacao_id=post_id, texto=texto)
    db.session.add(novo)
    db.session.commit()
    usuario = Usuario.query.get(user_id)
    return novo, usuario
