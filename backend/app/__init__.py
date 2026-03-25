import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import plaid, insights


def create_app():
    app = FastAPI(title="Finance Tracker API")

    origins = ["http://localhost:5173"]
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url:
        origins.append(frontend_url)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(plaid.router, prefix="/plaid")
    app.include_router(insights.router, prefix="/insights")

    return app
