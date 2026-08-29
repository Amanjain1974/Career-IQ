class CoverLetterGenerator:
    def __init__(self, llm_provider="gemini"):
        self.llm_provider = llm_provider

    def generate(self, candidate_profile, job_description, style="professional"):
        """
        Generates a tailored cover letter without inventing facts.
        """
        # Mock logic
        return {
            "status": "success",
            "content": "Dear Hiring Manager,\n\nI am writing to express my interest in the Data Engineer role at your company. With my background in Python and SQL at Tech Corp, I am confident I can contribute to your team...\n\nSincerely,\nCandidate"
        }
