# Pirate Marketplace FastAPI Backend

## Install

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Configure

```bash
cp .env.example .env
```

Set `SUPABASE_ANON_KEY` in `backend/.env`.

The Supabase project URL is already set to:

`https://avebyhsqudvbdaoubttc.supabase.co`

## Run

```bash
cd backend
uvicorn app.main:app --reload
```

The login endpoint is `POST /api/auth/login`.

Example request body:

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Successful responses include `success: true`. Invalid credentials return HTTP `401`.
