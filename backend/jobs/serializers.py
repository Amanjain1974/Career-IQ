from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    is_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(job=obj, candidate__user=request.user).exists()
        return False

class ApplicationSerializer(serializers.ModelSerializer):
    company = serializers.ReadOnlyField(source='job.company')
    role = serializers.ReadOnlyField(source='job.role')

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('match_score', 'candidate')
