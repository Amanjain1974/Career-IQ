from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    company = serializers.ReadOnlyField(source='job.company')
    role = serializers.ReadOnlyField(source='job.role')

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('match_score', 'candidate')
