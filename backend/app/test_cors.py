from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_cors_headers():
    # Test preflight request
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    }
    response = client.options("/plaid/link-token", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert "Content-Type" in response.headers.get("access-control-allow-headers", "")
    assert "*" not in response.headers.get("access-control-allow-headers", "")

def test_cors_disallowed_header():
    # Test preflight request with disallowed header
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "X-Custom-Header",
    }
    response = client.options("/plaid/link-token", headers=headers)
    # FastAPI CORSMiddleware returns 400 or just doesn't include the CORS headers if it's not allowed
    # Actually, it might return 200 but without the Access-Control-Allow-Headers if it's a preflight
    # Let's see how it behaves.
    if response.status_code == 200:
        allow_headers = response.headers.get("access-control-allow-headers", "")
        assert "X-Custom-Header" not in allow_headers
