from fastapi import APIRouter

router = APIRouter()


# creates and returns a link token for the frontend to start Plaid Link
@router.post("/link-token")
async def create_link_token():
    pass


# swaps the public token for an access token and saves it
@router.post("/exchange-token")
async def exchange_public_token(public_token: str):
    pass


# pulls recent transactions using the stored access token
@router.get("/transactions")
async def get_transactions():
    pass
