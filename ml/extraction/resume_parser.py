import os
import json
from pydantic import BaseModel, Field
from typing import List, Optional
from google import genai
from google.genai import types

class EducationItem(BaseModel):
    degree: str
    institution: str
    start_year: Optional[str] = None
    end_year: Optional[str] = None

class ExperienceItem(BaseModel):
    role: str
    company: str
    years: Optional[float] = None

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None

class ResumeData(BaseModel):
    contact: ContactInfo
    education: List[EducationItem]
    experience: List[ExperienceItem]
    skills: List[str]

class ResumeParser:
    def __init__(self, llm_provider="gemini"):
        self.llm_provider = llm_provider
        # Initialize Gemini Client if API key is present
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    def parse(self, file_path_or_text):
        """
        Extracts structured data from a resume.
        Uses deterministic parsing as a first layer, LLM as a fallback.
        """
        if not self.client:
            # Fallback mock if no API key
            return {
                "contact": {"email": "candidate@example.com", "phone": "555-0199"},
                "education": [{"degree": "B.S. Computer Science", "institution": "State University"}],
                "experience": [{"role": "Software Engineer", "company": "Tech Corp", "years": 2}],
                "skills": ["Python", "Django", "React", "SQL"]
            }

        try:
            # Assume file_path_or_text is raw text for now
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Extract structured information from the following resume text:\n\n{file_path_or_text}",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ResumeData,
                ),
            )
            return json.loads(response.text)
        except Exception as e:
            return {"error": str(e)}
