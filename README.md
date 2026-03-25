# AI-Powered Personal Finance Tracker

A personal finance app that connects to your bank through Plaid and uses an LLM to categorize transactions and surface spending insights.

## What it does

- Links your bank account using Plaid Link
- Pulls and displays your recent transactions
- Uses AI to categorize spending and give you a breakdown of where your money is going
- Shows a simple dashboard with charts and a chat-style insights panel

## Tech stack

**Frontend:** React + Vite
**Backend:** FastAPI (Python)
**Bank data:** Plaid API
**AI:** Groq (llama-3.3-70b-versatile)

## Project layout

```
frontend/   React app
backend/    FastAPI server
```

## Getting started

1. Copy `.env.example` to `.env` and fill in your API keys
2. Install frontend deps: `cd frontend && npm install`
3. Install backend deps: `cd backend && pip install -r requirements.txt`
4. Start the backend: `cd backend && python main.py`
5. Start the frontend: `cd frontend && npm run dev`

You'll need a Plaid account (sandbox is free) and a Groq API key.

## Status

Core features are working. Plaid sandbox connection, transaction categorization, spending chart, and chat are all live.
