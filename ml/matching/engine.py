class MatchingEngine:
    def __init__(self):
        pass

    def calculate_match(self, candidate_profile, job_description):
        """
        4-Layer Matching Engine:
        Layer 1 - Structured matching
        Layer 2 - Semantic matching (embeddings)
        Layer 3 - Feature engineering
        Layer 4 - ML model (Mocked for now)
        """
        
        # Mock logic
        technical_score = 92
        experience_score = 81
        education_score = 100
        semantic_score = 89
        
        overall = (technical_score * 0.4 + experience_score * 0.3 + 
                   education_score * 0.1 + semantic_score * 0.2)
                   
        return {
            "overall_match": round(overall),
            "breakdown": {
                "technical_skills": technical_score,
                "experience": experience_score,
                "education": education_score,
                "semantic_relevance": semantic_score
            },
            "strong_matches": ["Python", "SQL", "Azure"],
            "skill_gaps": ["Airflow"],
            "experience_gap": "Candidate has 2 years, job requests 3+."
        }
