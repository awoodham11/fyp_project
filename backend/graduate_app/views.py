from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from django.views import View
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import viewsets
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import *
from .models import *
from django.views.generic import ListView, CreateView
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Profile
from django.db import transaction, IntegrityError

from django.db.models import *
import datetime
import requests
import json
import io


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        qs = User.objects.all()
        username = self.request.query_params.get('username') 
        if username is not None:
            qs = qs.filter(username__icontains=username)
        return qs
    

@csrf_exempt
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
class EditModeView(APIView):
    serializer_class = ModeSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)
        serializer = ModeSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)

        serializer = ModeSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            print('error', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditProfileView(APIView):
    serializer_class = ProfileSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)
        print("inside post")
        print(request.data)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            print('error', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditPictureView(APIView):
    serializer_class = ImageSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)
        serializer = ImageSerializer(profile)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)

        serializer = ImageSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            print('error', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    

class ProfileSearchAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get(self, *args, **kwargs):
        profile = Profile.objects.filter(user__username=kwargs['user']).first()
        return profile

    
class ProfileDetailsAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    queryset = Profile.objects.all()

    def get(self, request, *args, **kwargs):
        profile = ProfileSearchAPI.get(self, user=kwargs["user"])
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

class FriendView(APIView):
    authentication_classes = (TokenAuthentication,)
    queryset = Profile.objects.all()
    serializer_class = FriendsSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)
        serializer = FriendsSerializer(profile, context={'request': request})
        friends = profile.friends.count()
        return Response(friends)
    
