# AI Assistant Web App - Setup Guide

## Overview
This AI Assistant web app consists of a **Next.js frontend** and a **FastAPI backend**. The frontend handles user interactions, while the backend processes audio input, transcribes it, and generates responses.
![image](https://github.com/user-attachments/assets/91b7d7f1-dcb5-469b-9b9d-2a395d649271)
![image](https://github.com/user-attachments/assets/ee6d2be2-3fe1-4b9a-bfbb-f7d77e5dc8a8)

---
## Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 18.x)
- **Python** (>= 3.9)
- **Virtualenv** (optional but recommended)
- **FFmpeg** (for audio processing)
- **Git** (optional for version control)

---
## Backend Setup (FastAPI)

### 1. Clone the Repository
```sh
git clone <repo_url>
cd <repo_directory>/backend
```

### 2. Create a Virtual Environment
```sh
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 3. Install Dependencies
```sh
pip install -r requirements.txt
```

### 4. Start the Backend Server
```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
By default, the FastAPI backend will be accessible at `http://localhost:8000`.

---
## Frontend Setup (Next.js)

### 1. Navigate to the Frontend Directory
```sh
cd ../frontend
```

### 2. Install Dependencies
```sh
npm install  # or `yarn install`
```

### 3. Configure Environment Variables
Create a `.env.local` file in the `frontend` directory and add:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 4. Start the Frontend Server
```sh
npm run dev  # or `yarn dev`
```
This will start the Next.js development server at `http://localhost:3000`.

---
## Running the Application
1. **Start the backend** (`uvicorn main:app --reload`)
2. **Start the frontend** (`npm run dev`)
3. Open `http://localhost:3000` in your browser.

---
## API Endpoints (Backend)
### 1. Test API
```sh
GET http://localhost:8000/
```
Response:
```json
{"message": "Hello from FastAPI"}
```

### 2. Upload and Process Audio
```sh
POST http://localhost:8000/process_audio/
```
- **Body:** Multipart form data with an audio file.
- **Response:** Transcribed text and AI-generated response.

---
## Notes
- Ensure that **FFmpeg** is installed and accessible in your system path.
- If deploying to production, consider using a process manager like **PM2** for the frontend and **Gunicorn** for the backend.
- For CORS issues, ensure that the FastAPI backend has CORS middleware enabled.

---
## Troubleshooting
- **Port Already in Use?** Run `lsof -i :8000` or `lsof -i :3000` to check processes and kill them.
- **Frontend Not Connecting to Backend?** Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly.
- **Dependency Issues?** Ensure you're using the correct Node.js and Python versions.

---
## Contributors
- **Mukul Anand** - Developer

For issues, contact [mukul.anand1093@gmail.com] or open a GitHub issue.

