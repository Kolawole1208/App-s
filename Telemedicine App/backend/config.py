import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'telemedicine-secret-key-2024'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:password@localhost/telemedicine_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-2024'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # HIPAA Compliance Settings
    SESSION_TIMEOUT = 900  # 15 minutes
    MAX_LOGIN_ATTEMPTS = 5