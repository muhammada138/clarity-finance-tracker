import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import plaid, insights


def create_app():
    app = FastAPI(title="Finance Tracker API")

    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://clarity-finance-tracker.vercel.app",
        "https://clarity-finance-tracker.netlify.app",
    ]
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url and frontend_url not in origins:
        origins.append(frontend_url)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"http://localhost:\d+",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(plaid.router, prefix="/plaid")
    app.include_router(insights.router, prefix="/insights")

    return app
