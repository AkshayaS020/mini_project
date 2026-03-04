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


# ─── Patient Profile ──────────────────────────────────────────────────────────

class PatientProfileCreate(BaseModel):
    name: Optional[str] = ""
    age: Optional[int] = None
    gender: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""
    height: Optional[float] = None
    weight: Optional[float] = None
    health_conditions: Optional[str] = ""
    allergies: Optional[str] = ""
    dietary_habits: Optional[str] = ""
    child_age: Optional[int] = None
    child_weight: Optional[float] = None
    child_height: Optional[float] = None
    vaccination_status: Optional[str] = ""


class PatientProfile(PatientProfileCreate):
    username: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ─── Doctor Profile ──────────────────────────────────────────────────────────

class DoctorProfileCreate(BaseModel):
    name: Optional[str] = ""
    specialty: Optional[str] = ""
    experience: Optional[int] = None
    qualifications: Optional[str] = ""
    clinic_name: Optional[str] = ""
    clinic_address: Optional[str] = ""
    phone: Optional[str] = ""
    consultation_fee: Optional[float] = None


class DoctorProfile(DoctorProfileCreate):
    username: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None



# ─── Consultation / Summary ───────────────────────────────────────────────────

class Summary(BaseModel):
    id: str
    consultation_id: str
    doctor_username: Optional[str] = ""
    patient_name: Optional[str] = ""
    # Structured dialogue fields
    patient_said: Optional[List[str]] = []
    doctor_said: Optional[List[str]] = []
    symptoms: Optional[List[str]] = []
    doctor_advice: Optional[List[str]] = []
    # SOAP fields
    subjective: str
    objective: str
    assessment: str
    plan: str
    created_at: datetime
    additional_notes: Optional[str] = ""
    full_transcription: Optional[str] = ""
    audio_file: Optional[str] = None
