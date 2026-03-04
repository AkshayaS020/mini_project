from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from typing import List, Optional, Union
from datetime import timedelta, datetime
import os

import auth
import models
import ai_engine
import database

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MediVoice AI – Clinical Consultation System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth Routes ──────────────────────────────────────────────────────────────

@app.post("/token", response_model=models.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = auth.authenticate_user(auth.fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me/", response_model=models.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user


# ─── Profile Routes ───────────────────────────────────────────────────────────

@app.get("/profile", response_model=Optional[Union[models.PatientProfile, models.DoctorProfile]])
async def get_my_profile(current_user: models.User = Depends(auth.get_current_active_user)):
    """Get the current user's profile based on their role."""
    if current_user.role == "doctor":
        profile = database.get_doctor_profile(current_user.username)
        if not profile:
            return None
        return models.DoctorProfile(**profile)
    else:
        profile = database.get_patient_profile(current_user.username)
        if not profile:
            return None
        return models.PatientProfile(**profile)


@app.post("/profile", response_model=Union[models.PatientProfile, models.DoctorProfile])
async def save_my_profile(
    profile_data: dict,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Create or update the current user's profile."""
    if current_user.role == "doctor":
        saved = database.save_doctor_profile(
            current_user.username, profile_data
        )
        return models.DoctorProfile(**saved)
    else:
        saved = database.save_patient_profile(
            current_user.username, profile_data
        )
        return models.PatientProfile(**saved)


# ─── Consultation Routes ──────────────────────────────────────────────────────

@app.post("/consultations/process/{patient_name}", response_model=models.Summary)
async def process_consultation(
    patient_name: str,
    audio_file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can process consultations")

    os.makedirs("uploads", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = f"uploads/{patient_name}_{timestamp}_{audio_file.filename}"
    with open(file_path, "wb") as f:
        content = await audio_file.read()
        f.write(content)

    print(f"Processing consultation for {patient_name} by Dr. {current_user.username}")

    summary = ai_engine.transcribe_and_summarize(
        consultation_id=f"cons_{patient_name}_{timestamp}",
        audio_file_path=file_path,
        doctor_username=current_user.username,
        patient_name=patient_name
    )

    summary.audio_file = file_path

    # Persist to database
    database.save_consultation({
        "id": summary.id,
        "consultation_id": summary.consultation_id,
        "doctor_username": summary.doctor_username,
        "patient_name": summary.patient_name,
        "patient_said": summary.patient_said,
        "doctor_said": summary.doctor_said,
        "symptoms": summary.symptoms,
        "doctor_advice": summary.doctor_advice,
        "subjective": summary.subjective,
        "objective": summary.objective,
        "assessment": summary.assessment,
        "plan": summary.plan,
        "additional_notes": summary.additional_notes or "",
        "full_transcription": summary.full_transcription or "",
        "audio_file": file_path,
        "created_at": summary.created_at.isoformat()
    })

    return summary


@app.get("/consultations", response_model=List[models.Summary])
async def get_all_consultations(current_user: models.User = Depends(auth.get_current_active_user)):
    """Return all saved consultations (doctors see all; patients see their own)."""
    rows = database.get_all_consultations()
    result = []
    for row in rows:
        # Patients see only their own records
        if current_user.role == "patient" and row.get("patient_name", "").lower() != current_user.username.lower():
            continue
        try:
            result.append(models.Summary(
                id=row["id"],
                consultation_id=row.get("consultation_id", ""),
                doctor_username=row.get("doctor_username", ""),
                patient_name=row.get("patient_name", ""),
                patient_said=row.get("patient_said", []),
                doctor_said=row.get("doctor_said", []),
                symptoms=row.get("symptoms", []),
                doctor_advice=row.get("doctor_advice", []),
                subjective=row.get("subjective", ""),
                objective=row.get("objective", ""),
                assessment=row.get("assessment", ""),
                plan=row.get("plan", ""),
                created_at=datetime.fromisoformat(row.get("created_at", datetime.now().isoformat())),
                additional_notes=row.get("additional_notes", ""),
                full_transcription=row.get("full_transcription", ""),
                audio_file=row.get("audio_file")
            ))
        except Exception as e:
            print(f"Error parsing row {row.get('id')}: {e}")
    return result


@app.get("/consultations/{consultation_id}", response_model=models.Summary)
async def get_consultation(
    consultation_id: str,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    row = database.get_consultation_by_id(consultation_id)
    if not row:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return models.Summary(
        id=row["id"],
        consultation_id=row.get("consultation_id", ""),
        doctor_username=row.get("doctor_username", ""),
        patient_name=row.get("patient_name", ""),
        patient_said=row.get("patient_said", []),
        doctor_said=row.get("doctor_said", []),
        symptoms=row.get("symptoms", []),
        doctor_advice=row.get("doctor_advice", []),
        subjective=row.get("subjective", ""),
        objective=row.get("objective", ""),
        assessment=row.get("assessment", ""),
        plan=row.get("plan", ""),
        created_at=datetime.fromisoformat(row.get("created_at", datetime.now().isoformat())),
        additional_notes=row.get("additional_notes", ""),
        full_transcription=row.get("full_transcription", ""),
        audio_file=row.get("audio_file")
    )


@app.get("/audio/{filename}")
async def get_audio_file(filename: str, current_user: models.User = Depends(auth.get_current_active_user)):
    """Serve audio files for playback."""
    file_path = f"uploads/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/webm")
    raise HTTPException(status_code=404, detail="Audio file not found")


# ─── Legacy endpoint kept for compatibility ───────────────────────────────────
@app.get("/reports", response_model=List[models.Summary])
async def get_my_reports(current_user: models.User = Depends(auth.get_current_active_user)):
    return await get_all_consultations(current_user)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
