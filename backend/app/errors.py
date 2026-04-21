from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"erro": "Recurso não encontrado"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"erro": "Erro interno do servidor"}), 500

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"erro": "Pedido inválido"}), 400
