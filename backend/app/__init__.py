from fastapi import FastAPI
from app.routes import plaid, insights


def create_app():
    app = FastAPI(title="Finance Tracker API")

    app.include_router(plaid.router, prefix="/plaid")
    app.include_router(insights.router, prefix="/insights")

    return app
