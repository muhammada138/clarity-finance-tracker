from fastapi import APIRouter, HTTPException
import logging

logger = logging.getLogger(__name__)
from pydantic import BaseModel
from app.services import plaid_client as plaid_svc
from app.services import ai_insights
from app import state

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


async def get_categorized_transactions():
    if not state.store["access_token"]:
        raise HTTPException(status_code=400, detail="no bank connected yet")
    if state.store["transactions"] is not None:
        return state.store["transactions"]
    raw = await plaid_svc.fetch_transactions(state.store["access_token"])
    transactions = await ai_insights.categorize_transactions(raw)
    state.store["transactions"] = transactions
    return transactions


@router.get("")
@router.get("/")
async def get_insights():
    try:
        transactions = await get_categorized_transactions()

        if state.store["insights"] is not None:
            insights = state.store["insights"]
        else:
            insights = await ai_insights.generate_insights(transactions)
            state.store["insights"] = insights

        return {"insights": insights, "transactions": transactions}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching insights")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/chat")
async def chat(body: ChatRequest):
    try:
        transactions = await get_categorized_transactions()
        response = await ai_insights.chat_about_spending(transactions, body.question)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error in chat")
        raise HTTPException(status_code=500, detail="Internal server error")
