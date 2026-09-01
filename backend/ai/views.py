from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# In a real scenario, these would be imported from the `ml` package
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from ml.generation.resume_builder import ATSResumeBuilder
from ml.generation.cover_letter import CoverLetterGenerator
from ml.evaluation.qa_engine import ResumeQAEngine

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tailor_resume(request):
    job_id = request.data.get('job_id')
    # Fetch profile and job...
    
    builder = ATSResumeBuilder()
    result = builder.build_tailored_resume(candidate_profile={}, job_description={})
    
    qa = ResumeQAEngine()
    qa_result = qa.evaluate_resume(original_profile={}, generated_resume=result, job_description={})
    
    return Response({
        "resume": result,
        "qa_report": qa_result
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_cover_letter(request):
    job_id = request.data.get('job_id')
    style = request.data.get('style', 'professional')
    
    generator = CoverLetterGenerator()
    result = generator.generate(candidate_profile={}, job_description={}, style=style)
    
    return Response({
        "cover_letter": result
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_interview_prep(request):
    job_id = request.data.get('job_id')
    
    # Mocking interview questions generation
    questions = [
        {"type": "Behavioral", "question": "Tell me about a time you had to optimize a slow-performing system.", "tips": "Use the STAR method. Focus on specific metrics (e.g. reduced latency by 40%)."},
        {"type": "Technical", "question": "How would you design a data pipeline to process 10,000 events per second?", "tips": "Discuss Kafka/Kinesis, stream processing (Flink/Spark), and idempotent writes."},
        {"type": "Role-Specific", "question": "What is your approach to ensuring data quality across different sources?", "tips": "Mention data validation checks, schema registries, and alerting mechanisms."}
    ]
    
    return Response({
        "questions": questions
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def negotiate_salary(request):
    job_id = request.data.get('job_id')
    current_offer = request.data.get('current_offer', '')
    target_salary = request.data.get('target_salary', '')
    tone = request.data.get('tone', 'appreciative')

    # Mocking the AI negotiation generation
    email_body = f"""Dear Hiring Manager,

Thank you so much for extending this offer. I am thrilled about the opportunity to join the team.

Before I sign, I would like to discuss the base salary. Given my specialized experience and the market rate for this level of responsibility, I was hoping we could explore a figure closer to {target_salary}. (Currently offered: {current_offer})

I am very excited to bring my skills to the team and hope we can find a number that works for both of us.

Best regards,
[Your Name]"""

    return Response({
        "negotiation_email": email_body
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def summarize_job(request):
    job_id = request.data.get('job_id')
    # Mocking the AI summarization
    summary = [
        "Responsible for building scalable data pipelines using Python and Airflow.",
        "Requires 3+ years of experience with distributed systems and SQL optimization.",
        "Tech Stack: Python, Kafka, Airflow, PostgreSQL, AWS."
    ]
    return Response({
        "summary": summary
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def match_job(request):
    job_id = request.data.get('job_id')
    from jobs.models import Job
    from django.shortcuts import get_object_or_404
    job = get_object_or_404(Job, id=job_id)
    
    from candidates.models import CandidateProfile
    profile = CandidateProfile.objects.filter(user=request.user).first()
    
    # Mock AI logic: generate a score between 75 and 99
    import random
    base_score = 75
    if profile and profile.target_roles and job.role.lower() in profile.target_roles.lower():
        base_score = 90
        
    score = base_score + random.randint(0, 9)
    reason = f"Your background aligns well with {job.company}'s requirements." if score >= 85 else f"Some skills match, but {job.role} may require further experience."
    
    return Response({
        "match_score": score,
        "reason": reason
    })
