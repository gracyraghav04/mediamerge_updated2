from functools import wraps

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import SavedVideo, Video, WatchHistory, WatchProgress
from .views_auth import read_json
from .views_videos import video_json


def login_required_json(view):
    """Return a 401 JSON error if the user is not logged in."""
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please log in."}, status=401)
        return view(request, *args, **kwargs)
    return wrapper


def find_video(slug):
    return Video.objects.filter(status="Published", slug=slug).first()


@require_GET
@login_required_json
def library(request):
    """Everything library.html needs in one call."""
    u = request.user
    cont = (WatchProgress.objects.filter(user=u, pct__gt=0, pct__lt=95, video__status="Published")
            .select_related("video"))
    saved = SavedVideo.objects.filter(user=u, video__status="Published").select_related("video")
    history = WatchHistory.objects.filter(user=u, video__status="Published").select_related("video")[:12]
    return JsonResponse({
        "continue": [{"video": video_json(p.video), "pct": p.pct} for p in cont],
        "saved": [video_json(s.video) for s in saved],
        "history": [video_json(h.video) for h in history],
    })


@csrf_exempt
@require_http_methods(["POST", "DELETE"])
@login_required_json
def saved(request, slug):
    """POST = save the video, DELETE = remove it."""
    v = find_video(slug)
    if not v:
        return JsonResponse({"error": "Video not found."}, status=404)
    if request.method == "POST":
        SavedVideo.objects.get_or_create(user=request.user, video=v)
        return JsonResponse({"saved": True})
    SavedVideo.objects.filter(user=request.user, video=v).delete()
    return JsonResponse({"saved": False})


@csrf_exempt
@require_http_methods(["POST"])
@login_required_json
def history_add(request, slug):
    """Called when a user opens a watch page."""
    v = find_video(slug)
    if not v:
        return JsonResponse({"error": "Video not found."}, status=404)
    row, _ = WatchHistory.objects.get_or_create(user=request.user, video=v)
    row.save()  # refreshes watched_at so it moves to the top
    # keep only the newest 12 (same as your frontend)
    keep = list(WatchHistory.objects.filter(user=request.user).values_list("id", flat=True)[:12])
    WatchHistory.objects.filter(user=request.user).exclude(id__in=keep).delete()
    return JsonResponse({"ok": True})


@csrf_exempt
@require_http_methods(["DELETE"])
@login_required_json
def history_clear(request):
    WatchHistory.objects.filter(user=request.user).delete()
    return JsonResponse({"ok": True})


@csrf_exempt
@require_http_methods(["GET", "POST"])
@login_required_json
def progress(request, slug):
    """GET = where to resume. POST {"pct": 40} = save progress."""
    v = find_video(slug)
    if not v:
        return JsonResponse({"error": "Video not found."}, status=404)

    if request.method == "GET":
        row = WatchProgress.objects.filter(user=request.user, video=v).first()
        return JsonResponse({"pct": row.pct if row else 0})

    try:
        pct = int(read_json(request).get("pct"))
    except (TypeError, ValueError):
        return JsonResponse({"error": "pct must be a number."}, status=400)
    pct = max(0, min(100, pct))

    if pct >= 95:  # finished, so remove it from Continue Watching
        WatchProgress.objects.filter(user=request.user, video=v).delete()
    else:
        WatchProgress.objects.update_or_create(user=request.user, video=v, defaults={"pct": pct})
    return JsonResponse({"pct": pct})