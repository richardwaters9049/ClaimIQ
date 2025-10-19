"""
app/config.py

Central configuration management for the ClaimIQ backend.
Uses pydantic-settings to load and validate environment variables,
ensuring consistent, type-safe configuration across environments.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, PostgresDsn, RedisDsn


class Settings(BaseSettings):
    """
    Application configuration model.
    Values are read from environment variables defined in .env.
    """

    # --- Flask core ---
    FLASK_ENV: str = Field(default="development", description="Flask environment")
    SECRET_KEY: str = Field(
        ..., description="Flask secret key for sessions and signing"
    )

    # --- JWT ---
    JWT_SECRET_KEY: str = Field(..., description="Secret used to sign JWT tokens")

    # --- Database ---
    PGUSER: str = Field(..., description="PostgreSQL username")
    PGPASSWORD: str = Field(..., description="PostgreSQL password")
    PGDATABASE: str = Field(..., description="Database name")
    PGHOST: str = Field(default="localhost", description="Database host")
    PGPORT: int = Field(default=5432, description="Database port")
    DATABASE_URL: PostgresDsn | None = None

    # --- Celery / Redis ---
    CELERY_BROKER_URL: RedisDsn = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: RedisDsn = Field(default="redis://localhost:6379/0")

    # --- Security / rate limiting ---
    RATELIMIT_DEFAULT: str = Field(default="5 per minute")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instantiate once so it can be imported elsewhere
settings = Settings()
