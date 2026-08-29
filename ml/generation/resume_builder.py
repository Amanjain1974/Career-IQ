class ATSResumeBuilder:
    def __init__(self, llm_provider="gemini"):
        self.llm_provider = llm_provider

    def build_tailored_resume(self, candidate_profile, job_description):
        """
        Generates a tailored, ATS-friendly resume.
        Rules:
        - Strict single column
        - Uses ONLY facts from Candidate Master Profile
        - No keyword stuffing, natural keyword integration
        """
        # Mock logic for generation
        return {
            "status": "success",
            "content": "# Tailored Resume\n\n## Summary\nExperienced Data Engineer with 2 years of Python and SQL experience...\n\n## Experience\n**Software Engineer | Tech Corp**\n- Improved data pipeline efficiency using Python...",
            "metadata": {
                "tailored_for_role": "Data Engineer",
                "keywords_added": ["Python", "SQL", "Data Pipeline"]
            }
        }
