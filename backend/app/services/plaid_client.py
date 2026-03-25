import os
from dotenv import load_dotenv

load_dotenv()

# set up the Plaid client using credentials from .env
PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")


def get_plaid_client():
    # returns a configured Plaid API client
    pass


def create_link_token(user_id: str):
    pass


def exchange_public_token(public_token: str):
    pass


def fetch_transactions(access_token: str, start_date: str, end_date: str):
    pass
