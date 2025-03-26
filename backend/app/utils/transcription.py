import whisper
from fastapi import HTTPException
from app.config import WHISPER_MODEL

# Load Whisper model globally
model = whisper.load_model(WHISPER_MODEL)

def transcribe_audio(file_path: str, language: str = None) -> str:
    """
    Transcribes audio using OpenAI Whisper model.
    
    Args:
        file_path (str): Path to the audio file.
        language (str, optional): Language code for transcription.

    Returns:
        str: Transcribed text.
    """
    try:
        transcribe_options = {"language": language} if language else {}
        result = model.transcribe(file_path, **transcribe_options)
        return result["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
