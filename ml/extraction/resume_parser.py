class ResumeParser:
    def __init__(self, llm_provider="gemini"):
        self.llm_provider = llm_provider

    def parse(self, file_path_or_text):
        """
        Extracts structured data from a resume.
        Uses deterministic parsing as a first layer, LLM as a fallback.
        """
        # Mock extracted data
        return {
            "contact": {
                "email": "candidate@example.com",
                "phone": "555-0199"
            },
            "education": [
                {"degree": "B.S. Computer Science", "institution": "State University"}
            ],
            "experience": [
                {"role": "Software Engineer", "company": "Tech Corp", "years": 2}
            ],
            "skills": ["Python", "Django", "React", "SQL"]
        }
