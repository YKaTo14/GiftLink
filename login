curl -X POST http://127.0.0.1:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@giftlink.test\",\"password\":\"demo123\"}"
{
  "message": "Login successful",
  "token": "demo-token",
  "user": {
    "id": 1,
    "name": "Demo User",
    "email": "demo@giftlink.test"
  }
}
