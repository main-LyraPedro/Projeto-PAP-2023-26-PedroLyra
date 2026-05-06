from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO

# Instâncias globais — inicializadas em create_app()
db = SQLAlchemy()
cors = CORS()
socketio = SocketIO()