class SendFriendRequestView(generics.CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    serializer_class = CreateFriendRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        from_user = request.user.profile
        to_user_str = validated_data['to_user']

        try:
            user = User.objects.get(username=to_user_str)
            to_user = Profile.objects.get(user=user)

            queryset = FriendRequest.objects.filter(from_user=from_user)
            queryset = queryset.filter(to_user=user.profile)
            if queryset.exists():
                return Response({'error': 'You have already sent a friend request to this user.'}, status=400)
            
        except:
            return Response({'error': 'User cannot be found.'}, status=400)
        if from_user == to_user:
            return Response({'error': 'You cannot send a friend request to yourself.'}, status=400)
        if from_user.friends.filter(id=to_user.id).exists():
            return Response({'error': 'You are already friends with this user.'}, status=400)
        friend_request = FriendRequest(from_user=from_user, to_user=to_user, status='pending')
        friend_request.save()
        return Response({'status': 'Friend request sent.'}, status=201)

class PendingRequestView(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get_queryset(self, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user.id)
        try:
            queryset = FriendRequest.objects.filter(to_user=profile).filter(status='pending')
            return queryset
        except:
            return FriendRequest.objects.none()

class PendingRequestResponseView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]
    serializer_class = RespondFriendRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            profile = Profile.objects.get(user=self.request.user.id)
            friend_request_id = serializer.validated_data['id']
            friend_request = FriendRequest.objects.get(id=friend_request_id)
            if friend_request.to_user != profile:
                return Response({'error': 'You do not have permission to respond to this request.'}, status=400)
            if friend_request.status != 'pending':
                return Response({'error': 'This request has already been responded to.'}, status=400)
            response = serializer.validated_data['status']
            if response == 'accepted':
                friend_request.status = 'accepted'
                friend_request.save()
                profile.friends.add(friend_request.from_user)
                profile.save()
                friend_request.from_user.friends.add(profile)
                friend_request.from_user.save()
                return Response({'status': 'Friend request accepted.'}, status=200)
            elif response == 'declined':
                friend_request.status = 'declined'
                friend_request.save()
                friend_request.from_user.save()
                return Response({'status': 'Friend request declined.'}, status=200)
            else:
                return Response({'error': 'Invalid response.'}, status=400)
        else:
            return Response(serializer.errors, status=400)


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

class MyInbox(generics.ListAPIView):
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        messages = ChatMessage.objects.filter(
            Q(sender__id=user_id) | Q(receiver__id=user_id)
        ).distinct().order_by('-timestamp')  

        return messages

    
class GetMessages(APIView):
    serializer_class = ChatMessageSerializer

    def get(self, request, *args, **kwargs):
        messages = self.get_queryset()
        serializer = self.serializer_class(messages, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        sender_id = self.kwargs['sender_id']
        receiver_id = self.kwargs['receiver_id']

        messages = ChatMessage.objects.filter(
            (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) | 
            (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
        ).order_by('timestamp')
        return messages


class SendMessage(generics.CreateAPIView):
    serializer_class = MessageSerializer

class ProfileDetail(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    

class SearchUser(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        logged_in_user = self.request.user

        
        query = Q(user__username__icontains=username) | Q(name__icontains=username) | Q(email__icontains=username)

        
        if logged_in_user.is_authenticated:
            query &= ~Q(user=logged_in_user)

        users = Profile.objects.filter(query)

        if not users.exists():
            return Response(
                {"detail": "No users found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
    

class JobPostView(APIView):
    serializer_class = JobListingSerializer

    def post(self, request, format=None):
        serializer = JobListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(csrf_exempt, name='dispatch')
class UploadingJob(View):

    def post(self, request):
        data = json.loads(request.body)
        user_id = data['userId']
        description = data['description']
        company_name = data['company_name']
        title = data['title']
        location = data['location']
        if description:
            user = User.objects.get(pk=user_id)
            post = JobListing.objects.create(user=user, description=description, location=location,
                                             company_name=company_name,
                                             title=title)
        else:
            return JsonResponse({'success': False})
        
        return JsonResponse({'success': True})

class JobListingAPIView(generics.ListAPIView):
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer

@method_decorator(csrf_exempt, name='dispatch')
class JobListingView(View):
    def get(self, request):
        posts = JobListing.objects.all()
        posts_list = [{'username': post.user.username, 
                       'title': post.title,
                       'company_name': post.company_name,
                       'location': post.location,
                       'description': post.description} for post in posts]
        return JsonResponse({'posts': posts_list})


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'userId': user.pk
        })

@method_decorator(csrf_exempt, name='dispatch')
class ShowMapView(View):
    API_KEY = "AIzaSyA398smOp0rx5hhahTvaM3S0S6fNZQnR6Y"

    def get(self, request, *args, **kwargs):
        london_location = '51.5072,0.1276'
        search_radius = 75000
        
        selected_filter = request.GET.get('filter', 'restaurant')

        nearby_places = self.get_nearby_places(location=london_location, radius=search_radius, keyword=selected_filter)

        places_data = []
        for place in nearby_places:
            latitude = place.get('geometry', {}).get('location', {}).get('lat', None)
            longitude = place.get('geometry', {}).get('location', {}).get('lng', None)
            place_id = place.get('place_id')
            name = place.get('name', '')
            formatted_address = place.get('vicinity', '')

            existing_place = Place.objects.filter(place_id=place_id).first()
            if not existing_place:
                new_place = Place.objects.create(
                    place_id=place_id,
                    name=name,
                    address=formatted_address,
                    latitude=latitude,
                    longitude=longitude
                )
                new_place.save()

            places_data.append({
                'latitude': latitude,
                'longitude': longitude,
                'place_id': place_id,
                'address': formatted_address,

            })
        
        return JsonResponse({'places': places_data})
    

    def post(self, request):
        data = json.loads(request.body)
        place_id = data.get('place_id')
        comment_text = data.get('comment')
        rating_value = data.get('rating')

        user_id = data.get('userId')

        user = User.objects.get(id=user_id)

        if place_id and user.is_authenticated:
            try:
                place, created = Place.objects.get_or_create(place_id=place_id)

                if created:
                    place.name = data.get('name', '')
                    place.address = data.get('formatted_address', '')
                    place.latitude = data.get('latitude', None)
                    place.longitude = data.get('longitude', None)
                    place.save()

                if comment_text:
                    comment_user = User.objects.get(username=user.username)
                    comment = Comment.objects.create(place=place, text=comment_text, user=comment_user, rating=rating_value)

                comments = Comment.objects.filter(place=place)

                comments_data = [{'user_name': comment.user.username, 'text': comment.text, 'rating': comment.rating} for comment in comments]


                place_data = {
                    'name': place.name,
                    'address': place.address,
                    'comments': comments_data,
                    'photos': [] 
                }

                return JsonResponse(place_data)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'}, status=400)
        else:
            return JsonResponse({'error': 'Place ID not provided or user not authenticated'}, status=400)


    def get_nearby_places(self, location, radius=500, keyword='restaurant'):
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            'location': location,
            'radius': radius,
            'keyword': keyword,
            'key': self.API_KEY
        }

        response = requests.get(url, params=params)
        data = response.json()

        if response.status_code == 200 and data.get('status') == 'OK':
            return data.get('results', [])
        else:
            return []


@method_decorator(csrf_exempt, name='dispatch')
class GetPlaceDetails(View):

    def post(self, request):
        place_id = request.GET.get('place_id')
        
        try:
            place = Place.objects.get(place_id=place_id)
        except Place.DoesNotExist:
            return JsonResponse({'error': 'Place not found'}, status=404)

        # Fetch comments for the place
        comments = Comment.objects.filter(place=place)

        # Prepare data to send in the response
        comments_data = [{'user_name': comment.user.username, 'text': comment.text, 'rating': comment.rating, 'commentId': comment.pk, 'commentUserId': comment.user.pk} for comment in comments]

        place_data = {
            'name': place.name,
            'address': place.address,
            'comments': comments_data,
            }

        return JsonResponse(place_data)

    
@method_decorator(csrf_exempt, name='dispatch')
class ReportComment(View):
    def post(self, request):
        
        data = json.loads(request.body)

        commentId = data.get("commentId")
        userId = data.get('userId')
        commentUserId = data.get('commentUserId')
        

        if userId == commentUserId:
            
            return JsonResponse({'success': False, 'error': 'User cannot report his own comment'})
        
        try:
            user = User.objects.get(pk=userId)
            comment = Comment.objects.get(pk=commentId)
            
            report  = Report.objects.filter(user=user,comment=comment)

            if report:
                return JsonResponse({'success': False, 'error': 'User cannot report a comment more than once'})
            else:
                report = Report.objects.create(user=user, comment=comment)
                comment.reported_count += 1
                comment.save()
                
                if comment.reported_count >=3:
                    comment.delete()
                    return JsonResponse({'deleted': True})
                else:
                    return JsonResponse({'success': True})
                
        except Comment.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Comment does not exist'})
        
@method_decorator(csrf_exempt, name='dispatch')
class UploadingPost(View):

    def post(self, request):
        data = json.loads(request.body)
        user_id = data['userId']
        content = data['postContent']
        if content:
            user = User.objects.get(pk=user_id)
            post = Post.objects.create(user=user, content=content)
        else:
            return JsonResponse({'success': False})
        
        return JsonResponse({'success': True})
    

@method_decorator(csrf_exempt, name='dispatch')
class AllPosts(View):

    def get(self, request):
        posts = Post.objects.all()
        posts_list = [{'username': post.user.username, 'content': post.content} for post in posts]
        return JsonResponse({'posts': posts_list})