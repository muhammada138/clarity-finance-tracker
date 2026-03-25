import os
from dotenv import load_dotenv

load_dotenv()

# pick up whichever key is set
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def categorize_transactions(transactions: list):
    # sends transactions to the LLM and returns them with categories attached
    pass


def generate_insights(transactions: list):
    # generates a plain-English summary of spending patterns
    pass
