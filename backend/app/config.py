import os

# basedir = backend/
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


class Config:
    SECRET_KEY = 'ecochat-pap-2026-pedro-lyra-secret-key'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'ecochat.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
