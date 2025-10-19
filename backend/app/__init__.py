"""
app/__init__.py

Application factory pattern for ClaimIQ.
Initialises Flask, extensions (SQLAlchemy, JWT, CORS, Limiter, Celery),
and registers blueprints.
"""

from flask import Flask, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from werkzeug.middleware.proxy_fix import ProxyFix
from celery import Celery
import logging
from .config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == 'production' else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

# Configure rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[settings.RATELIMIT_DEFAULT],
    storage_uri=settings.RATELIMIT_STORAGE_URI or 'memory://',
    strategy='fixed-window' if settings.ENVIRONMENT == 'production' else 'fixed-window'
)

# Initialize Celery
celery = Celery(
    __name__,
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)


def create_app() -> Flask:
    """Factory function that creates and configures the Flask app."""
    app = Flask(__name__)
    
    # Configure Flask app
    app.config.from_mapping(
        SECRET_KEY=settings.SECRET_KEY,
        JWT_SECRET_KEY=settings.JWT_SECRET_KEY,
        SQLALCHEMY_DATABASE_URI=settings.sqlalchemy_database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ENGINE_OPTIONS={
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'pool_size': 20,
            'max_overflow': 10,
        },
        PROPAGATE_EXCEPTIONS=True,  # Let Flask-RESTPlus handle exceptions
        JSON_SORT_KEYS=False,  # Keep API responses in the order we define them
    )

    # Security headers
    if settings.SECURE_HEADERS:
        Talisman(
            app,
            force_https=settings.ENVIRONMENT == 'production',
            strict_transport_security=True,
            session_cookie_secure=True,
            content_security_policy={
                'default-src': "'self'",
                'script-src': [
                    "'self'",
                    "'unsafe-inline'",
                    "cdn.jsdelivr.net"
                ],
                'style-src': [
                    "'self'",
                    "'unsafe-inline'",
                    "fonts.googleapis.com"
                ],
                'font-src': [
                    "'self'",
                    "fonts.gstatic.com"
                ],
                'img-src': [
                    "'self'",
                    "data:"
                ]
            }
        )

    # Trust the X-Forwarded-* headers from the proxy
    if settings.ENVIRONMENT == 'production':
        app.wsgi_app = ProxyFix(
            app.wsgi_app,
            x_for=1,
            x_proto=1,
            x_host=1,
            x_prefix=1
        )

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": settings.CORS_ORIGINS.split(',')
            }
        },
        supports_credentials=True
    )
    
    # Initialize rate limiting
    limiter.init_app(app)
    
    # Configure Celery
    celery.conf.update(
        broker_url=settings.CELERY_BROKER_URL,
        result_backend=settings.CELERY_RESULT_BACKEND,
        task_serializer='json',
        result_serializer='json',
        accept_content=['json'],
        timezone='UTC',
        enable_utc=True,
        task_track_started=True,
        task_time_limit=30 * 60,  # 30 minutes
        task_soft_time_limit=25 * 60,  # 25 minutes
        worker_max_tasks_per_child=100,  # Recycle workers after 100 tasks
        worker_prefetch_multiplier=1,  # Fair task distribution
    )

    # Register blueprints
    from .main import main_bp
    app.register_blueprint(main_bp)

    # Root URL redirects to API docs or health check
    @app.route('/')
    def index():
        return redirect(url_for('main.api_root'))

    # Health check endpoint
    @app.route('/health')
    @limiter.exempt
    def health():
        """Health check endpoint for load balancers and monitoring."""
        return {
            'status': 'ok',
            'environment': settings.ENVIRONMENT,
            'debug': settings.DEBUG
        }, 200

    # Request logging
    @app.after_request
    def log_request(response):
        if request.path != '/health':  # Don't log health checks
            logger.info(
                '%s %s %s %s %s',
                request.remote_addr,
                request.method,
                request.scheme,
                request.full_path,
                response.status_code
            )
        return response

    return app
