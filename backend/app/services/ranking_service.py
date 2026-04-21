from ..models.user import Usuario, UserStats


def get_ranking() -> list:
    usuarios = Usuario.query.all()

    ranking = []
    for usuario in usuarios:
        stats = UserStats.query.filter_by(user_id=usuario.id).first()
        if stats:
            ranking.append({
                "id": usuario.id,
                "nome": usuario.nome,
                "pontos": stats.pontos,
                "nivel": stats.nivel,
                "tarefas_completas": stats.tarefas_completas,
            })

    ranking.sort(key=lambda x: x['pontos'], reverse=True)

    for i, user in enumerate(ranking):
        user['posicao'] = i + 1

    return ranking
