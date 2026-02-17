import os
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
        
        # Check file extension
        file_extension = audio_file_path.split('.')[-1].lower()
        wav_path = audio_file_path
        
        # If not wav, try to convert using pydub (requires ffmpeg)
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
        
        # Transcribe the audio
        with sr.AudioFile(wav_path) as source:
            print("Reading audio file...")
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = recognizer.record(source)
            print("Transcribing audio...")
            text = recognizer.recognize_google(audio_data)
            print(f"Transcription successful: {text}")
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
    Generates a structured consultation report from transcription using AI analysis.
    Extracts patient complaints, history, observations, and advice.
    Returns fail-safe message if transcription is invalid.
    """
    # Check if transcription indicates an error or is invalid
    if not transcription or transcription.strip() == "":
        return {
            "error": "Unable to generate report: Audio analysis could not be completed based on the provided consultation recording."
        }
    
    # Check for error messages in transcription
    error_indicators = [
        "Error:", "Could not understand", "not found", 
        "service error", "conversion failed"
    ]
    if any(indicator in transcription for indicator in error_indicators):
        return {
            "error": "Unable to generate report: Audio analysis could not be completed based on the provided consultation recording."
        }
    
    # Use AI to analyze the transcription and extract structured information
    try:
        import google.generativeai as genai
        
        # Configure the API (you should set GOOGLE_API_KEY in environment variables)
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("Warning: GOOGLE_API_KEY not set. Using basic extraction.")
            # Fallback to basic structure
            return {
                "subjective": transcription,
                "objective": "Audio recording transcribed. Clinical examination details to be added by physician.",
                "assessment": "To be determined based on consultation.",
                "plan": "To be determined based on assessment."
            }
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Create a prompt for structured extraction
        prompt = f"""You are a medical assistant analyzing a doctor-patient consultation transcript.

STRICT RULES:
1. Extract information ONLY from the provided transcript.
2. Do NOT assume, infer, or fabricate any details not explicitly mentioned.
3. If information is missing, write "Not mentioned in audio" for that section.
4. Be accurate and faithful to the recording.

Transcript:
{transcription}

Please analyze this consultation and provide a structured report with the following sections:

1. PATIENT COMPLAINTS: List the main complaints or symptoms mentioned by the patient
2. HISTORY/CONTEXT: Any relevant medical history, duration of symptoms, or contextual information
3. OBSERVATIONS: Doctor's observations, examination findings, or clinical notes
4. ADVICE/RECOMMENDATIONS: Treatment recommendations, prescriptions, lifestyle advice, or follow-up instructions
5. OTHER RELEVANT POINTS: Any other important information mentioned

Format your response as follows:
PATIENT COMPLAINTS:
[your answer]

HISTORY/CONTEXT:
[your answer]

OBSERVATIONS:
[your answer]

ADVICE/RECOMMENDATIONS:
[your answer]

OTHER RELEVANT POINTS:
[your answer]
"""
        
        response = model.generate_content(prompt)
        analysis = response.text
        
        # Parse the AI response into structured sections
        sections = {
            "patient_complaints": "",
            "history": "",
            "observations": "",
            "advice": "",
            "other_points": ""
        }
        
        current_section = None
        for line in analysis.split('\n'):
            line = line.strip()
            if "PATIENT COMPLAINTS:" in line:
                current_section = "patient_complaints"
            elif "HISTORY/CONTEXT:" in line:
                current_section = "history"
            elif "OBSERVATIONS:" in line:
                current_section = "observations"
            elif "ADVICE/RECOMMENDATIONS:" in line:
                current_section = "advice"
            elif "OTHER RELEVANT POINTS:" in line:
                current_section = "other_points"
            elif current_section and line:
                sections[current_section] += line + "\n"
        
        # Clean up sections
        for key in sections:
            sections[key] = sections[key].strip()
        
        # Return structured SOAP note
        return {
            "subjective": f"Chief Complaints:\n{sections['patient_complaints']}\n\nHistory:\n{sections['history']}",
            "objective": sections['observations'] if sections['observations'] else "Not mentioned in audio",
            "assessment": "Clinical assessment based on consultation findings.",
            "plan": sections['advice'] if sections['advice'] else "Not mentioned in audio",
            "additional_notes": sections['other_points'] if sections['other_points'] else "None",
            "full_transcription": transcription
        }
        
    except ImportError:
        print("google-generativeai not installed. Using basic extraction.")
        return {
            "subjective": transcription,
            "objective": "Audio recording transcribed. Clinical examination details to be added by physician.",
            "assessment": "To be determined based on consultation.",
            "plan": "To be determined based on assessment."
        }
    except Exception as e:
        print(f"Error during AI analysis: {e}")
        import traceback
        traceback.print_exc()
        # Return basic structure on AI error
        return {
            "subjective": transcription,
            "objective": "Audio recording transcribed. AI analysis unavailable.",
            "assessment": "To be determined based on consultation.",
            "plan": "To be determined based on consultation."
        }

def transcribe_and_summarize(consultation_id: str, audio_file_path: str) -> Summary:
    """
    Transcribes audio file and generates a SOAP note.
    Raises exception if audio analysis fails.
    """
    print(f"Processing audio file: {audio_file_path}")
    
    # Check if file exists
    if not os.path.exists(audio_file_path):
        print(f"File not found: {audio_file_path}")
        raise Exception("Unable to generate report: Audio analysis could not be completed based on the provided consultation recording.")
    
    # Transcribe the audio
    transcription = transcribe_audio(audio_file_path)
    
    # Generate SOAP note from transcription
    soap_note = generate_soap_note(transcription)
    
    # Check if there was an error during analysis
    if "error" in soap_note:
        raise Exception(soap_note["error"])
    
    return Summary(
        id=str(uuid.uuid4()),
        consultation_id=consultation_id,
        subjective=soap_note["subjective"],
        objective=soap_note["objective"],
        assessment=soap_note["assessment"],
        plan=soap_note["plan"],
        created_at=datetime.now(),
        additional_notes=soap_note.get("additional_notes", ""),
        full_transcription=soap_note.get("full_transcription", transcription)
    )


