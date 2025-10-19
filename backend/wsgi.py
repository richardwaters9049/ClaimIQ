"""
WSGI config for ClaimIQ project.

It exposes the WSGI callable as a module-level variable named `application`.
"""
import os
import eventlet
eventlet.monkey_patch()

from app import create_app

# Set the default settings module for the 'app' program
os.environ.setdefault('FLASK_APP', 'app')

# Create application instance
application = create_app()

if __name__ == "__main__":
    # For local development
    from werkzeug.serving import run_simple
    run_simple('0.0.0.0', 5000, application, use_reloader=True, use_debugger=True)
