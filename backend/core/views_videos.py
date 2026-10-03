from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Video


def video_json(v):
    """Same field names as the VIDEOS list in your script.js."""
    return {
        "id": v.slug,
        "title": v.title,
        "category": v.category,
        "duration": v.duration_display,
        "year": v.year,
        "rating": v.rating,
        "views": v.views_display,
        "img": v.img,
        "featured": v.featured,
        "trending": v.trending,
        "recommended": v.recommended,
        "desc": v.description,
        "video_url": v.video_file.url if v.video_file else None,
    }


def public_videos():
    return Video.objects.filter(status="Published")


@require_GET
def video_list(request):
    """
    /api/videos/?filter=trending&category=Movies&q=neon&limit=4
    filter: all | featured | trending | recent | recommended
    """
    flt = request.GET.get("filter", "all")
    category = request.GET.get("category", "All")
    q = request.GET.get("q", "").strip()

    total = public_videos().count()
    qs = public_videos()

    if flt == "featured":
        qs = qs.filter(featured=True)
    elif flt == "trending":
        qs = qs.filter(trending=True)
    elif flt == "recommended":
        qs = qs.filter(recommended=True)
    elif flt == "recent":
        qs = qs.order_by("-id")

    if category != "All":
        qs = qs.filter(category=category)
    if q:
        qs = qs.filter(
            Q(title__icontains=q) | Q(category__icontains=q)
            | Q(description__icontains=q) | Q(genre__icontains=q)
        )

    count = qs.count()
    limit = request.GET.get("limit")
    if limit and limit.isdigit():
        qs = qs[: int(limit)]

    return JsonResponse({
        "total": total,          # all public titles (for "Showing X of N titles")
        "count": count,          # titles matching this search/filter
        "results": [video_json(v) for v in qs],
    })


@require_GET
def video_detail(request, slug):
    """/api/videos/neon-boulevard/ gives the video plus 4 related videos."""
    try:
        v = public_videos().get(slug=slug)
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video not found."}, status=404)

    same = list(public_videos().filter(category=v.category).exclude(id=v.id)[:4])
    if len(same) < 4:
        ids = [v.id] + [x.id for x in same]
        same += list(public_videos().exclude(id__in=ids)[: 4 - len(same)])

    return JsonResponse({
        "video": video_json(v),
        "related": [video_json(x) for x in same],
    })