from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from datetime import timedelta

import auth
import models
import ai_engine

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Voice-Driven Clinical Consultation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- Auth Routes --
@app.post("/token", response_model=models.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.authenticate_user(auth.fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=models.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

# -- Consultation Routes --
@app.post("/consultations/process/{patient_name}", response_model=models.Summary)
async def process_consultation(
    patient_name: str, 
    audio_file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can process consultations")
    
    # Create uploads directory if it doesn't exist
    import os
    from datetime import datetime
    os.makedirs("uploads", exist_ok=True)
    
    # Save the uploaded audio file with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"uploads/{patient_name}_{timestamp}_{audio_file.filename}"
    with open(file_path, "wb") as f:
        content = await audio_file.read()
        f.write(content)
    
    print(f"Processing consultation for {patient_name} by Dr. {current_user.username}")
    print(f"Audio file saved to: {file_path}")
    
    # Process the audio file
    summary = ai_engine.transcribe_and_summarize(
        consultation_id=f"cons_{patient_name}",
        audio_file_path=file_path
    )
    
    # Add audio file path to summary (you may need to update the model)
    summary.audio_file = file_path
    
    return summary

@app.get("/audio/{filename}")
async def get_audio_file(filename: str, current_user: models.User = Depends(auth.get_current_active_user)):
    """Serve audio files for playback"""
    from fastapi.responses import FileResponse
    import os
    
    file_path = f"uploads/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/webm")
    else:
        raise HTTPException(status_code=404, detail="Audio file not found")

@app.get("/reports", response_model=List[models.Summary])
async def get_my_reports(current_user: models.User = Depends(auth.get_current_active_user)):
    # TODO: In production, fetch actual reports from database
    # For now, return empty list - reports are generated on-demand during consultations
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
