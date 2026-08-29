import os
from ml.extraction.resume_parser import ResumeParser
from ml.generation.resume_builder import ATSResumeBuilder

def test_pipeline():
    print("Testing ML Pipeline End-to-End...")
    
    # 1. Parse Resume
    parser = ResumeParser()
    sample_resume = "John Doe. Contact: john@example.com. Experience: 3 years as a Backend Developer at StartupX using Python, Django, and PostgreSQL. Education: BS in CS from Tech University."
    
    print("\n--- Parsing Resume ---")
    parsed_data = parser.parse(sample_resume)
    print(parsed_data)
    
    # 2. Build Tailored Resume
    builder = ATSResumeBuilder()
    job_desc = {
        "role": "Senior Python Engineer",
        "description": "Looking for an expert Python developer with Django and SQL experience to build scalable backend systems."
    }
    
    print("\n--- Building Tailored Resume ---")
    tailored_resume = builder.build_tailored_resume(parsed_data, job_desc)
    print(tailored_resume['content'] if 'content' in tailored_resume else tailored_resume)

if __name__ == "__main__":
    # Note: Requires GEMINI_API_KEY environment variable to use real LLM
    test_pipeline()
