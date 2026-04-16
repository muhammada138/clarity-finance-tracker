import pytest
from fastapi.testclient import TestClient
from main import app
from app import state

client = TestClient(app)

def test_health_check_or_root():
    # Since clarity has no root, we just skip or test docs
    response = client.get("/docs")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_insights_endpoint(mocker):
    # Set fake state
    state.store["access_token"] = "fake_token"
    state.store["transactions"] = None

    # Mocking Plaid client and AI services
    mock_plaid = mocker.patch("app.services.plaid_client.fetch_transactions")
    mock_plaid.return_value = [
        {"name": "UBER EATS", "amount": 25.50, "date": "2023-10-01"}
    ]
    
    mock_categorize = mocker.patch("app.services.ai_insights.categorize_transactions")
    mock_categorize.return_value = [
        {"name": "UBER EATS", "amount": 25.50, "date": "2023-10-01", "category": "food"}
    ]
    
    mock_generate = mocker.patch("app.services.ai_insights.generate_insights")
    mock_generate.return_value = "You spend a lot on food."
    
    response = client.get("/insights")
    assert response.status_code in [200, 307]
    # If 307 it might redirect to /api/insights/ because of router configs, fallback to check
    if response.status_code == 307:
        response = client.get("/insights/")

    assert response.status_code == 200
    assert "insights" in response.json()
    assert response.json()["insights"] == "You spend a lot on food."
    

def test_get_transactions_no_bank_connection():
    state.store["access_token"] = None
    response = client.get("/plaid/transactions")
    assert response.status_code == 400
    assert response.json()["detail"] == "no bank connected yet"
