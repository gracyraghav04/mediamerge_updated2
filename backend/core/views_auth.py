import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import Organization, Profile


def read_json(request):
    """Read the JSON sent by the frontend. Returns {} if it is broken."""
    try:
        return json.loads(request.body or "{}")
    except ValueError:
        return {}


def user_json(user):
    """The same shape your frontend saved in localStorage: name, email, role."""
    profile = getattr(user, "profile", None)
    return {
        "name": user.first_name or user.username,
        "email": user.email,
        "role": profile.role if profile else "viewer",
    }


def error(message, status=400):
    return JsonResponse({"error": message}, status=status)


@csrf_exempt
@require_POST
def signup(request):
    data = read_json(request)
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role") or "viewer"

    if not name or not email:
        return error("Name and email are required.")
    if len(password) < 6:
        return error("Password must be at least 6 characters.")
    if role not in ("viewer", "content-owner"):
        return error("Invalid account type.")
    if User.objects.filter(username=email).exists():
        return error("An account with this email already exists.", 409)

    user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
    org = None
    if role == "content-owner":
        # demo: every content owner joins the first organization (Harborlight Studios)
        org = Organization.objects.first() or Organization.objects.create(name=f"{name} Studio", email=email)
    Profile.objects.create(user=user, role=role, organization=org)

    login(request, user)
    return JsonResponse(user_json(user), status=201)


@csrf_exempt
@require_POST
def login_view(request):
    data = read_json(request)
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = authenticate(request, username=email, password=password)
    if user is None:
        return error("Wrong email or password.", 401)

    login(request, user)
    return JsonResponse(user_json(user))


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({"ok": True})


@require_GET
def me(request):
    """Tells the frontend who is logged in right now."""
    if not request.user.is_authenticated:
        return error("Not logged in.", 401)
    return JsonResponse(user_json(request.user))