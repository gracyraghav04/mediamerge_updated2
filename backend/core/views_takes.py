from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import HotTake
from .views_videos import video_json


def short_number(n):
    """4200 -> '4.2K', 1500000 -> '1.5M'."""
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(n)


def take_json(t):
    """Same field names as HOT_TAKES in script.js, plus the video details."""
    return {
        "id": t.video.slug,
        "who": t.author_name,
        "handle": t.handle,
        "take": t.text,
        "likes": short_number(t.likes),
        "replies": t.replies,
        "video": video_json(t.video),
    }


@require_GET
def hot_takes(request):
    """
    /api/hot-takes/            -> top 5 takes
    /api/hot-takes/?limit=10   -> top 10 takes
    """
    limit = request.GET.get("limit", "5")
    limit = int(limit) if limit.isdigit() and int(limit) > 0 else 5

    qs = (HotTake.objects.filter(video__status="Published")
          .select_related("video").order_by("-likes")[:limit])
    return JsonResponse({"results": [take_json(t) for t in qs]})