import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY", "dummy_key"))
MODEL = "llama-3.3-70b-versatile"


async def ask(prompt: str, max_tokens: int = 2048, system_prompt: str = None) -> str:
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    response = await client.chat.completions.create(
        model=MODEL,
        max_tokens=max_tokens,
        messages=messages,
    )
    return response.choices[0].message.content.strip()


async def categorize_transactions(transactions: list) -> list:
    if not transactions:
        return []

    items = [{"name": t.get("name", ""), "amount": t.get("amount", 0)} for t in transactions]

    text = await ask(
        "Categorize each transaction into one of: food, transport, shopping, "
        "subscriptions, rent, utilities, entertainment, health, income, other.\n"
        "Base the category on the merchant name, not the amount sign. "
        "Only use 'income' for actual income sources: direct deposits, paychecks, bank interest, "
        "ACH credits, CD deposits, or clearly labeled refunds/cashback. "
        "Airlines, shops, restaurants, and services should use their real category even if the amount is negative.\n\n"
        "Return a JSON array only, same order as input, each object having "
        '"name", "amount", "category".\n\n'
        f"Transactions:\n{json.dumps(items, indent=2)}"
    )

    # strip markdown code block if the model wraps it
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    categorized = json.loads(text.strip())

    # merge category back onto original transactions (keeps id, date, etc.)
    for i, t in enumerate(transactions):
        t["category"] = categorized[i].get("category", "other") if i < len(categorized) else "other"

    return transactions


async def generate_insights(transactions: list) -> str:
    if not transactions:
        return "No transactions to analyze yet."

    # tally up spending per category
    summary = {}
    for t in transactions:
        cat = t.get("category", "other")
        summary[cat] = round(summary.get(cat, 0) + t.get("amount", 0), 2)

    return await ask(
        "You're analyzing someone's personal spending. Give 3-4 short, useful insights "
        "based on this spending breakdown by category (amounts in USD). Be direct and "
        "human, like a helpful friend reviewing their finances. No bullet point headers, "
        f"just the insights.\n\n{json.dumps(summary, indent=2)}",
        max_tokens=512,
    )


async def chat_about_spending(transactions: list, question: str) -> str:
    if not transactions:
        return "No transaction data available yet. Connect your bank first."

    tx_text = json.dumps(transactions, indent=2, default=str)

    return await ask(
        question,
        max_tokens=512,
        system_prompt=(
            "You have access to the user's transaction data. Answer their question "
            "in plain conversational text — no markdown, no asterisks, no bullet headers, no numbered lists. "
            "Be brief and direct, 2-4 sentences max unless a longer answer truly needs more. "
            "Use dollar amounts where relevant.\n\n"
            f"Transactions:\n{tx_text}"
        ),
    )
