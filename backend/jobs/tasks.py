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
