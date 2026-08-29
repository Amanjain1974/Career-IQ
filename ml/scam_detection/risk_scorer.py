class RiskScorer:
    def __init__(self):
        pass

    def analyze_job(self, job_description, company_info, url):
        """
        Analyzes a job posting for potential scams or high-risk signals.
        Signals:
        - Suspicious external URLs
        - Unrealistic salary claims
        - Requests for sensitive information
        """
        # Mock logic
        signals = []
        risk_level = "LOW RISK"
        
        if "whatsapp" in job_description.lower() or "telegram" in job_description.lower():
            signals.append("Requests communication outside professional channels")
            risk_level = "MEDIUM RISK"
            
        if "bank account" in job_description.lower():
            signals.append("Requests sensitive financial information")
            risk_level = "HIGH RISK"

        return {
            "risk_score": risk_level,
            "reasons": signals
        }
