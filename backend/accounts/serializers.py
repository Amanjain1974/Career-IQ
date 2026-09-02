from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'password')

    def create(self, validated_data):
        # We need to make sure empty email doesn't violate unique constraint
        email = validated_data.get('email', '')
        if not email:
            import uuid
            email = f"{uuid.uuid4()}@example.com" # Temporary unique email
            
        user = User.objects.create_user(
            username=validated_data['username'],
            email=email,
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', '')
        )
        return user
