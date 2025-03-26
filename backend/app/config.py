import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set!")

# Directories
UPLOAD_DIR = "uploads"
OUTPUT_AUDIO_DIR = "output_audio"

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_AUDIO_DIR, exist_ok=True)

# Models
WHISPER_MODEL = "base"
GROQ_MODEL = "llama3-70b-8192"

# API Configuration
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# CORS Settings
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]
