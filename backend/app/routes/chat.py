from flask import Blueprint, request, jsonify

chat_bp = Blueprint('chat', __name__)

RESPOSTAS = {
    'ola': 'Olá! 🌱 Sou o EcoBot, o teu assistente para um planeta mais verde. Em que posso ajudar?',
    'olá': 'Olá! 🌱 Sou o EcoBot, o teu assistente para um planeta mais verde. Em que posso ajudar?',
    'oi': 'Oi! 🌿 Como posso ajudar-te hoje a ser mais sustentável?',
    'bom dia': 'Bom dia! ☀️ Que tal começares o dia com uma ação sustentável?',
    'boa tarde': 'Boa tarde! 🌍 Hoje praticaste algum hábito sustentável?',
    'boa noite': 'Boa noite! 🌙 Lembra-te de desligar todas as luzes antes de dormir.',
    'agua': '💧 Dicas para poupar água:\n• Toma banhos de menos de 5 minutos\n• Fecha a torneira enquanto te ensaboas\n• Usa a máquina de lavar só quando estiver cheia\n• Recolhe água da chuva para regar plantas',
    'água': '💧 Dicas para poupar água:\n• Toma banhos de menos de 5 minutos\n• Fecha a torneira enquanto te ensaboas\n• Usa a máquina de lavar só quando estiver cheia\n• Recolhe água da chuva para regar plantas',
    'banho': '🚿 Um banho de 5 minutos usa cerca de 40L de água. Reduzir o tempo de banho é uma das ações mais impactantes!',
    'torneira': '🚰 Deixar a torneira aberta enquanto lavas os dentes desperdiça até 12L por minuto. Fecha sempre!',
    'energia': '💡 Dicas para poupar energia:\n• Usa lâmpadas LED (usam 80% menos energia)\n• Desliga aparelhos da tomada quando não os usas\n• Aproveita a luz natural durante o dia\n• Usa a máquina de lavar a baixa temperatura',
    'eletricidade': '⚡ Em modo standby os aparelhos chegam a consumir 10% da energia da casa. Desliga sempre da tomada!',
    'led': '💡 Lâmpadas LED consomem 80% menos energia e duram 25x mais. Vale muito a pena trocar!',
    'solar': '☀️ Painéis solares podem reduzir a conta de eletricidade em até 70%. É uma das melhores apostas para o futuro!',
    'recicla': '♻️ Como reciclar:\n• Azul → papel e cartão\n• Amarelo → plástico e metal\n• Verde → vidro\n• Castanho → orgânicos\nLimpa as embalagens antes de reciclar!',
    'reciclar': '♻️ Como reciclar:\n• Azul → papel e cartão\n• Amarelo → plástico e metal\n• Verde → vidro\n• Castanho → orgânicos\nLimpa as embalagens antes de reciclar!',
    'reciclagem': '♻️ Em Portugal, cada pessoa produz cerca de 500kg de lixo por ano. Separar corretamente pode recuperar até 70% desses materiais!',
    'lixo': '🗑️ Separa o teu lixo! Orgânico, reciclável e não reciclável têm destinos muito diferentes.',
    'plastico': '🚫 O plástico demora entre 100 a 1000 anos a degradar-se. Prefere sempre alternativas reutilizáveis!',
    'plástico': '🚫 O plástico demora entre 100 a 1000 anos a degradar-se. Prefere sempre alternativas reutilizáveis!',
    'carro': '🚗 Considera:\n• Transporte público\n• Bicicleta para curtas distâncias\n• Partilha de carro (carpooling)\n• Caminhar! Os transportes causam 25% das emissões de CO2.',
    'bicicleta': '🚴 A bicicleta é das mais sustentáveis! Além de não poluir, faz bem à saúde. Para distâncias até 5-6km é quase sempre a melhor opção.',
    'transporte': '🚌 O transporte público em vez do carro pode reduzir a tua pegada de carbono em até 70% nessa viagem!',
    'carne': '🥩 Produzir 1kg de carne de vaca emite 27kg de CO2 e usa 15.000L de água. Reduzir o consumo é muito impactante!',
    'vegetariano': '🥗 Uma alimentação com menos carne reduz significativamente a tua pegada ecológica. Experimenta 1 ou 2 dias sem carne!',
    'comida': '🥦 Prefere produtos locais e sazonais, reduz a carne vermelha e evita o desperdício alimentar.',
    'desperdicio': '🍎 Em Portugal desperdiçamos cerca de 1 milhão de toneladas de alimentos por ano. Planeia as refeições!',
    'desperdício': '🍎 Em Portugal desperdiçamos cerca de 1 milhão de toneladas de alimentos por ano. Planeia as refeições!',
    'arvore': '🌳 Plantar árvores é uma das formas mais diretas de combater as alterações climáticas. Uma árvore adulta absorve ~22kg de CO2 por ano!',
    'árvore': '🌳 Plantar árvores é uma das formas mais diretas de combater as alterações climáticas. Uma árvore adulta absorve ~22kg de CO2 por ano!',
    'oceano': '🌊 Os oceanos absorvem 30% do CO2 e produzem metade do oxigénio que respiramos. Reduzir o plástico é essencial!',
    'sustentabilidade': '🌍 Sustentabilidade é viver de forma a não comprometer os recursos das gerações futuras. Pequenas ações têm impacto enorme!',
    'co2': '🏭 Para reduzir o CO2: viaja menos de avião, come menos carne e opta por energia renovável.',
    'clima': '🌡️ A temperatura média global subiu 1.1 graus desde a era pré-industrial. Cada décima de grau importa!',
    'default': '🌍 Estou aqui para te ajudar! Podes perguntar sobre:\n• 💧 Água\n• ⚡ Energia\n• ♻️ Reciclagem\n• 🚴 Transportes\n• 🥗 Alimentação\n• 🌳 Natureza',
}


@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    mensagem = data.get('message', '').lower()

    for chave, resposta in RESPOSTAS.items():
        if chave != 'default' and chave in mensagem:
            return jsonify({"response": resposta})

    return jsonify({"response": RESPOSTAS['default']})
