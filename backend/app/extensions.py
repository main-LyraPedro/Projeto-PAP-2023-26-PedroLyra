from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Instâncias globais — inicializadas em create_app()
db = SQLAlchemy()
cors = CORS()
