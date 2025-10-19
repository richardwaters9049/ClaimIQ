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

    # --- Environment ---
    ENVIRONMENT: str = Field(default="development", description="Runtime environment (development|production)")
    DEBUG: bool = Field(default=False, description="Debug mode")
    SECRET_KEY: str = Field(
        ...,  # Required in production
        description="Flask secret key for sessions and signing"
    )

    # --- JWT ---
    JWT_SECRET_KEY: str = Field(..., description="Secret used to sign JWT tokens")

    # --- Database ---
    PGUSER: str = Field(..., description="PostgreSQL username")
    PGPASSWORD: str = Field(..., description="PostgreSQL password")
    PGDATABASE: str = Field(..., description="Database name")
    PGHOST: str = Field(default="localhost", description="Database host")
    PGPORT: int = Field(default=5432, description="Database port")
    DATABASE_URL: str | None = Field(
        default=None,
        description="Database URL. If not provided, it will be constructed from PG* variables"
    )

    @property
    def sqlalchemy_database_url(self) -> str:
        """Get the database URL for SQLAlchemy."""
        if self.DATABASE_URL:
            return self.DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://") if self.DATABASE_URL.startswith("postgresql://") else self.DATABASE_URL
        return f"postgresql+psycopg2://{self.PGUSER}:{self.PGPASSWORD}@{self.PGHOST}:{self.PGPORT}/{self.PGDATABASE}"

    # --- Celery / Redis ---
    CELERY_BROKER_URL: RedisDsn = Field(default="redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: RedisDsn = Field(default="redis://localhost:6379/0")

    # --- Security / rate limiting ---
    RATELIMIT_DEFAULT: str = Field(
        default="1000 per day;100 per hour" if ENVIRONMENT == "production" else "1000 per day;100 per hour",
        description="Default rate limits (production has stricter limits)"
    )
    RATELIMIT_STORAGE_URI: str | None = Field(
        default=None,
        description="Redis URL for rate limiting storage (e.g., redis://localhost:6379/1)"
    )
    
    # --- Security Headers ---
    SECURE_HEADERS: bool = Field(
        default=ENVIRONMENT == "production",
        description="Enable security headers in production"
    )
    CORS_ORIGINS: str = Field(
        default="*" if ENVIRONMENT == "development" else "https://yourdomain.com",
        description="Allowed CORS origins"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instantiate once so it can be imported elsewhere
settings = Settings()
