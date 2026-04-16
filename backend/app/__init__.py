import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import plaid, insights


def create_app():
    app = FastAPI(title="Finance Tracker API", redirect_slashes=False)

    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://clarity-finance-tracker.vercel.app",
    ]
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url and frontend_url not in origins:
        origins.append(frontend_url)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"http://localhost:(5173|3000)$",
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Accept"],
    )

    app.include_router(plaid.router, prefix="/plaid")
    app.include_router(insights.router, prefix="/insights")

    return app
