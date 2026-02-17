from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    username: str
    email: Optional[str] = None
    role: str  # "doctor" or "patient"

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ConsultationCreate(BaseModel):
    doctor_id: str
    patient_name: str
    # In a real app, audio file would be uploaded, for now we simulate with a trigger

class Summary(BaseModel):
    id: str
    consultation_id: str
    subjective: str
    objective: str
    assessment: str
    plan: str
    created_at: datetime
    additional_notes: Optional[str] = ""
    full_transcription: Optional[str] = ""
    audio_file: Optional[str] = None

