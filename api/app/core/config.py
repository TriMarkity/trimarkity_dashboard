from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "mongodb+srv://3adityakukade:Xm26yGrRSB9egNfZ@trimarkity.hnbz1fk.mongodb.net/"
    MONGO_DB_NAME: str = "trimarkity"
    
    # JWT
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours for better UX
    
    # App
    DEBUG: bool = True
    APP_NAME: str = "Marketing Dashboard"
    
    class Config:
        env_file = ".env"

settings = Settings()
