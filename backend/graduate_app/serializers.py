from rest_framework import serializers, generics
from django.contrib.auth.models import User
from .models import *
from rest_framework.response import Response
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['user', 'name', 'occupation', 'bio', 'email', 'hobbies', 'interests', 'facebook', 'twitter', 'instagram', 'is_private', 'dark_mode']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        profile, created = Profile.objects.update_or_create(user=user, defaults=validated_data)
        return profile
    
class UserRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return {'id': value.id, 'username': value.username}

    def to_internal_value(self, data):
        return User.objects.get(id=data)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_picture']


    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance
    
    def save(self, **kwargs):
        profile_image = self.validated_data['profile_picture']
        instance = self.instance
        instance.profile_image = profile_image
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2') 
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()

        Profile.objects.create(
            user=user,
            email=validated_data['email'],
            name=validated_data['first_name'] + ' ' + validated_data['last_name']
        )

        return user


class ModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['is_private', 'dark_mode']


class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['friends']

class UserRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return {'id': value.id, 'username': value.username}

    def to_internal_value(self, data):
        return User.objects.get(id=data)

class RespondFriendRequestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = FriendRequest
        fields = ['id', 'status']

class CreateFriendRequestSerializer(serializers.ModelSerializer):
    to_user = serializers.CharField()

    class Meta:
        model = FriendRequest
        fields = ['to_user',]

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserRelatedField(source='from_user.user', read_only=True)
    to_user = UserRelatedField(source='to_user.user', read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'to_user', 'from_user', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp']


class MessageSerializer(serializers.ModelSerializer):
    receiver_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'sender', 'sender_profile', 'receiver', 
                  'receiver_profile', 'message', 'is_read', 'timestamp']

class JobListingSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = JobListing
        fields = ['id', 'user', 'sender', 'company_name', 'title', 'description', 'location']

    
class PostSerializer(serializers.ModelSerializer):
    post_sender = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'post_sender', 'content', 'created_at']