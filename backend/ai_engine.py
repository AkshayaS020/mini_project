import os
import json
from models import Summary
from datetime import datetime
import uuid
import speech_recognition as sr


def transcribe_audio(audio_file_path: str) -> str:
    """
    Transcribes audio file to text using Google Speech Recognition.
    Supports webm, wav, mp3 formats.
    """
    try:
        recognizer = sr.Recognizer()
        file_extension = audio_file_path.split('.')[-1].lower()
        wav_path = audio_file_path

        if file_extension != 'wav':
            print(f"Converting {file_extension} to wav...")
            try:
                from pydub import AudioSegment
                audio = AudioSegment.from_file(audio_file_path, format=file_extension)
                wav_path = audio_file_path.rsplit('.', 1)[0] + '.wav'
                audio.export(wav_path, format='wav')
                print(f"Converted to: {wav_path}")
            except Exception as conv_error:
                print(f"Conversion error: {conv_error}")
                return f"Error: Audio conversion failed. Please ensure ffmpeg is installed. Error: {str(conv_error)}"

        with sr.AudioFile(wav_path) as source:
            print("Reading audio file...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = recognizer.record(source)
            print("Transcribing audio...")
            text = recognizer.recognize_google(audio_data)
            print(f"Transcription successful: {text[:100]}...")
            return text

    except sr.UnknownValueError:
        print("Speech recognition could not understand audio")
        return "Could not understand audio. Please speak clearly and try again."
    except sr.RequestError as e:
        print(f"Speech recognition service error: {e}")
        return f"Could not request results from speech recognition service: {e}"
    except FileNotFoundError:
        return f"Error: Audio file not found at {audio_file_path}"
    except Exception as e:
        print(f"Error during transcription: {e}")
        import traceback
        traceback.print_exc()
        return f"Error transcribing audio: {str(e)}"


def generate_soap_note(transcription: str) -> dict:
    """
    Generates a structured consultation report from transcription using Gemini AI.
    Returns SOAP sections plus structured dialogue (patient_said, doctor_said, symptoms, advice).
    Falls back gracefully if API key is missing or AI is unavailable.
    """
    if not transcription or transcription.strip() == "":
        return {"error": "Unable to generate report: Audio analysis could not be completed."}

    error_indicators = [
        "Error:", "Could not understand", "not found",
        "service error", "conversion failed"
    ]
    if any(ind in transcription for ind in error_indicators):
        return {"error": "Unable to generate report: Audio analysis could not be completed."}

    try:
        import google.generativeai as genai

        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Warning: GOOGLE_API_KEY not set. Using basic extraction.")
            return _basic_fallback(transcription)

        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash (fast and cost-effective)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = f"""You are a medical documentation assistant analyzing a doctor-patient consultation transcript.

STRICT RULES:
1. Extract information ONLY from the provided transcript.
2. Do NOT assume, infer, or fabricate any details not mentioned.
3. If information is missing, write "Not mentioned in audio" for that section.
4. Be accurate and faithful to the recording.
5. Return your response as valid JSON only — no markdown, no code fences.

Transcript:
{transcription}

Return a JSON object with these exact keys:
{{
  "patient_said": ["list of exact statements or paraphrased points the patient made"],
  "doctor_said": ["list of what the doctor said or observed"],
  "symptoms": ["list of symptoms identified from the conversation"],
  "doctor_advice": ["list of advice, prescriptions, or recommendations given by doctor"],
  "subjective": "SOAP Subjective section: patient complaints and history",
  "objective": "SOAP Objective section: clinical observations and examination findings",
  "assessment": "SOAP Assessment section: diagnosis or suspected condition",
  "plan": "SOAP Plan section: treatment plan, prescriptions, follow-up",
  "additional_notes": "any other relevant notes"
}}
"""

        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        parsed = json.loads(raw)

        # Ensure list fields are actually lists
        for field in ('patient_said', 'doctor_said', 'symptoms', 'doctor_advice'):
            if not isinstance(parsed.get(field), list):
                parsed[field] = []

        parsed['full_transcription'] = transcription
        return parsed

    except ImportError:
        print("google-generativeai not installed. Using basic extraction.")
        return _basic_fallback(transcription)
    except json.JSONDecodeError as e:
        print(f"JSON parse error from AI: {e}")
        return _basic_fallback(transcription)
    except Exception as e:
        print(f"Error during AI analysis: {e}")
        import traceback
        traceback.print_exc()
        return _basic_fallback(transcription)


def _basic_fallback(transcription: str) -> dict:
    """Returns a basic structure when AI analysis is unavailable."""
    return {
        "patient_said": ["See full transcription below"],
        "doctor_said": ["See full transcription below"],
        "symptoms": ["To be identified by physician"],
        "doctor_advice": ["To be provided by physician"],
        "subjective": transcription,
        "objective": "Audio transcribed. Clinical examination details to be added by physician.",
        "assessment": "To be determined based on consultation.",
        "plan": "To be determined based on assessment.",
        "additional_notes": "",
        "full_transcription": transcription
    }


def transcribe_and_summarize(consultation_id: str, audio_file_path: str,
                              doctor_username: str = "", patient_name: str = "") -> Summary:
    """
    Transcribes audio file and generates a structured SOAP note with dialogue breakdown.
    """
    print(f"Processing audio file: {audio_file_path}")

    if not os.path.exists(audio_file_path):
        print(f"File not found: {audio_file_path}")
        raise Exception("Unable to generate report: Audio file not found.")

    transcription = transcribe_audio(audio_file_path)
    soap_note = generate_soap_note(transcription)

    if "error" in soap_note:
        raise Exception(soap_note["error"])

    return Summary(
        id=str(uuid.uuid4()),
        consultation_id=consultation_id,
        doctor_username=doctor_username,
        patient_name=patient_name,
        patient_said=soap_note.get("patient_said", []),
        doctor_said=soap_note.get("doctor_said", []),
        symptoms=soap_note.get("symptoms", []),
        doctor_advice=soap_note.get("doctor_advice", []),
        subjective=soap_note.get("subjective", ""),
        objective=soap_note.get("objective", ""),
        assessment=soap_note.get("assessment", ""),
        plan=soap_note.get("plan", ""),
        created_at=datetime.now(),
        additional_notes=soap_note.get("additional_notes", ""),
        full_transcription=soap_note.get("full_transcription", transcription)
    )
