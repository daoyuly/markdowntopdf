from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """应用配置类"""
    
    # 应用基本信息
    app_name: str = "Markdown转PDF API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # 数据库配置
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./markdown_to_pdf.db")
    
    # JWT配置
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # 安全配置
    bcrypt_rounds: int = 12
    
    # 文件上传配置
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [".md", ".txt"]
    
    # 会员配置
    free_user_document_limit: int = 5
    free_user_conversion_limit: int = 10
    
    # CORS配置
    cors_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# 创建全局配置实例
settings = Settings() 