from flask import Blueprint, jsonify
from ..services.ranking_service import get_ranking

ranking_bp = Blueprint('ranking', __name__)


@ranking_bp.route('/api/ranking', methods=['GET'])
def get_ranking_route():
    return jsonify(get_ranking())
