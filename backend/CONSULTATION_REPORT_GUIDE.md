# AI-Powered Consultation Report Generation

## Overview

The consultation report generation system has been enhanced to provide intelligent, structured analysis of medical consultation audio recordings. The system now uses Google's Gemini AI to extract and organize consultation information into a proper SOAP note format.

## Key Features

### 1. **Audio Validation & Fail-Safe**
- Verifies audio file exists and is accessible
- Checks that transcription was successful
- Returns fail-safe message if audio cannot be analyzed:
  ```
  "Unable to generate report: Audio analysis could not be completed based on the provided consultation recording."
  ```

### 2. **AI-Powered Information Extraction**
The system extracts the following information from consultation transcripts:
- **Patient Complaints**: Main symptoms and complaints mentioned
- **History/Context**: Medical history, symptom duration, contextual information
- **Observations**: Doctor's observations and examination findings
- **Advice/Recommendations**: Treatment plans, prescriptions, lifestyle advice
- **Other Relevant Points**: Any additional important information

### 3. **Strict Accuracy Rules**
- Extracts information ONLY from the audio content
- Does NOT assume, infer, or fabricate details
- Marks missing information as "Not mentioned in audio"
- Maintains faithfulness to the original recording

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Google API Key
You need a Google API key to use the Gemini AI model:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set the environment variable:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_API_KEY="your-api-key-here"
```

**Windows (Command Prompt):**
```cmd
set GOOGLE_API_KEY=your-api-key-here
```

**Linux/Mac:**
```bash
export GOOGLE_API_KEY="your-api-key-here"
```

### 3. Install FFmpeg (for audio conversion)
The system needs FFmpeg to convert audio formats:

**Windows:**
- Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- Add to system PATH

**Linux:**
```bash
sudo apt-get install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

## How It Works

### Workflow

1. **Audio Upload**: User uploads audio file through the API
2. **File Validation**: System checks if file exists and is accessible
3. **Transcription**: Audio is transcribed using Google Speech Recognition
4. **Validation**: Transcription is checked for errors
5. **AI Analysis**: Gemini AI analyzes the transcript and extracts structured information
6. **Report Generation**: Structured SOAP note is created
7. **Response**: Report is returned to the user

### API Endpoint

**POST** `/consultations/process/{patient_name}`

**Headers:**
```
Authorization: Bearer <your-token>
Content-Type: multipart/form-data
```

**Body:**
- `audio_file`: Audio file (webm, wav, mp3)

**Response (Success):**
```json
{
  "id": "uuid",
  "consultation_id": "cons_patient_name",
  "subjective": "Chief Complaints:\n...\n\nHistory:\n...",
  "objective": "Doctor's observations...",
  "assessment": "Clinical assessment based on consultation findings.",
  "plan": "Treatment recommendations...",
  "additional_notes": "Other relevant points...",
  "full_transcription": "Complete transcript...",
  "audio_file": "uploads/patient_name_timestamp_file.webm",
  "created_at": "2026-01-31T18:30:00"
}
```

**Response (Failure):**
```json
{
  "detail": "Unable to generate report: Audio analysis could not be completed based on the provided consultation recording."
}
```

## Fallback Behavior

The system has multiple fallback mechanisms:

1. **No API Key**: Falls back to basic transcription without AI analysis
2. **AI Service Error**: Returns transcription with basic SOAP structure
3. **Transcription Error**: Returns fail-safe error message
4. **Invalid Audio**: Returns fail-safe error message

## Example Usage

### Using cURL

```bash
curl -X POST "http://localhost:8000/consultations/process/John_Doe" \
  -H "Authorization: Bearer your-token" \
  -F "audio_file=@consultation.webm"
```

### Using Python

```python
import requests

url = "http://localhost:8000/consultations/process/John_Doe"
headers = {"Authorization": "Bearer your-token"}
files = {"audio_file": open("consultation.webm", "rb")}

response = requests.post(url, headers=headers, files=files)
print(response.json())
```

## Testing

To test the system:

1. **Start the backend server:**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Record a sample consultation** using the frontend

3. **Submit the audio** through the API

4. **Verify the report** contains properly extracted information

## Troubleshooting

### "Could not understand audio"
- Ensure audio quality is good
- Check that speech is clear and audible
- Verify microphone is working properly

### "API key not set"
- Set the `GOOGLE_API_KEY` environment variable
- Restart the server after setting the variable

### "Audio conversion failed"
- Install FFmpeg
- Ensure FFmpeg is in system PATH
- Try converting audio to WAV format manually

### "Service error"
- Check internet connection
- Verify API key is valid
- Check Google API quota limits

## Security Considerations

1. **API Key**: Never commit API keys to version control
2. **Audio Files**: Stored in `uploads/` directory - ensure proper access controls
3. **Authentication**: All endpoints require valid JWT token
4. **Role-Based Access**: Only users with "doctor" role can process consultations

## Future Enhancements

Potential improvements:
- Support for multiple languages
- Real-time transcription during consultation
- Integration with electronic health records (EHR)
- Advanced medical terminology recognition
- Automated ICD-10 code suggestions
- Voice identification for multi-speaker consultations
