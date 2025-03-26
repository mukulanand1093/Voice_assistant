import os
from gtts import gTTS
from fastapi import HTTPException
from app.config import OUTPUT_AUDIO_DIR

def text_to_speech(text: str, original_filename: str) -> str:
    """
    Converts text to speech using gTTS.

    Args:
        text (str): Text to convert.
        original_filename (str): Filename for output.

    Returns:
        str: Path to generated audio file.
    """
    try:
        text = text[:500]  # Limit text length to prevent long audio
        tts = gTTS(text=text, lang="en", slow=False)

        audio_filename = f"{original_filename.split('.')[0]}_response.mp3"
        audio_path = os.path.join(OUTPUT_AUDIO_DIR, audio_filename)

        tts.save(audio_path)
        return audio_path

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech generation failed: {e}")
