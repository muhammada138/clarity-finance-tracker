import pytest
from app.services.ai_insights import categorize_transactions, generate_insights, chat_about_spending

@pytest.mark.asyncio
async def test_categorize_transactions_empty():
    """Test that an empty list of transactions returns an empty list without calling AI."""
    result = await categorize_transactions([])
    assert result == []

@pytest.mark.asyncio
async def test_categorize_transactions_none():
    """Test that None input returns an empty list."""
    result = await categorize_transactions(None)
    assert result == []

@pytest.mark.asyncio
async def test_generate_insights_empty():
    """Test that empty transactions return the default no-data string."""
    result = await generate_insights([])
    assert result == "No transactions to analyze yet."

@pytest.mark.asyncio
async def test_chat_about_spending_empty():
    """Test that empty transactions return the default no-data string."""
    result = await chat_about_spending([], "What is my biggest expense?")
    assert result == "No transaction data available yet. Connect your bank first."
