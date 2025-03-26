import requests
from fastapi import HTTPException
from app.config import GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL

def generate_response(text: str, max_tokens: int = 300) -> str:
    """
    Generates an AI response using Groq API.

    Args:
        text (str): Input text for AI processing.
        max_tokens (int): Maximum response length.

    Returns:
        str: AI-generated response.
    """
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": text}],
            "max_tokens": max_tokens
        }

        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()

        return response.json()["choices"][0]["message"]["content"]
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request failed: {e}")
