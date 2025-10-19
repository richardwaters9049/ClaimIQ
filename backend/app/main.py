"""
app/main.py

Primary Flask blueprint for ClaimIQ.
Contains example routes to verify backend operation.
"""

from flask import Blueprint, jsonify

# Create blueprint instance with url_prefix
main_bp = Blueprint("main", __name__, url_prefix="/api")


@main_bp.route("/")
def api_root():
    """
    Basic route to verify the backend is running and responding.
    Returns a simple JSON payload.
    """
    return jsonify({"message": "ClaimIQ API is online"}), 200
