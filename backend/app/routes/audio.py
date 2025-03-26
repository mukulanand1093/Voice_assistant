from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.utils.transcription import transcribe_audio
from app.utils.ai_response import generate_response
from app.utils.text_to_speech import text_to_speech
from app.utils.file_handler import save_uploaded_file

router = APIRouter()

@router.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...), language: str = None):
    """
    Handles audio upload, transcription, AI response generation, and text-to-speech conversion.

    Args:
        file (UploadFile): The uploaded audio file.
        language (str, optional): Language for transcription.

    Returns:
        FileResponse: The generated response audio file.
    """
    try:
        file_path = save_uploaded_file(file)
        transcript = transcribe_audio(file_path, language)
        ai_response = generate_response(transcript)
        response_audio_path = text_to_speech(ai_response, file.filename)

        return FileResponse(
            response_audio_path,
            media_type="audio/mpeg",
            filename=response_audio_path.split("/")[-1]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
