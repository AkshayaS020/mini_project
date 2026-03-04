import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "medivoice.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Patient profiles
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patient_profiles (
            username TEXT PRIMARY KEY,
            name TEXT DEFAULT '',
            age INTEGER,
            gender TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            address TEXT DEFAULT '',
            height REAL,
            weight REAL,
            health_conditions TEXT DEFAULT '',
            allergies TEXT DEFAULT '',
            dietary_habits TEXT DEFAULT '',
            child_age INTEGER,
            child_weight REAL,
            child_height REAL,
            vaccination_status TEXT DEFAULT '',
            created_at TEXT,
            updated_at TEXT
        )
    ''')

    # Doctor profiles
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctor_profiles (
            username TEXT PRIMARY KEY,
            name TEXT DEFAULT '',
            specialty TEXT DEFAULT '',
            experience INTEGER,
            qualifications TEXT DEFAULT '',
            clinic_name TEXT DEFAULT '',
            clinic_address TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            consultation_fee REAL,
            created_at TEXT,
            updated_at TEXT
        )
    ''')

    # Consultations / Reports
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS consultations (
            id TEXT PRIMARY KEY,
            consultation_id TEXT,
            doctor_username TEXT DEFAULT '',
            patient_name TEXT DEFAULT '',
            patient_said TEXT DEFAULT '[]',
            doctor_said TEXT DEFAULT '[]',
            symptoms TEXT DEFAULT '[]',
            doctor_advice TEXT DEFAULT '[]',
            subjective TEXT DEFAULT '',
            objective TEXT DEFAULT '',
            assessment TEXT DEFAULT '',
            plan TEXT DEFAULT '',
            additional_notes TEXT DEFAULT '',
            full_transcription TEXT DEFAULT '',
            audio_file TEXT,
            created_at TEXT
        )
    ''')

    conn.commit()
    conn.close()


# ─── Profile helpers ──────────────────────────────────────────────────────────

def save_patient_profile(username: str, profile_data: dict) -> dict:
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    existing = cursor.execute(
        "SELECT username FROM patient_profiles WHERE username = ?", (username,)
    ).fetchone()

    if existing:
        cursor.execute('''
            UPDATE patient_profiles SET
                name=?, age=?, gender=?, phone=?, address=?,
                height=?, weight=?, health_conditions=?, allergies=?,
                dietary_habits=?, child_age=?, child_weight=?, child_height=?,
                vaccination_status=?, updated_at=?
            WHERE username=?
        ''', (
            profile_data.get('name', ''),
            profile_data.get('age'),
            profile_data.get('gender', ''),
            profile_data.get('phone', ''),
            profile_data.get('address', ''),
            profile_data.get('height'),
            profile_data.get('weight'),
            profile_data.get('health_conditions', ''),
            profile_data.get('allergies', ''),
            profile_data.get('dietary_habits', ''),
            profile_data.get('child_age'),
            profile_data.get('child_weight'),
            profile_data.get('child_height'),
            profile_data.get('vaccination_status', ''),
            now,
            username
        ))
    else:
        cursor.execute('''
            INSERT INTO patient_profiles
            (username, name, age, gender, phone, address, height, weight,
             health_conditions, allergies, dietary_habits, child_age,
             child_weight, child_height, vaccination_status, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ''', (
            username,
            profile_data.get('name', ''),
            profile_data.get('age'),
            profile_data.get('gender', ''),
            profile_data.get('phone', ''),
            profile_data.get('address', ''),
            profile_data.get('height'),
            profile_data.get('weight'),
            profile_data.get('health_conditions', ''),
            profile_data.get('allergies', ''),
            profile_data.get('dietary_habits', ''),
            profile_data.get('child_age'),
            profile_data.get('child_weight'),
            profile_data.get('child_height'),
            profile_data.get('vaccination_status', ''),
            now,
            now
        ))

    conn.commit()
    row = cursor.execute(
        "SELECT * FROM patient_profiles WHERE username=?", (username,)
    ).fetchone()
    conn.close()
    return dict(row)


def get_patient_profile(username: str):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM patient_profiles WHERE username=?", (username,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def save_doctor_profile(username: str, profile_data: dict) -> dict:
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    existing = cursor.execute(
        "SELECT username FROM doctor_profiles WHERE username = ?", (username,)
    ).fetchone()

    if existing:
        cursor.execute('''
            UPDATE doctor_profiles SET
                name=?, specialty=?, experience=?, qualifications=?, clinic_name=?,
                clinic_address=?, phone=?, consultation_fee=?, updated_at=?
            WHERE username=?
        ''', (
            profile_data.get('name', ''),
            profile_data.get('specialty', ''),
            profile_data.get('experience'),
            profile_data.get('qualifications', ''),
            profile_data.get('clinic_name', ''),
            profile_data.get('clinic_address', ''),
            profile_data.get('phone', ''),
            profile_data.get('consultation_fee'),
            now,
            username
        ))
    else:
        cursor.execute('''
            INSERT INTO doctor_profiles
            (username, name, specialty, experience, qualifications, clinic_name,
             clinic_address, phone, consultation_fee, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ''', (
            username,
            profile_data.get('name', ''),
            profile_data.get('specialty', ''),
            profile_data.get('experience'),
            profile_data.get('qualifications', ''),
            profile_data.get('clinic_name', ''),
            profile_data.get('clinic_address', ''),
            profile_data.get('phone', ''),
            profile_data.get('consultation_fee'),
            now,
            now
        ))

    conn.commit()
    row = cursor.execute(
        "SELECT * FROM doctor_profiles WHERE username=?", (username,)
    ).fetchone()
    conn.close()
    return dict(row)


def get_doctor_profile(username: str):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM doctor_profiles WHERE username=?", (username,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ─── Consultation helpers ─────────────────────────────────────────────────────

def save_consultation(data: dict):
    conn = get_db()
    conn.execute('''
        INSERT OR REPLACE INTO consultations
        (id, consultation_id, doctor_username, patient_name,
         patient_said, doctor_said, symptoms, doctor_advice,
         subjective, objective, assessment, plan,
         additional_notes, full_transcription, audio_file, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ''', (
        data['id'],
        data.get('consultation_id', ''),
        data.get('doctor_username', ''),
        data.get('patient_name', ''),
        json.dumps(data.get('patient_said', [])),
        json.dumps(data.get('doctor_said', [])),
        json.dumps(data.get('symptoms', [])),
        json.dumps(data.get('doctor_advice', [])),
        data.get('subjective', ''),
        data.get('objective', ''),
        data.get('assessment', ''),
        data.get('plan', ''),
        data.get('additional_notes', ''),
        data.get('full_transcription', ''),
        data.get('audio_file'),
        data.get('created_at', datetime.now().isoformat())
    ))
    conn.commit()
    conn.close()


def get_all_consultations():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM consultations ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    result = []
    for row in rows:
        r = dict(row)
        for field in ('patient_said', 'doctor_said', 'symptoms', 'doctor_advice'):
            try:
                r[field] = json.loads(r[field]) if r[field] else []
            except Exception:
                r[field] = []
        result.append(r)
    return result


def get_consultation_by_id(consultation_id: str):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM consultations WHERE id=?", (consultation_id,)
    ).fetchone()
    conn.close()
    if not row:
        return None
    r = dict(row)
    for field in ('patient_said', 'doctor_said', 'symptoms', 'doctor_advice'):
        try:
            r[field] = json.loads(r[field]) if r[field] else []
        except Exception:
            r[field] = []
    return r


# Initialise on import
init_db()
