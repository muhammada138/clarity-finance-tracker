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
        allow_headers=["Content-Type"],
    )

    @app.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    app.include_router(plaid.router, prefix="/plaid")
    app.include_router(insights.router, prefix="/insights")

    return app
