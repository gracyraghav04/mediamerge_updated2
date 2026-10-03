from datetime import date
from functools import wraps

from django.db.models import Avg, Count, Sum
from django.http import JsonResponse
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .models import Activity, Collection, License, ReviewItem, Video
from .views_auth import read_json


# ---------- helpers ----------
def owner_required(view):
    """Only logged-in content owners who belong to an organization."""
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Please log in."}, status=401)
        profile = getattr(request.user, "profile", None)
        if not profile or profile.role != "content-owner" or not profile.organization:
            return JsonResponse({"error": "Content owners only."}, status=403)
        request.org = profile.organization
        return view(request, *args, **kwargs)
    return wrapper


def compact(n):
    """1300000 -> '1.3M', 694000 -> '694K', 0 -> '–'."""
    if not n:
        return "–"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n // 1_000}K"
    return str(n)


def day(d):
    return d.strftime("%b %d, %Y")


def runtime(sec):
    if not sec:
        return "–"
    h, m = sec // 3600, (sec % 3600) // 60
    return f"{h}h {m}m" if h else f"{m} min"


def table(head, rows, stats=None):
    return JsonResponse({"head": head, "rows": rows, "stats": stats or {}})


def org_videos(request):
    return Video.objects.filter(organization=request.org)


def asset_row(v):
    return [v.title, v.category, v.status, compact(v.views), day(v.updated_at)]


# ---------- Overview ----------
@require_GET
@owner_required
def overview(request):
    vids = org_videos(request)
    reviews = ReviewItem.objects.filter(video__organization=request.org, status="In Review")
    avg = reviews.exclude(clearance_hours=None).aggregate(a=Avg("clearance_hours"))["a"]
    recent = vids.order_by("-updated_at")[:5]
    return JsonResponse({
        "name": request.org.name,
        "stats": {
            "total_assets": vids.count(),
            "published": vids.filter(status="Published").count(),
            "in_review": vids.filter(status="In Review").count(),
            "total_views": compact(vids.aggregate(s=Sum("views"))["s"] or 0),
            "avg_clearance": f"{round(avg)}h" if avg else "–",
        },
        "recent": {"head": ["Title", "Category", "Status", "Views", "Updated"],
                   "rows": [asset_row(v) for v in recent]},
        "activity": [[a.text, day(a.created_at)] for a in request.org.activity.all()[:5]],
    })


# ---------- My Assets ----------
@require_GET
@owner_required
def assets(request):
    """/api/owner/assets/?status=Published  (All | Published | In Review | Draft)"""
    status = request.GET.get("status", "All")
    qs = org_videos(request).order_by("-updated_at")
    total = qs.count()
    if status != "All":
        qs = qs.filter(status=status)
    return table(["Title", "Category", "Status", "Views", "Updated"],
                 [asset_row(v) for v in qs], {"total": total, "shown": qs.count()})


# ---------- Upload ----------
@csrf_exempt
@require_POST
@owner_required
def upload(request):
    """Accepts a form (with video file) or JSON (for testing)."""
    data = read_json(request) if request.content_type == "application/json" else request.POST
    title = (data.get("title") or "").strip()
    category = data.get("category") or "Movies"
    if not title:
        return JsonResponse({"error": "Title is required."}, status=400)
    if category not in dict(Video.CATEGORIES):
        return JsonResponse({"error": "Invalid category."}, status=400)

    col = Collection.objects.filter(organization=request.org, name=data.get("collection")).first()

    base = slugify(title)[:100] or "untitled"
    slug, n = base, 2
    while Video.objects.filter(slug=slug).exists():
        slug, n = f"{base}-{n}", n + 1

    extra = {}
    file = request.FILES.get("video_file")
    if file:
        extra["video_file"] = file

    v = Video.objects.create(
        slug=slug, title=title[:200], category=category, status="In Review",
        organization=request.org, collection=col, recommended=False, genre=category,
        description=f"{title} from {request.org.name}.", **extra,
    )
    ReviewItem.objects.create(video=v, submitted_at=date.today(), reviewer="Priya Nair", status="In Review")
    Activity.objects.create(organization=request.org, text=f"{v.title} sent for review")
    return JsonResponse({"ok": True, "slug": v.slug, "message": "Asset submitted for review."}, status=201)


