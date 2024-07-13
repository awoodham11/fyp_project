from django.urls import path, include
from rest_framework import routers
from .views import *
from . import views
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'get-users', UserViewSet, basename='get-users')
router.register(r'pending-request', PendingRequestView, basename='pending-request')
router.register(r'chat', ChatMessageViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("get-users", UserViewSet.as_view({'get': 'list'})),
    path("register", register, name='register'),

    #Edit urls
    path("edit-mode", EditModeView.as_view()),
    path("edit-profile", EditProfileView.as_view()),
    path("edit-picture", EditPictureView.as_view()),
    
    #Friend urls
    path("get-friend-count", FriendView.as_view()),
    path("send-friend-request", SendFriendRequestView.as_view()),
    path("accept-friend-request", PendingRequestResponseView.as_view()),
    path("get-details", UserDetailAPI.as_view()),
    path("get-profile-details/<str:user>", ProfileDetailsAPI.as_view()),
    
    
    #Chat urls
    path("my-messages/<int:user_id>/", MyInbox.as_view()),
    path("get-messages/<int:sender_id>/<int:receiver_id>/", views.GetMessages.as_view()),
    path("send-messages/", views.SendMessage.as_view()),

    #Get / Filter Data
    path("profile/<int:pk>", views.ProfileDetail.as_view()),
    path("search-chat/<username>", views.SearchUser.as_view()),

    #Job Board urls
    path("post-job/", UploadingJob.as_view()),
    path("job-listings/", JobListingView.as_view()),

    #posting status urls
    path("uploading-post/", UploadingPost.as_view()),
    path("all-posts/", AllPosts.as_view()),

    #map urls
    path("search-on-map/", ShowMapView.as_view()),
    path("get-place-details/", GetPlaceDetails.as_view()),
    path("report-comment/", ReportComment.as_view())
    


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)