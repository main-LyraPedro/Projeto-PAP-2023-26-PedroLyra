from ..models.ecoreal import MissaoDiaria, FotoMissao
from ..models.tasks import Tarefa
from ..models.user import UserStats
from ..extensions import db
from .gamification_service import calcular_nivel
from datetime import date, timedelta, datetime
import os
import random
from werkzeug.utils import secure_filename
from flask import current_app


def gerar_missao_do_dia() -> MissaoDiaria | None:
    """Cria a missão do dia se ainda não existe."""
    hoje = date.today()
    missao = MissaoDiaria.query.filter_by(data=hoje).first()
    if missao:
        return missao

    tarefas = Tarefa.query.filter_by(categoria='daily').all()
    if not tarefas:
        return None

    nova = MissaoDiaria(data=hoje, tarefa_id=random.choice(tarefas).id)
    db.session.add(nova)
    db.session.commit()
    return nova


def get_missao_do_dia() -> dict | None:
    missao = gerar_missao_do_dia()
    if not missao:
        return None

    tarefa = Tarefa.query.get(missao.tarefa_id)
    return {
        "id": missao.id,
        "data": missao.data.isoformat(),
        "tarefa": {
            "id": tarefa.id,
            "titulo": tarefa.titulo,
            "descricao": tarefa.descricao,
            "pontos": tarefa.pontos,
            "icone": tarefa.icone,
        },
    }


def get_ecoreal_status(user_id: int) -> dict:
    hoje = date.today()
    missao_hoje = MissaoDiaria.query.filter_by(data=hoje).first() or gerar_missao_do_dia()

    foto_enviada = FotoMissao.query.filter_by(
        user_id=user_id, missao_id=missao_hoje.id
    ).first()

    stats = UserStats.query.filter_by(user_id=user_id).first()
    return {
        "completada": foto_enviada is not None,
        "streak": stats.streak_atual if stats else 0,
        "ultima_missao": stats.ultima_missao.isoformat() if stats and stats.ultima_missao else None,
    }


def upload_foto_missao(user_id: int, file):
    """Processa upload de foto. Devolve (resultado_dict, None) ou (None, mensagem_erro)."""
    allowed = current_app.config['ALLOWED_EXTENSIONS']

    def _allowed(fname):
        return '.' in fname and fname.rsplit('.', 1)[1].lower() in allowed

    if not _allowed(file.filename):
        return None, "Tipo de arquivo não permitido"

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = secure_filename(f"user_{user_id}_{timestamp}_{file.filename}")
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    hoje = date.today()
    missao_hoje = MissaoDiaria.query.filter_by(data=hoje).first() or gerar_missao_do_dia()

    if FotoMissao.query.filter_by(user_id=user_id, missao_id=missao_hoje.id).first():
        return None, "Você já completou a missão de hoje!"

    db.session.add(FotoMissao(user_id=user_id, missao_id=missao_hoje.id, filename=filename))

    tarefa = Tarefa.query.get(missao_hoje.tarefa_id)
    pontos_bonus = tarefa.pontos * 2

    stats = UserStats.query.filter_by(user_id=user_id).first()
    if stats:
        stats.pontos += pontos_bonus
        stats.tarefas_completas += 1
        # Streak (lógica idêntica ao original)
        if stats.ultima_missao == hoje - timedelta(days=1):
            stats.streak_atual += 1
        elif stats.ultima_missao != hoje:
            stats.streak_atual = 1
        stats.ultima_missao = hoje
        stats.nivel = calcular_nivel(stats.pontos)

    db.session.commit()

    return {
        "sucesso": True,
        "mensagem": f"Missão completada! +{pontos_bonus} pontos (bônus x2) 🔥",
        "filename": filename,
        "pontos_ganhos": pontos_bonus,
        "streak": stats.streak_atual if stats else 1,
    }, None


def get_feed_ecoreal(user_id: int) -> list:
    from ..models.friends import Amizade
    from ..models.user import Usuario

    amizades = Amizade.query.filter(
        ((Amizade.user_id == user_id) | (Amizade.friend_id == user_id))
        & (Amizade.status == "aceito")
    ).all()

    amigos_ids = [a.friend_id if a.user_id == user_id else a.user_id for a in amizades]
    amigos_ids.append(user_id)

    fotos = (
        FotoMissao.query.filter(FotoMissao.user_id.in_(amigos_ids))
        .order_by(FotoMissao.enviada_em.desc())
        .limit(50)
        .all()
    )

    feed = []
    for foto in fotos:
        usuario = Usuario.query.get(foto.user_id)
        missao = MissaoDiaria.query.get(foto.missao_id)
        tarefa = Tarefa.query.get(missao.tarefa_id)
        feed.append({
            "id": foto.id,
            "usuario": {"id": usuario.id, "nome": usuario.nome},
            "tarefa": {"titulo": tarefa.titulo, "pontos": tarefa.pontos},
            "foto_url": f"/api/ecoreal/imagem/{foto.filename}",
            "enviada_em": foto.enviada_em.isoformat(),
            "data_missao": missao.data.isoformat(),
        })

    return feed
