from __future__ import annotations

from typing import Any, Dict

import httpx
from fastapi import HTTPException, status

from app.config import Settings
from app.models import LoginRequest


class AuthService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def login(self, credentials: LoginRequest) -> Dict[str, Any]:
        if not self.settings.login_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="SUPABASE_URL is not configured on the backend.",
            )

        url = self.settings.login_url
        headers = self._build_headers()
        payload = self._build_payload(credentials)

        async with httpx.AsyncClient(
            timeout=self.settings.request_timeout_seconds
        ) as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
            except httpx.TimeoutException as exc:
                raise HTTPException(
                    status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                    detail="Timed out while contacting the auth provider.",
                ) from exc
            except httpx.RequestError as exc:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Unable to reach the auth provider: {exc}",
                ) from exc

        if response.status_code in {status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN}:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=self._extract_error_message(response) or "Invalid email or password.",
            )

        if response.is_error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=self._extract_error_message(response)
                or "Authentication provider returned an unexpected error.",
            )

        data = self._parse_json(response)
        return self._normalize_payload(data)

    def _build_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}

        if self.settings.auth_provider == "supabase":
            if not self.settings.supabase_anon_key:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="SUPABASE_ANON_KEY is required when AUTH_PROVIDER=supabase.",
                )

            headers["apikey"] = self.settings.supabase_anon_key
            headers["Authorization"] = f"Bearer {self.settings.supabase_anon_key}"
            return headers

        if self.settings.db_api_key:
            headers[self.settings.db_api_key_header] = self.settings.db_api_key

        if self.settings.db_bearer_token:
            headers["Authorization"] = f"Bearer {self.settings.db_bearer_token}"

        return headers

    def _build_payload(self, credentials: LoginRequest) -> Dict[str, str]:
        return {
            self.settings.db_email_field: credentials.email,
            self.settings.db_password_field: credentials.password,
        }

    def _parse_json(self, response: httpx.Response) -> Dict[str, Any]:
        try:
            data = response.json()
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Authentication provider returned a non-JSON response.",
            ) from exc

        if not isinstance(data, dict):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Authentication provider returned an unexpected payload.",
            )

        return data

    def _extract_error_message(self, response: httpx.Response) -> str | None:
        try:
            payload = response.json()
        except ValueError:
            return response.text.strip() or None

        if not isinstance(payload, dict):
            return None

        for key in ("detail", "message", "error_description", "error"):
            value = payload.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

        return None

    def _normalize_payload(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        nested_payload = payload.get("data") if isinstance(payload.get("data"), dict) else {}

        access_token = (
            payload.get("access_token")
            or payload.get("token")
            or nested_payload.get("access_token")
            or nested_payload.get("token")
        )
        refresh_token = payload.get("refresh_token") or nested_payload.get("refresh_token")
        token_type = payload.get("token_type") or nested_payload.get("token_type") or "bearer"
        user = payload.get("user") or nested_payload.get("user") or self._extract_user(payload)

        return {
            "success": True,
            "message": "Login successful.",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": token_type,
            "user": user,
        }

    def _extract_user(self, payload: Dict[str, Any]) -> Dict[str, Any] | None:
        user = {}

        for key in ("id", "email", "name", "username"):
            value = payload.get(key)
            if value is not None:
                user[key] = value

        return user or None
