from django.conf import settings
from django.db import models


# ---------- Organization & user profile ----------
class Organization(models.Model):
    """A content owner / agency, e.g. Harborlight Studios."""
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    """Extra info for each login user: viewer or content owner."""
    ROLES = [("viewer", "Viewer"), ("content-owner", "Content Owner")]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLES, default="viewer")
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class TeamMember(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="team")
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    access = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="Active")

    def __str__(self):
        return self.name


# ---------- Catalogue ----------
class Collection(models.Model):
    VISIBILITY = [("Published", "Published"), ("Private", "Private"), ("Draft", "Draft")]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="collections")
    name = models.CharField(max_length=150)
    visibility = models.CharField(max_length=20, choices=VISIBILITY, default="Draft")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Video(models.Model):
    CATEGORIES = [("Movies", "Movies"), ("Series", "Series"), ("Anime", "Anime"), ("Documentary", "Documentary")]
    STATUSES = [("Published", "Published"), ("In Review", "In Review"), ("Draft", "Draft")]

    slug = models.SlugField(max_length=120, unique=True)          # used in watch.html?id=slug
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    description = models.TextField(blank=True)
    year = models.PositiveSmallIntegerField(default=2025)
    rating = models.CharField(max_length=10, default="PG-13")     # e.g. TV-14
    duration_seconds = models.PositiveIntegerField(default=0)
    views = models.PositiveBigIntegerField(default=0)
    img = models.CharField(max_length=100, default="video01.jpg") # thumbnail file name
    video_file = models.FileField(upload_to="videos/", blank=True)

    featured = models.BooleanField(default=False)
    trending = models.BooleanField(default=False)
    recommended = models.BooleanField(default=True)

    # content-owner fields
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.SET_NULL, related_name="videos")
    collection = models.ForeignKey(Collection, null=True, blank=True, on_delete=models.SET_NULL, related_name="videos")
    status = models.CharField(max_length=20, choices=STATUSES, default="Published")
    genre = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, blank=True, default="English")
    watch_hours = models.PositiveBigIntegerField(default=0)       # analytics
    completion_pct = models.PositiveSmallIntegerField(default=0)  # analytics

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title

    @property
    def duration_display(self):
        h, rem = divmod(self.duration_seconds, 3600)
        m, s = divmod(rem, 60)
        return f"{h}:{m:02}:{s:02}" if h else f"{m}:{s:02}"

    @property
    def views_display(self):
        n = self.views
        if n >= 1_000_000:
            return f"{n / 1_000_000:.1f}M"
        if n >= 1_000:
            return f"{n // 1_000}K"
        return str(n)


# ---------- Viewer library ----------
class SavedVideo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved")
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "video")
        ordering = ["-saved_at"]


class WatchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="history")
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "video")
        ordering = ["-watched_at"]


class WatchProgress(models.Model):
    """Powers 'Continue Watching' (pct = percent watched)."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress")
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    pct = models.PositiveSmallIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "video")
        ordering = ["-updated_at"]


# ---------- Community ----------
class HotTake(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="takes")
    author_name = models.CharField(max_length=100)
    handle = models.CharField(max_length=60)
    text = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    replies = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-likes"]


# ---------- Rights, review, activity ----------
class License(models.Model):
    STATUSES = [("Active", "Active"), ("Expiring", "Expiring"), ("Expired", "Expired")]
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="licenses")
    territory = models.CharField(max_length=100)
    expires = models.DateField()
    status = models.CharField(max_length=20, choices=STATUSES, default="Active")


class ReviewItem(models.Model):
    STATUSES = [("In Review", "In Review"), ("Approved", "Approved"), ("Changes Requested", "Changes Requested")]
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name="reviews")
    submitted_at = models.DateField()
    reviewer = models.CharField(max_length=100)
    status = models.CharField(max_length=30, choices=STATUSES, default="In Review")
    clearance_hours = models.PositiveSmallIntegerField(null=True, blank=True)


class Activity(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="activity")
    text = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
