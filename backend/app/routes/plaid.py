from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import plaid_client as plaid_svc
from app import state

router = APIRouter()


class ExchangeRequest(BaseModel):
    public_token: str


@router.post("/link-token")
async def create_link_token():
    try:
        token = await plaid_svc.create_link_token("demo-user")
        return {"link_token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/exchange-token")
async def exchange_public_token(body: ExchangeRequest):
    try:
        access_token = await plaid_svc.exchange_public_token(body.public_token)
        state.store["access_token"] = access_token
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/disconnect")
async def disconnect():
    state.store["access_token"] = None
    state.store["transactions"] = None
    return {"status": "ok"}


@router.get("/transactions")
async def get_transactions():
    if not state.store["access_token"]:
        raise HTTPException(status_code=400, detail="no bank connected yet")
    try:
        transactions = await plaid_svc.fetch_transactions(state.store["access_token"])
        return {"transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
