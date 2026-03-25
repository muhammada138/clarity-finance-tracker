from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import plaid_client as plaid_svc
from app.services import ai_insights
from app import state

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


def get_categorized_transactions():
    if not state.store["access_token"]:
        raise HTTPException(status_code=400, detail="no bank connected yet")
    raw = plaid_svc.fetch_transactions(state.store["access_token"])
    return ai_insights.categorize_transactions(raw)


@router.get("/")
async def get_insights():
    try:
        transactions = get_categorized_transactions()
        insights = ai_insights.generate_insights(transactions)
        return {"insights": insights, "transactions": transactions}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat(body: ChatRequest):
    try:
        transactions = get_categorized_transactions()
        response = ai_insights.chat_about_spending(transactions, body.question)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
