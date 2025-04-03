from fastapi import FastAPI, File, UploadFile
import shutil
from faster_whisper import WhisperModel

app = FastAPI()
model = WhisperModel("small")  # You can use 'base', 'medium', or 'large' for better accuracy

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    file_path = f"temp/{file.filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Transcribe audio
    segments, _ = model.transcribe(file_path)
    transcript = " ".join(segment.text for segment in segments)

    return {"transcript": transcript}

