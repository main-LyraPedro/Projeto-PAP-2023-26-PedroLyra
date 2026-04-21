import os
from flask import Flask
from .config import Config
from .extensions import db, cors


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Garantir que a pasta de uploads existe
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # ── Extensions ────────────────────────────────────────────────
    db.init_app(app)
    cors.init_app(app, supports_credentials=True)

    # ── Blueprints ────────────────────────────────────────────────
    from .routes.auth import auth_bp
    from .routes.feed import feed_bp
    from .routes.friends import friends_bp
    from .routes.tasks import tasks_bp
    from .routes.ranking import ranking_bp
    from .routes.profile import profile_bp
    from .routes.ecoreal import ecoreal_bp
    from .routes.chat import chat_bp
    from .routes.stats import stats_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(feed_bp)
    app.register_blueprint(friends_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(ranking_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(ecoreal_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(stats_bp)

    # ── Error handlers ────────────────────────────────────────────
    from .errors import register_error_handlers
    register_error_handlers(app)

    # ── DB + seed ─────────────────────────────────────────────────
    with app.app_context():
        from .models import init_db
        init_db()

    return app
