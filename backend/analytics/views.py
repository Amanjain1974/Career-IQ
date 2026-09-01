from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from jobs.models import Application

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Returns aggregated stats for the user's dashboard.
    """
    applications = Application.objects.filter(candidate__user=request.user)
    
    total_apps = applications.count()
    interviews = applications.filter(status='Interview').count()
    rejections = applications.filter(status='Rejected').count()
    offers = applications.filter(status='Offer').count()
    
    interview_rate = (interviews / total_apps * 100) if total_apps > 0 else 0
    
    # Calculate average fit score
    from django.db.models import Avg
    avg_score = applications.aggregate(Avg('match_score'))['match_score__avg'] or 0
    
    # Weekly goals
    from django.utils import timezone
    import datetime
    one_week_ago = timezone.now() - datetime.timedelta(days=7)
    apps_this_week = applications.filter(applied_date__gte=one_week_ago).count()
    
    from candidates.models import CandidateProfile
    profile = CandidateProfile.objects.filter(user=request.user).first()
    weekly_goal = profile.weekly_application_goal if profile else 10
    
    return Response({
        "total_applications": total_apps,
        "interviews": interviews,
        "rejections": rejections,
        "offers": offers,
        "interview_rate": round(interview_rate, 2),
        "most_common_skill_gaps": ["Airflow", "Kafka", "Kubernetes"],
        "average_fit_score": round(avg_score, 1),
        "apps_this_week": apps_this_week,
        "weekly_goal": weekly_goal
    })
