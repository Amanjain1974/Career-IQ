import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")

def fetch_realtime_jobs(query, num_pages=1):
    """
    Fetches real-time job listings using JSearch API (via RapidAPI).
    If no API key is set, returns mock data for demonstration.
    """
    if not RAPIDAPI_KEY:
        # Mock data if API key is not configured
        return _get_mock_jobs(query)

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }
    
    params = {
        "query": query,
        "page": "1",
        "num_pages": str(num_pages),
        "date_posted": "week"
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json().get("data", [])
        
        # Transform third-party API data into our CareerIQ Job schema
        return _transform_jsearch_data(data)
    except Exception as e:
        print(f"Error fetching from JSearch API: {e}")
        return []

def _transform_jsearch_data(data):
    jobs = []
    for item in data:
        salary_range = ""
        if item.get("job_min_salary") and item.get("job_max_salary"):
            salary_range = f"${item['job_min_salary']} - ${item['job_max_salary']}"
            
        jobs.append({
            "id": f"api_{item.get('job_id')}", # Temporary ID for frontend
            "company": item.get("employer_name", "Unknown"),
            "role": item.get("job_title", "Unknown Role"),
            "location": f"{item.get('job_city', '')}, {item.get('job_country', '')}".strip(", "),
            "work_mode": "Remote" if item.get("job_is_remote") else "On-site",
            "experience_level": str(item.get("job_required_experience", {}).get("required_experience_in_months", "Not specified")),
            "salary_range": salary_range,
            "description": item.get("job_description", "")[:500] + "...", # Truncated for search results
            "url": item.get("job_apply_link", ""),
            "source": item.get("employer_website") or "LinkedIn/JSearch",
            "posted_date": item.get("job_posted_at_datetime_utc", "").split("T")[0] if item.get("job_posted_at_datetime_utc") else None
        })
    return jobs

def _get_mock_jobs(query):
    return [
        {
            "id": "mock_1",
            "company": "TechCorp (Mock)",
            "role": f"Senior {query} Engineer",
            "location": "San Francisco, CA",
            "work_mode": "Hybrid",
            "experience_level": "5+ years",
            "salary_range": "$140k - $180k",
            "description": f"We are looking for an experienced {query} engineer to join our fast-paced team. This is mock data from our aggregator API.",
            "url": "https://linkedin.com/jobs/mock",
            "source": "LinkedIn API (Mock)",
            "posted_date": datetime.now().strftime("%Y-%m-%d")
        },
        {
            "id": "mock_2",
            "company": "StartupX (Mock)",
            "role": f"{query} Developer",
            "location": "Remote",
            "work_mode": "Remote",
            "experience_level": "Entry level",
            "salary_range": "$80k - $110k",
            "description": f"Join our exciting startup building the future of {query} applications. This is mock data from our aggregator API.",
            "url": "https://naukri.com/jobs/mock",
            "source": "Naukri API (Mock)",
            "posted_date": datetime.now().strftime("%Y-%m-%d")
        }
    ]
