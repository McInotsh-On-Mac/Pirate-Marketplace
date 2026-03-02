from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class AuthResponse(BaseModel):
    success: bool = True
    message: str = "Login successful."
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    status: str
    provider: str
    login_url_configured: bool
