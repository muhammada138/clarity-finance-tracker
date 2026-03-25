import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


def categorize_transactions(transactions: list) -> list:
    if not transactions:
        return []

    items = [{"name": t.get("name", ""), "amount": t.get("amount", 0)} for t in transactions]

    response = model.generate_content(
        "Categorize each transaction into one of: food, transport, shopping, "
        "subscriptions, rent, utilities, entertainment, health, other.\n\n"
        "Return a JSON array only, same order as input, each object having "
        '"name", "amount", "category".\n\n'
        f"Transactions:\n{json.dumps(items, indent=2)}"
    )

    text = response.text.strip()
    # strip markdown code block if gemini wraps it
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    categorized = json.loads(text.strip())

    # merge category back onto original transactions (keeps id, date, etc.)
    for i, t in enumerate(transactions):
        t["category"] = categorized[i].get("category", "other") if i < len(categorized) else "other"

    return transactions


def generate_insights(transactions: list) -> str:
    if not transactions:
        return "No transactions to analyze yet."

    # tally up spending per category
    summary = {}
    for t in transactions:
        cat = t.get("category", "other")
        summary[cat] = round(summary.get(cat, 0) + t.get("amount", 0), 2)

    response = model.generate_content(
        "You're analyzing someone's personal spending. Give 3-4 short, useful insights "
        "based on this spending breakdown by category (amounts in USD). Be direct and "
        "human, like a helpful friend reviewing their finances. No bullet point headers, "
        f"just the insights.\n\n{json.dumps(summary, indent=2)}"
    )

    return response.text.strip()


def chat_about_spending(transactions: list, question: str) -> str:
    if not transactions:
        return "No transaction data available yet. Connect your bank first."

    tx_text = json.dumps(transactions, indent=2, default=str)

    response = model.generate_content(
        "You have access to the user's transaction data. Answer their question "
        "concisely and helpfully. Use dollar amounts where relevant.\n\n"
        f"Transactions:\n{tx_text}\n\nQuestion: {question}"
    )

    return response.text.strip()
