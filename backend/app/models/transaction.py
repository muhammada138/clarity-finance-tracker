from pydantic import BaseModel
from typing import Optional
from datetime import date


class Transaction(BaseModel):
    id: str
    account_id: str
    amount: float
    date: date
    name: str
    category: Optional[str] = None
    merchant_name: Optional[str] = None
