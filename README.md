# Pirate Marketplace

This repo now contains:

- `pirate-marketplace/`: the React frontend
- `backend/`: the FastAPI auth backend

## Frontend

```bash
cd pirate-marketplace
cp .env.example .env
npm install
npm start
```

## Backend

```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Configure `backend/.env` with your Supabase `anon` key before logging in. The Supabase URL is already set to `https://avebyhsqudvbdaoubttc.supabase.co`.
