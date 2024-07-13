from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import *

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'name']

class TodoAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'title', 'completed', 'date']

class RequestAdmin(admin.ModelAdmin):
    list_display = ('to_user','from_user','status')

class ChatMessageAdmin(admin.ModelAdmin):
    list_editable = ['is_read']
    list_display = ['sender', 'receiver', 'message', 'is_read']

class JobBoardAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'title', 'description', 'location']

class PostAdmin(admin.ModelAdmin):
    list_display = ['user', 'content', 'created_at']

admin.site.register(Profile, ProfileAdmin)
admin.site.register(FriendRequest, RequestAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)
admin.site.register(JobListing, JobBoardAdmin)
admin.site.register(Post, PostAdmin)
