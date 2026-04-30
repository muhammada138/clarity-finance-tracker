import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import plaid_client as plaid_svc
from app.services import ai_insights
from app import state

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


async def get_categorized_transactions():
    if not state.store["access_tokens"]:
        raise HTTPException(status_code=400, detail="no bank connected yet")
    if state.store["transactions"] is not None:
        return state.store["transactions"]
    
    all_raw = []
    for token in state.store["access_tokens"]:
        try:
            raw = await plaid_svc.fetch_transactions(token)
            all_raw.extend(raw)
        except Exception as e:
            logger.warning(f"Failed to fetch transactions for a token: {e}")
            
    if not all_raw:
        return []

    transactions = await ai_insights.categorize_transactions(all_raw)
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
        logger.error(f"Error in insights route: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred while generating insights")


@router.post("/chat")
async def chat(body: ChatRequest):
    try:
        transactions = await get_categorized_transactions()
        response = await ai_insights.chat_about_spending(transactions, body.question)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in insights route: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred while generating insights")
