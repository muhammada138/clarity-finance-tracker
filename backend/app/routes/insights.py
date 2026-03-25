from fastapi import APIRouter

router = APIRouter()


# sends transactions to the LLM and returns spending insights
@router.get("/")
async def get_insights():
    pass
