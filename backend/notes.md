# ClaimIQ Backend Notes

## Setup

- Python 3.13.2 (Mac M4)
- Virtual env created using alias `python-env`
- Flask backend with Celery + Redis + Postgres
- Using SQLAlchemy 2.x and Pydantic v2 for schema validation

## To-Do

1. Implement app factory and config loader
2. Create Claim model
3. Add AI extraction mock module
4. Build Celery tasks
5. Add REST endpoints for:
   - POST /api/claims
   - GET /api/claims
   - `GET /api/claims/<id>`
6. Connect to Next.js frontend
7. Add Docker Compose orchestration
