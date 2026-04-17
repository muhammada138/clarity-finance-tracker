import time
from app.services.plaid_client import get_plaid_client

start_time = time.time()
for _ in range(10000):
    client = get_plaid_client()
end_time = time.time()

print(f"Time taken for 10000 calls: {end_time - start_time:.6f} seconds")
