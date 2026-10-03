from django.urls import path

from . import views_auth, views_videos

urlpatterns = [
    path("auth/signup/", views_auth.signup),
    path("auth/login/", views_auth.login_view),
    path("auth/logout/", views_auth.logout_view),
    path("auth/me/", views_auth.me),

    path("videos/", views_videos.video_list),
    path("videos/<slug:slug>/", views_videos.video_detail),
]