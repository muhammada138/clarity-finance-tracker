# Clarity

A personal finance tracker that connects to your bank and uses AI to make sense of your spending. Built with FastAPI, React, Plaid, and Groq.

![screenshot](https://i.imgur.com/placeholder.png)

## Features

- Connect your bank account through Plaid Link
- Automatic AI categorization of every transaction (food, transport, shopping, income, etc.)
- Spending breakdown chart by category
- Stat cards for total spent, income, and top spending category
- Sortable transaction table
- Chat with your finances using a built-in AI assistant
- Switch or disconnect accounts at any time

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Recharts |
| Backend | FastAPI, Python |
| Bank data | Plaid API (sandbox) |
| AI | Groq, llama-3.3-70b-versatile |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Plaid](https://plaid.com) account (sandbox is free)
- A [Groq](https://console.groq.com) API key (free)

### Setup

```bash
# Clone the repo
git clone https://github.com/muhammada138/clarity-finance-tracker
cd clarity-finance-tracker

# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

Create a `.env` file in the `backend/` folder:

```
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox
GROQ_API_KEY=your_groq_key
```

### Run

```bash
# Terminal 1 - backend
cd backend && python main.py

# Terminal 2 - frontend
cd frontend && npm run dev
```

Open `http://localhost:5173` and connect using Plaid sandbox credentials.

## Deployment

Backend deployed on [Render](https://render.com), frontend on [Vercel](https://vercel.com).

Set `VITE_API_URL` on Vercel to your Render backend URL, and `FRONTEND_URL` on Render to your Vercel app URL.
