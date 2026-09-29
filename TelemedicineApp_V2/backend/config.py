import os

class Config:
    SECRET_KEY = 'telemedicine-secret-key-2024'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///telemedicine.db'  # Using SQLite for simplicity
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'jwt-secret-key-2024'