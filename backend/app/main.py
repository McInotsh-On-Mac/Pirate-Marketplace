from __future__ import annotations

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings, get_settings
from app.models import AuthResponse, HealthResponse, LoginRequest
from app.services.auth import AuthService

app = FastAPI(title="Pirate Marketplace API", version="0.1.0")

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or [settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_auth_service(
    current_settings: Settings = Depends(get_settings),
) -> AuthService:
    return AuthService(current_settings)


@app.get("/", response_model=HealthResponse)
async def root(
    current_settings: Settings = Depends(get_settings),
) -> HealthResponse:
    return HealthResponse(
        status="ok",
        provider=current_settings.auth_provider,
        login_url_configured=bool(current_settings.login_url),
    )


@app.get("/api/health", response_model=HealthResponse)
async def health_check(
    current_settings: Settings = Depends(get_settings),
) -> HealthResponse:
    return HealthResponse(
        status="ok",
        provider=current_settings.auth_provider,
        login_url_configured=bool(current_settings.login_url),
    )


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    return AuthResponse(**(await auth_service.login(payload)))
