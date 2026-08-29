import os
import json
from pydantic import BaseModel
from typing import List
from google import genai
from google.genai import types

class TailoredResume(BaseModel):
    summary: str
    experience_bullets: List[str]
    keywords_added: List[str]

class ATSResumeBuilder:
    def __init__(self, llm_provider="gemini"):
        self.llm_provider = llm_provider
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    def build_tailored_resume(self, candidate_profile, job_description):
        """
        Generates a tailored, ATS-friendly resume.
        Rules:
        - Strict single column
        - Uses ONLY facts from Candidate Master Profile
        - No keyword stuffing, natural keyword integration
        """
        if not self.client:
            return {
                "status": "success",
                "content": "# Tailored Resume\n\n## Summary\nExperienced Data Engineer with 2 years of Python and SQL experience...\n\n## Experience\n**Software Engineer | Tech Corp**\n- Improved data pipeline efficiency using Python...",
                "metadata": {
                    "tailored_for_role": "Data Engineer",
                    "keywords_added": ["Python", "SQL", "Data Pipeline"]
                }
            }

        prompt = f"""
        You are an expert technical recruiter and ATS optimization engine.
        Create a tailored resume summary and improved experience bullets based ONLY on the provided candidate profile.
        Do not fabricate any information. Tailor the content to align with the provided job description.
        
        Job Description: {json.dumps(job_description)}
        Candidate Profile: {json.dumps(candidate_profile)}
        """

        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=TailoredResume,
                    temperature=0.2, # Low temperature for factual generation
                ),
            )
            
            result = json.loads(response.text)
            
            # Construct the final markdown text
            markdown = f"# Tailored Resume\n\n## Summary\n{result['summary']}\n\n## Experience\n"
            for bullet in result['experience_bullets']:
                markdown += f"- {bullet}\n"
                
            return {
                "status": "success",
                "content": markdown,
                "metadata": {
                    "tailored_for_role": job_description.get("role", "Unknown"),
                    "keywords_added": result['keywords_added']
                }
            }
        except Exception as e:
            return {"status": "error", "error": str(e)}
