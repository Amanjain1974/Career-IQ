from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from candidates.models import CandidateProfile
from .services.job_aggregator import search_jobs

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['company', 'role', 'description']

    @action(detail=True, methods=['post'])
    def match(self, request, pk=None):
        job = self.get_object()
        # Mocking match logic
        match_score = 85.0
        return Response({"job": job.role, "match_score": match_score, "details": "Matches well on Python and SQL."})

    @action(detail=False, methods=["get"], url_path="search_realtime")
    def search_realtime(self, request):
        query = request.query_params.get("query", "").strip()
        location = request.query_params.get("location", "").strip()
        page = request.query_params.get("page", "1")

        try:
            page = int(page)
        except ValueError:
            page = 1

        if not query:
            return Response(
                {"success": False, "results": [], "error": "Query parameter 'query' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = search_jobs(query=query, location=location, page=page)

        if not result["success"]:
            # Distinguish "no results" (still success) from an actual failure
            return Response(result, status=status.HTTP_502_BAD_GATEWAY)

        return Response(result, status=status.HTTP_200_OK)

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['job__company', 'job__role', 'notes']

    def get_queryset(self):
        # Phase 32: Archiving support. 
        # By default, exclude archived unless specifically requested via query param.
        qs = Application.objects.filter(candidate__user=self.request.user).order_by('-updated_at')
        archived = self.request.query_params.get('archived', 'false').lower() == 'true'
        if not archived:
            qs = qs.filter(is_archived=False)
        return qs

    def perform_create(self, serializer):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        serializer.save(candidate=profile)

    def perform_update(self, serializer):
        if 'status' in serializer.validated_data:
            from django.utils import timezone
            serializer.save(status_updated_at=timezone.now())
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def reminders(self, request):
        from datetime import date
        today = date.today()
        # Get applications that need follow up (status is Applied or Interview, and date is past or today)
        qs = self.get_queryset().filter(
            follow_up_date__lte=today,
            status__in=['Applied', 'Interview']
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
