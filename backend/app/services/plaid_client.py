import os
import asyncio
import plaid
from plaid.api import plaid_api
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from datetime import date, timedelta
from dotenv import load_dotenv

load_dotenv()

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")


_configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    },
)
_api_client = plaid.ApiClient(_configuration)
_plaid_api_client = plaid_api.PlaidApi(_api_client)

def get_plaid_client():
    return _plaid_api_client


async def create_link_token(user_id: str):
    client = get_plaid_client()
    request = LinkTokenCreateRequest(
        products=[Products("transactions")],
        client_name="Finance Tracker",
        country_codes=[CountryCode("US")],
        language="en",
        user=LinkTokenCreateRequestUser(client_user_id=user_id),
    )
    response = await asyncio.to_thread(client.link_token_create, request)
    return response["link_token"]


async def exchange_public_token(public_token: str):
    client = get_plaid_client()
    request = ItemPublicTokenExchangeRequest(public_token=public_token)
    response = await asyncio.to_thread(client.item_public_token_exchange, request)
    return response["access_token"]


async def fetch_transactions(access_token: str, days: int = 30):
    client = get_plaid_client()
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    request = TransactionsGetRequest(
        access_token=access_token,
        start_date=start_date,
        end_date=end_date,
    )
    # Plaid sandbox sometimes needs a moment before transactions are ready
    for attempt in range(4):
        try:
            response = await asyncio.to_thread(client.transactions_get, request)
            break
        except plaid.ApiException as e:
            if "PRODUCT_NOT_READY" in str(e) and attempt < 3:
                await asyncio.sleep(3)
                continue
            raise
    else:
        response = await asyncio.to_thread(client.transactions_get, request)

    result = []
    for t in response["transactions"]:
        result.append({
            "id": t["transaction_id"],
            "name": t["name"],
            "amount": float(t["amount"]),
            "date": str(t["date"]),
            "merchant_name": t.get("merchant_name"),
            "account_id": t["account_id"],
        })
    return result
