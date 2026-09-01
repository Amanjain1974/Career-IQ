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

