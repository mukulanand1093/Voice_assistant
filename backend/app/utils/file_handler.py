import os
import shutil
from app.config import UPLOAD_DIR

def save_uploaded_file(uploaded_file) -> str:
    """
    Saves an uploaded file to the upload directory.

    Args:
        uploaded_file (UploadFile): Uploaded file.

    Returns:
        str: Path to the saved file.
    """
    file_path = os.path.join(UPLOAD_DIR, uploaded_file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)
    return file_path
