from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import plaid, insights


def create_app():
    app = FastAPI(title="Finance Tracker API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(plaid.router, prefix="/plaid")
    app.include_router(insights.router, prefix="/insights")

    return app
