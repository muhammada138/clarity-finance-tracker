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
**AI:** Claude (Anthropic) or OpenAI, depending on what you configure

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

You'll need a Plaid account (sandbox is free) and either an Anthropic or OpenAI API key.

## Status

Still a work in progress. Core scaffolding is in place, wiring everything up next.
