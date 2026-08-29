from django.db import models

class Job(models.Model):
    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    work_mode = models.CharField(max_length=50, blank=True) # Remote, Hybrid, On-site
    experience_level = models.CharField(max_length=100, blank=True)
    salary_range = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    required_skills = models.JSONField(default=list, blank=True)
    preferred_skills = models.JSONField(default=list, blank=True)
    url = models.URLField(blank=True)
    posted_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Scam Detection
    risk_score = models.CharField(max_length=20, default='LOW RISK') # LOW, MEDIUM, HIGH
    risk_reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.role} at {self.company}"

class Application(models.Model):
    # Avoid circular import, use string reference
    candidate = models.ForeignKey('candidates.CandidateProfile', on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, default='Saved') # Saved, Applied, Interview, Rejected, Offer
    match_score = models.FloatField(null=True, blank=True)
    applied_date = models.DateField(null=True, blank=True)
    follow_up_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.candidate.user.username} - {self.job.role}"
