from django.contrib.auth.models import User
from django.db import models
from django.db.models import Count, Q
from django.db.models.signals import post_save
from django.dispatch import receiver

import datetime

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.TextField(default="")
    occupation = models.TextField(default="")
    bio = models.TextField(default="")
    email = models.TextField(default="")
    hobbies = models.TextField(default="")
    interests = models.TextField(default="")
    facebook = models.URLField(default="",max_length=200, blank=True)
    twitter = models.URLField(default="",max_length=200, blank=True) 
    instagram = models.URLField(default="",max_length=200, blank=True)
    friends = models.ManyToManyField('self')
    profile_picture = models.ImageField(default='media/profile_pictures/default.jpg', upload_to='media/profile_pictures')
    is_private = models.BooleanField(default=False)
    dark_mode = models.BooleanField(default= False)

    def __str__(self):
        return self.user.username
    
    def get_name(self):
        if not self.name:
            return self.user.username
        else:
            return self.name

    def get_firstName(self):
        return self.user.first_name
    
    def get_lastName(self):
        return self.user.last_name
    
    
class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=1000)
    completed = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title[:30]


class FriendRequest(models.Model):
    from_user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friend_requests_sent')
    to_user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="friend_requests_received")
    status = models.CharField(max_length=20, choices=(('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')))
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['timestamp']
        verbose_name_plural = "Message"

    def __str__(self):
        return f"{self.sender} - {self.receiver}"
    
    @property
    def sender_profile(self):
        sender_profile = Profile.objects.get(user=self.sender)
        return sender_profile
    
    @property
    def receiver_profile(self):
        receiver_profile = Profile.objects.get(user=self.receiver)
        return receiver_profile
    



class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)


class GroupChat(models.Model):
    members = models.ManyToManyField(User)
    title = models.CharField(max_length=100)
    topic = models.CharField(max_length=100, blank=True, null=True)  # for topic-based channels

    def __str__(self):
        return self.title
    

class MentorProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expertise = models.TextField()
    achievements = models.TextField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username


class Event(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_time = models.DateTimeField()
    location = models.CharField(max_length=200)
    attendees = models.ManyToManyField(User, related_name='events_attending')

    def __str__(self):
        return self.title

class JobListing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="job_sender")
    company_name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='post_sender')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    
class Place(models.Model):
    place_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
    
    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)],default=None)
    comment_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)],default=None, null=True)
    reported_count = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.user.username} - {self.place.name}'

class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)



@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()