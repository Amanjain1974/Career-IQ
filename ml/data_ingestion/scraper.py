import requests
from typing import List, Dict

class JobDataIngestor:
    def __init__(self, api_keys: Dict[str, str] = None):
        """
        Initializes the ingestor to fetch jobs from external APIs or perform ethical scraping.
        """
        self.api_keys = api_keys or {}
        
    def fetch_jobs(self, keywords: str, location: str, limit: int = 10) -> List[Dict]:
        """
        Fetches job postings matching the criteria.
        For production, this would integrate with APIs like Adzuna, Reed, or ethically scrape sites.
        """
        print(f"Fetching jobs for '{keywords}' in '{location}'...")
        
        # Mocking the data returned by an external API
        mock_jobs = [
            {
                "company": "DataTech Solutions",
                "role": "Senior Data Engineer",
                "location": location,
                "work_mode": "Remote",
                "description": "We are looking for a Data Engineer with heavy PySpark, SQL, and AWS experience.",
                "url": "https://example.com/job/1"
            },
            {
                "company": "FinAI",
                "role": "Machine Learning Engineer",
                "location": location,
                "work_mode": "Hybrid",
                "description": "Join our quant team. Requires strong Python, Pandas, and deep learning knowledge.",
                "url": "https://example.com/job/2"
            }
        ]
        
        return mock_jobs[:limit]
