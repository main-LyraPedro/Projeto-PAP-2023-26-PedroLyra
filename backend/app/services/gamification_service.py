from datetime import date, timedelta


def calcular_nivel(pontos: int) -> str:
    """Retorna o nível baseado nos pontos (idêntico ao original)."""
    if pontos < 500:
        return "Eco Iniciante"
    elif pontos < 1000:
        return "Guardião Verde"
    elif pontos < 2000:
        return "Defensor Verde"
    else:
        return "Eco Master"


def atualizar_streak(stats) -> None:
    """Atualiza streak e dias_ativos no objeto UserStats."""
    hoje = date.today()
    if stats.ultima_missao is None:
        stats.streak_atual = 1
    elif stats.ultima_missao == hoje:
        pass  # Já completou hoje, streak não muda
    elif stats.ultima_missao == hoje - timedelta(days=1):
        stats.streak_atual += 1  # Dia consecutivo!
    else:
        stats.streak_atual = 1  # Quebrou a sequência, recomeça
    stats.ultima_missao = hoje
    stats.dias_ativos += 1


def adicionar_pontos(stats, pontos: int) -> str | None:
    """Adiciona pontos, atualiza nível e devolve novo nível se houve subida."""
    nivel_anterior = stats.nivel
    stats.pontos += pontos
    stats.nivel = calcular_nivel(stats.pontos)
    return stats.nivel if stats.nivel != nivel_anterior else None