# ---------- Collections ----------
@require_GET
@owner_required
def collections(request):
    cols = request.org.collections.annotate(n=Count("videos")).order_by("id")
    rows = [[c.name, str(c.n), c.visibility, day(c.updated_at)] for c in cols]
    count = lambda s: sum(1 for c in cols if c.visibility == s)
    return table(["Collection", "Assets", "Visibility", "Updated"], rows,
                 {"collections": len(cols), "published": count("Published"),
                  "private": count("Private"), "draft": count("Draft")})


# ---------- Metadata ----------
@require_GET
@owner_required
def metadata(request):
    vids = org_videos(request)
    rows, complete = [], 0
    for v in vids:
        ok = bool(v.genre and v.language and v.description and v.duration_seconds)
        complete += ok
        rows.append([v.title, v.genre or "–", v.language or "–", runtime(v.duration_seconds),
                     "Complete" if ok else "Needs Info"])
    return table(["Asset", "Genre", "Language", "Runtime", "Completeness"], rows,
                 {"complete": complete, "needs_info": len(rows) - complete,
                  "languages": len({v.language for v in vids if v.language})})


# ---------- Rights & Licenses ----------
@require_GET
@owner_required
def licenses(request):
    lics = License.objects.filter(video__organization=request.org).select_related("video").order_by("expires")
    rows = [[l.video.title, l.territory, l.expires.strftime("%b %Y"), l.status] for l in lics]
    return table(["Asset", "Territory", "Expires", "Status"], rows,
                 {"active": sum(1 for l in lics if l.status == "Active"),
                  "expiring": sum(1 for l in lics if l.status == "Expiring")})


# ---------- Content Review ----------
@require_GET
@owner_required
def review(request):
    items = (ReviewItem.objects.filter(video__organization=request.org)
             .select_related("video").order_by("-submitted_at", "-id"))
    rows = [[r.video.title, day(r.submitted_at), r.reviewer, r.status,
             f"{r.clearance_hours}h" if r.clearance_hours else "–"] for r in items]
    count = lambda s: sum(1 for r in items if r.status == s)
    return table(["Asset", "Submitted", "Reviewer", "Status", "Clearance"], rows,
                 {"in_review": count("In Review"), "approved": count("Approved"),
                  "changes_requested": count("Changes Requested")})


# ---------- Analytics ----------
@require_GET
@owner_required
def analytics(request):
    vids = org_videos(request)
    top = vids.filter(status="Published").order_by("-views")[:5]
    rows = [[v.title, v.category, compact(v.views), f"{compact(v.watch_hours)} hrs",
             f"{v.completion_pct}%"] for v in top]
    done = vids.filter(completion_pct__gt=0).aggregate(a=Avg("completion_pct"))["a"]
    return table(["Asset", "Category", "Views", "Watch Time", "Completion"], rows,
                 {"total_views": compact(vids.aggregate(s=Sum("views"))["s"] or 0),
                  "watch_time": compact(vids.aggregate(s=Sum("watch_hours"))["s"] or 0) + " hrs",
                  "avg_completion": f"{round(done)}%" if done else "–"})


# ---------- Organization / Profile ----------
@csrf_exempt
@require_http_methods(["GET", "POST"])
@owner_required
def profile(request):
    org = request.org
    if request.method == "POST":
        data = read_json(request)
        name = (data.get("name") or "").strip()
        if not name:
            return JsonResponse({"error": "Organization name is required."}, status=400)
        org.name = name[:150]
        org.email = (data.get("email") or "").strip()
        org.save()
    team = [[m.name, m.role, m.access, m.status] for m in org.team.all()]
    return JsonResponse({
        "name": org.name, "email": org.email,
        "team": {"head": ["Member", "Role", "Access", "Status"], "rows": team},
    })