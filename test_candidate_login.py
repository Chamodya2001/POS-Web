import requests
import json

url = "http://localhost:5005/api/candidates/login"
payload = {
    "email": "kd@2026",
    "password": "superadmin"
}
headers = {
    "Content-Type": "application/json",
    "x-api-name": "POS_API"
}

print(f"Testing Professional Candidate login at {url}...")
try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
