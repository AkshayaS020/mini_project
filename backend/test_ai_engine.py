"""
Test script for AI-powered consultation report generation.
This demonstrates how the system processes audio and generates structured reports.
"""

import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from ai_engine import transcribe_audio, generate_soap_note

def test_with_sample_transcription():
    """
    Test the report generation with a sample consultation transcript.
    This simulates what would happen after successful audio transcription.
    """
    print("=" * 80)
    print("TESTING AI-POWERED CONSULTATION REPORT GENERATION")
    print("=" * 80)
    print()
    
    # Sample consultation transcript
    sample_transcript = """
    Doctor: Good morning! What brings you in today?
    
    Patient: Hi doctor. I've been having severe headaches for the past week. 
    They usually start in the morning and get worse throughout the day.
    
    Doctor: I see. Can you describe the pain? Is it throbbing or constant?
    
    Patient: It's more like a throbbing pain, mostly on the right side of my head.
    Sometimes I feel nauseous too.
    
    Doctor: Have you had headaches like this before?
    
    Patient: Yes, I had similar headaches about 6 months ago, but they went away 
    after a few days. These ones are lasting longer.
    
    Doctor: Are you taking any medications currently?
    
    Patient: Just my blood pressure medication, the one you prescribed last year.
    
    Doctor: Okay. Let me check your blood pressure and examine you.
    [Examination sounds]
    Your blood pressure is slightly elevated at 145/90. Your pupils are reactive.
    No signs of neurological deficit.
    
    Patient: Is it serious?
    
    Doctor: Based on your symptoms and examination, this appears to be migraine headaches,
    possibly triggered by stress or dietary factors. I'd like to start you on some 
    medication and have you keep a headache diary.
    
    Patient: Okay, what should I do?
    
    Doctor: I'm prescribing sumatriptan 50mg to take when you feel a headache coming on.
    Also, try to identify triggers - keep track of what you eat, your sleep patterns,
    and stress levels. Avoid caffeine and alcohol for now. Make sure you're drinking 
    plenty of water. I want to see you back in two weeks to review your progress.
    If the headaches get worse or you develop fever, vision changes, or neck stiffness,
    go to the emergency room immediately.
    
    Patient: Thank you, doctor. I'll do that.
    
    Doctor: You're welcome. Take care!
    """
    
    print("Sample Consultation Transcript:")
    print("-" * 80)
    print(sample_transcript)
    print("-" * 80)
    print()
    
    # Generate SOAP note
    print("Generating AI-powered consultation report...")
    print()
    
    try:
        soap_note = generate_soap_note(sample_transcript)
        
        if "error" in soap_note:
            print("❌ ERROR:")
            print(soap_note["error"])
        else:
            print("✅ CONSULTATION REPORT GENERATED SUCCESSFULLY")
            print("=" * 80)
            print()
            
            print("📋 SUBJECTIVE (Patient's Perspective):")
            print("-" * 80)
            print(soap_note["subjective"])
            print()
            
            print("🔍 OBJECTIVE (Doctor's Observations):")
            print("-" * 80)
            print(soap_note["objective"])
            print()
            
            print("🩺 ASSESSMENT (Clinical Evaluation):")
            print("-" * 80)
            print(soap_note["assessment"])
            print()
            
            print("💊 PLAN (Treatment & Follow-up):")
            print("-" * 80)
            print(soap_note["plan"])
            print()
            
            if "additional_notes" in soap_note and soap_note["additional_notes"]:
                print("📝 ADDITIONAL NOTES:")
                print("-" * 80)
                print(soap_note["additional_notes"])
                print()
    
    except Exception as e:
        print(f"❌ Error during report generation: {e}")
        import traceback
        traceback.print_exc()
    
    print("=" * 80)


def test_error_cases():
    """
    Test the fail-safe mechanisms with invalid inputs.
    """
    print()
    print("=" * 80)
    print("TESTING FAIL-SAFE MECHANISMS")
    print("=" * 80)
    print()
    
    # Test 1: Empty transcription
    print("Test 1: Empty transcription")
    result = generate_soap_note("")
    if "error" in result:
        print("✅ Correctly returned error:", result["error"])
    else:
        print("❌ Should have returned error")
    print()
    
    # Test 2: Transcription with error message
    print("Test 2: Transcription with error message")
    result = generate_soap_note("Error: Could not understand audio")
    if "error" in result:
        print("✅ Correctly returned error:", result["error"])
    else:
        print("❌ Should have returned error")
    print()
    
    # Test 3: File not found error
    print("Test 3: File not found error")
    result = generate_soap_note("Error: Audio file not found at /path/to/file.wav")
    if "error" in result:
        print("✅ Correctly returned error:", result["error"])
    else:
        print("❌ Should have returned error")
    print()
    
    print("=" * 80)


if __name__ == "__main__":
    # Check if GOOGLE_API_KEY is set
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("⚠️  WARNING: GOOGLE_API_KEY environment variable is not set!")
        print("The system will fall back to basic transcription without AI analysis.")
        print()
        print("To enable AI-powered analysis:")
        print("  Windows PowerShell: $env:GOOGLE_API_KEY='your-key-here'")
        print("  Windows CMD: set GOOGLE_API_KEY=your-key-here")
        print("  Linux/Mac: export GOOGLE_API_KEY='your-key-here'")
        print()
        input("Press Enter to continue with basic mode, or Ctrl+C to exit...")
        print()
    else:
        print("✅ GOOGLE_API_KEY is set - AI analysis enabled")
        print()
    
    # Run tests
    test_with_sample_transcription()
    test_error_cases()
    
    print()
    print("Testing complete!")
