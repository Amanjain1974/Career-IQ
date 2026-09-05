"""
jobs/services/job_aggregator.py

Fresh JSearch (RapidAPI) integration for CareerIQ.
Replaces the old, broken implementation.
"""

import logging
import requests
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

JSEARCH_HOST = "jsearch.p.rapidapi.com"
JSEARCH_URL = "https://jsearch.p.rapidapi.com/search"
CACHE_TTL_SECONDS = 60 * 10  # cache identical searches for 10 minutes


def search_jobs(query: str, location: str = "", page: int = 1) -> dict:
    """
    Search live job listings via JSearch.

    Returns a normalized dict, always in this shape:
    {
        "success": bool,
        "results": [ {title, company, location, apply_link, posted_at, source}, ... ],
        "page": int,
        "error": str | None
    }
    """
    if not query or not query.strip():
        return {"success": False, "results": [], "page": page, "error": "Query is required."}

    if not settings.RAPIDAPI_KEY:
        logger.error("RAPIDAPI_KEY is not set in settings/.env")
        return {"success": False, "results": [], "page": page, "error": "Server misconfiguration: missing API key."}

    # Build the actual search phrase JSearch expects, e.g. "developer jobs in jaipur"
    search_phrase = query.strip()
    if location:
        search_phrase = f"{search_phrase} in {location.strip()}"

    cache_key = f"jsearch:{search_phrase.lower()}:{page}"
    cached = cache.get(cache_key)
    if cached is not None:
        logger.info("JSearch cache hit for '%s'", search_phrase)
        return cached

    headers = {
        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
        "X-RapidAPI-Host": JSEARCH_HOST,
    }
    params = {
        "query": search_phrase,
        "page": str(page),
        "num_pages": "1",
    }

    try:
        response = requests.get(JSEARCH_URL, headers=headers, params=params, timeout=10)
    except requests.RequestException as exc:
        logger.error("JSearch request failed: %s", exc)
        return {"success": False, "results": [], "page": page, "error": "Could not reach job search provider."}

    # Log status + raw body for anything that isn't a clean 200, so failures are never silent
    if response.status_code != 200:
        logger.error(
            "JSearch returned status %s for query '%s'. Body: %s",
            response.status_code, search_phrase, response.text[:500],
        )
        if response.status_code == 401:
            error_msg = "Invalid or unsubscribed API key for JSearch."
        elif response.status_code == 429:
            error_msg = "Rate limit exceeded on JSearch. Try again shortly."
        else:
            error_msg = f"Job search provider returned an error (status {response.status_code})."
        return {"success": False, "results": [], "page": page, "error": error_msg}

    try:
        raw_data = response.json()
    except ValueError:
        logger.error("JSearch returned non-JSON response: %s", response.text[:500])
        return {"success": False, "results": [], "page": page, "error": "Unexpected response from job search provider."}

    raw_jobs = raw_data.get("data", [])

    if not raw_jobs:
        logger.info("JSearch returned zero results for '%s' (this may be legitimate)", search_phrase)

    normalized_results = []
    for job in raw_jobs:
        normalized_results.append({
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city") or job.get("job_country"),
            "apply_link": job.get("job_apply_link"),
            "posted_at": job.get("job_posted_at_datetime_utc"),
            "employment_type": job.get("job_employment_type"),
            "source": "jsearch",
        })

    result = {"success": True, "results": normalized_results, "page": page, "error": None}
    cache.set(cache_key, result, CACHE_TTL_SECONDS)
    return result
