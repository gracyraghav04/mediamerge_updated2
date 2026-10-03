from django.urls import path

from . import views_auth, views_library, views_owner, views_takes, views_videos

urlpatterns = [
    path("auth/signup/", views_auth.signup),
    path("auth/login/", views_auth.login_view),
    path("auth/logout/", views_auth.logout_view),
    path("auth/me/", views_auth.me),

    path("videos/", views_videos.video_list),
    path("videos/<slug:slug>/", views_videos.video_detail),

    path("library/", views_library.library),
    path("library/saved/<slug:slug>/", views_library.saved),
    path("library/history/", views_library.history_clear),
    path("library/history/<slug:slug>/", views_library.history_add),
    path("library/progress/<slug:slug>/", views_library.progress),

    path("hot-takes/", views_takes.hot_takes),

    path("owner/overview/", views_owner.overview),
    path("owner/assets/", views_owner.assets),
    path("owner/upload/", views_owner.upload),
    path("owner/collections/", views_owner.collections),
    path("owner/metadata/", views_owner.metadata),
    path("owner/licenses/", views_owner.licenses),
    path("owner/review/", views_owner.review),
    path("owner/analytics/", views_owner.analytics),
    path("owner/profile/", views_owner.profile),
]