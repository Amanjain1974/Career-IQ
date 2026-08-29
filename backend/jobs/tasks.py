from celery import shared_task
from django.core.mail import send_mail
from .models import Job

@shared_task
def send_new_job_matches_email(user_email, jobs_data):
    """
    Sends an email to the candidate when new high-fit jobs are found.
    """
    subject = f"{len(jobs_data)} New High-Fit Jobs Found for You!"
    message = "We found the following jobs that match your profile:\n\n"
    for job in jobs_data:
        message += f"- {job['role']} at {job['company']} (Match: {job['match_score']}%)\n"
    
    send_mail(
        subject,
        message,
        'noreply@careeriq.com',
        [user_email],
        fail_silently=False,
    )
    return f"Sent email to {user_email}"

@shared_task
def fetch_daily_jobs():
    """
    Scheduled task to run daily and aggregate jobs from external sources.
    """
    import sys
    import os
    sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
    from ml.data_ingestion.scraper import JobDataIngestor
    
    ingestor = JobDataIngestor()
    
    # In production, we'd loop over active users' saved preferences
    new_jobs = ingestor.fetch_jobs(keywords="Data Engineer", location="Remote")
    
    saved_count = 0
    for job_data in new_jobs:
        # Check if exists (simplified version of duplicate detection)
        if not Job.objects.filter(url=job_data['url']).exists():
            Job.objects.create(**job_data)
            saved_count += 1
            
    return f"Aggregated {saved_count} new jobs."
