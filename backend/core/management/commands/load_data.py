import csv
import random
from datetime import date
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from core.models import (
    Activity, Collection, HotTake, License, Organization, ReviewItem,
    TeamMember, Video,
)


def to_seconds(text):
    """'1:46:18' -> seconds, '52:14' -> seconds."""
    parts = [int(p) for p in text.split(":")]
    total = 0
    for p in parts:
        total = total * 60 + p
    return total


def to_number(text):
    """'1.8M' -> 1800000, '684K' -> 684000, '4.2K' -> 4200."""
    text = str(text).strip().upper()
    if text.endswith("M"):
        return int(float(text[:-1]) * 1_000_000)
    if text.endswith("K"):
        return int(float(text[:-1]) * 1_000)
    return int(text)


# slug, title, category, duration, year, rating, views, img, featured, trending, description
FRONTEND_VIDEOS = [
    ("neon-boulevard", "Neon Boulevard", "Movies", "1:46:18", 2026, "PG-13", "1.8M", "video01.jpg", True, True, "A night courier follows a glowing trail through a rain-soaked city district."),
    ("after-midnight", "After Midnight", "Series", "52:14", 2025, "TV-14", "1.2M", "video02.jpg", True, True, "Four strangers cross paths after the city falls quiet."),
    ("empty-crossroads", "Empty Crossroads", "Documentary", "44:08", 2024, "TV-G", "684K", "video03.jpg", False, True, "A visual journey through cities that transform after dark."),
    ("rain-city", "Rain City", "Anime", "28:36", 2026, "TV-14", "2.1M", "video04.jpg", True, False, "A young artist discovers a hidden story in the reflections of a midnight street."),
    ("starlight-frontier", "Starlight Frontier", "Documentary", "48:22", 2025, "TV-G", "912K", "video05.jpg", True, True, "Researchers chase the darkest skies in search of the Milky Way."),
    ("under-the-milky-way", "Under the Milky Way", "Series", "39:44", 2024, "TV-PG", "755K", "video06.jpg", False, True, "A quiet observatory becomes the meeting point for an unlikely group of dreamers."),
    ("deep-sky", "Deep Sky", "Documentary", "51:07", 2023, "TV-G", "1.1M", "video07.jpg", True, False, "How modern cameras reveal structure hidden inside the night sky."),
    ("midnight-lake", "Midnight Lake", "Movies", "1:32:09", 2025, "PG", "1.5M", "video08.jpg", False, True, "A family reunion unfolds beside a lake beneath an unforgettable sky."),
    ("last-screening", "The Last Screening", "Movies", "1:58:03", 2024, "PG-13", "2.4M", "video09.jpg", True, True, "A projectionist prepares one final show in a historic cinema."),
    ("red-curtain", "Red Curtain", "Series", "46:51", 2025, "TV-14", "1.7M", "video10.jpg", False, True, "Backstage rivalries collide on opening night."),
    ("silver-hall", "Silver Hall", "Documentary", "36:18", 2023, "TV-G", "503K", "video11.jpg", False, False, "Inside the architecture and craft behind classic movie theaters."),
    ("midnight-cinema", "Midnight Cinema", "Anime", "31:26", 2026, "TV-PG", "1.9M", "video12.jpg", True, False, "A mysterious late-night screening changes the course of a young filmmaker's life."),
    ("shadow-peak", "Shadow Peak", "Documentary", "49:55", 2024, "TV-G", "1.0M", "video13.jpg", True, True, "Climbers and rangers document a remote mountain ecosystem."),
    ("mistwood", "Mistwood", "Movies", "1:41:27", 2025, "PG-13", "1.3M", "video14.jpg", False, True, "A stranded traveler follows a trail into a forest wrapped in fog."),
    ("cloud-valley", "Cloud Valley", "Series", "42:12", 2024, "TV-PG", "822K", "video15.jpg", False, False, "A mountain community rebuilds after a season of relentless storms."),
    ("beyond-the-ridge", "Beyond the Ridge", "Anime", "25:48", 2026, "TV-PG", "1.6M", "video16.jpg", True, False, "A young explorer searches for the place marked only on an old hand-drawn map."),
    ("neon-district", "Neon District", "Movies", "2:02:16", 2025, "TV-14", "3.4M", "video17.jpg", True, True, "A detective tracks a signal through a futuristic entertainment district."),
    ("electric-rain", "Electric Rain", "Series", "54:20", 2026, "TV-14", "2.8M", "video18.jpg", False, True, "Every storm reveals another layer of a citywide conspiracy."),
    ("blue-hour", "Blue Hour", "Documentary", "40:32", 2024, "TV-G", "730K", "video19.jpg", False, False, "Photographers chase the brief blue glow between night and morning."),
    ("afterglow-avenue", "Afterglow Avenue", "Anime", "27:11", 2026, "TV-14", "2.2M", "video20.jpg", True, True, "A neon-lit avenue becomes the stage for an unexpected reunion."),
]

# slug, title, category, status, views, genre, language, runtime_sec, collection, watch_hours, completion
OWNER_VIDEOS = [
    ("salt-and-circuit", "Salt & Circuit", "Anime", "In Review", "0", "Cyberpunk", "Japanese", 1440, "Anime Spotlight", "0", 0),
    ("neon-harbor", "Neon Harbor", "Movies", "Published", "1.3M", "Thriller", "English", 6360, "Harborlight Originals", "1.7M", 76),
    ("crimson-signal-s2", "Crimson Signal — Season 2", "Series", "Published", "3.1M", "Crime Drama", "English", 3120, "Harborlight Originals", "1.9M", 71),
    ("deep-field", "Deep Field", "Documentary", "Published", "1.2M", "Science", "English", 3060, "Documentary Archive", "694K", 68),
    ("paper-lanterns", "Paper Lanterns", "Anime", "Published", "4.5M", "Fantasy", "Japanese", 1560, "Anime Spotlight", "1.6M", 82),
    ("midnight-terminal", "Midnight Terminal", "Movies", "Published", "892K", "Mystery", "English", 5520, "Festival Selections", "873K", 64),
    ("static-bloom", "Static Bloom", "Series", "Published", "734K", "Drama", "Spanish", 2640, "Harborlight Originals", "400K", 60),
    ("last-cartographer", "The Last Cartographer", "Documentary", "Draft", "0", "Adventure", "English", 0, "Season Bundles", "0", 0),
    ("aurora-protocol", "Aurora Protocol", "Movies", "In Review", "0", "Sci-Fi", "English", 6000, "Festival Selections", "0", 0),
    ("velvet-static", "Velvet Static", "Series", "In Review", "0", "Drama", "English", 2700, "Season Bundles", "0", 0),
]

HOT_TAKES = [
    ("neon-district", "Priya S.", "@priya_reels", "Neon District proves a detective story can be a full sensory experience. The sound design alone deserves an award.", "4.2K", 318),
    ("electric-rain", "Marcus T.", "@marcus_frames", "Electric Rain is the first series in years where I needed the next episode immediately. Season two cannot come fast enough.", "3.7K", 254),
    ("rain-city", "Aiko N.", "@aiko_draws", "Rain City does more with one midnight street than most anime manage with a whole season. Every reflection tells a story.", "3.1K", 187),
    ("last-screening", "Daniel R.", "@dan_at_the_movies", "The Last Screening is a love letter to cinema, and the final ten minutes will make you want to go back to a real theater.", "2.8K", 203),
    ("starlight-frontier", "Fatima K.", "@fatima_looks_up", "Starlight Frontier is the rare documentary that makes you put your phone down and just look at the sky. Stunning work.", "2.2K", 96),
]

# video slug, territory, expires, status
LICENSES = [
    ("neon-harbor", "Worldwide", date(2027, 12, 31), "Active"),
    ("crimson-signal-s2", "US, CA, UK", date(2027, 6, 30), "Active"),
    ("midnight-terminal", "EU, IN", date(2026, 11, 30), "Expiring"),
    ("deep-field", "Worldwide", date(2028, 3, 31), "Active"),
    ("paper-lanterns", "JP, KR, SEA", date(2027, 9, 30), "Active"),
]

# video slug, submitted, reviewer, status, clearance hours
REVIEWS = [
    ("salt-and-circuit", date(2025, 3, 18), "Priya Nair", "In Review", 18),
    ("aurora-protocol", date(2025, 3, 18), "Marcus Lee", "In Review", 12),
    ("velvet-static", date(2025, 3, 19), "Priya Nair", "In Review", 20),
    ("neon-harbor", date(2025, 3, 12), "Marcus Lee", "Approved", 14),
    ("paper-lanterns", date(2025, 2, 8), "Aiko Tanaka", "Approved", 16),
    ("midnight-terminal", date(2025, 1, 25), "Marcus Lee", "Changes Requested", None),
]

TEAM = [
    ("Sana Iyer", "Head of Content", "Full access", "Active"),
    ("Rohan Mehta", "Rights Manager", "Rights & Licenses", "Active"),
    ("Priya Nair", "Content Reviewer", "Content Review", "Active"),
    ("Jordan Blake", "Metadata Editor", "Metadata", "Pending"),
]

COLLECTIONS = [
    ("Harborlight Originals", "Published"),
    ("Anime Spotlight", "Published"),
    ("Documentary Archive", "Published"),
    ("Festival Selections", "Private"),
    ("Season Bundles", "Draft"),
]

ACTIVITY = [
    "Salt & Circuit sent for review",
    "Neon Harbor reached 1.3M views",
    "Crimson Signal — Season 2 published",
    "License renewed for Deep Field",
    "Paper Lanterns reached 4.5M views",
]


class Command(BaseCommand):
    help = "Fill the database with MediaMerge demo data (and optional Netflix CSV)."

    def add_arguments(self, parser):
        parser.add_argument("--csv", default=str(settings.BASE_DIR / "data" / "netflix_titles.csv"))
        parser.add_argument("--limit", type=int, default=80, help="How many Netflix titles to import")

    def handle(self, *args, **opts):
        random.seed(42)

        # 1. clear old demo data so the command can be run again safely
        for model in (HotTake, License, ReviewItem, Video, Collection, TeamMember, Activity, Organization):
            model.objects.all().delete()

        # 2. organization, team, collections, activity
        org = Organization.objects.create(name="Harborlight Studios", email="studio@harborlight.example")
        for name, role, access, status in TEAM:
            TeamMember.objects.create(organization=org, name=name, role=role, access=access, status=status)
        cols = {n: Collection.objects.create(organization=org, name=n, visibility=v) for n, v in COLLECTIONS}
        for text in reversed(ACTIVITY):  # oldest first so newest ends up on top
            Activity.objects.create(organization=org, text=text)

        # 3. the 20 videos from your frontend
        for slug, title, cat, dur, year, rating, views, img, feat, trend, desc in FRONTEND_VIDEOS:
            Video.objects.create(
                slug=slug, title=title, category=cat, duration_seconds=to_seconds(dur),
                year=year, rating=rating, views=to_number(views), img=img,
                featured=feat, trending=trend, recommended=True, description=desc,
                status="Published", genre=cat,
                watch_hours=to_number(views) * 2, completion_pct=random.randint(55, 85),
            )
        self.stdout.write(self.style.SUCCESS("Added 20 frontend videos"))

        # 4. Content Owner videos
        for i, (slug, title, cat, status, views, genre, lang, secs, col, hours, comp) in enumerate(OWNER_VIDEOS, start=1):
            Video.objects.create(
                slug=slug, title=title, category=cat, status=status, views=to_number(views),
                genre=genre, language=lang, duration_seconds=secs, organization=org,
                collection=cols[col], watch_hours=to_number(hours), completion_pct=comp,
                img=f"video{i:02}.jpg", year=2025, rating="TV-14", recommended=False,
                description=f"{title} from Harborlight Studios.",
            )
        self.stdout.write(self.style.SUCCESS("Added Content Owner videos"))

        # 5. licenses, reviews, hot takes
        for slug, territory, expires, status in LICENSES:
            License.objects.create(video=Video.objects.get(slug=slug), territory=territory, expires=expires, status=status)
        for slug, sub, reviewer, status, hrs in REVIEWS:
            ReviewItem.objects.create(video=Video.objects.get(slug=slug), submitted_at=sub, reviewer=reviewer, status=status, clearance_hours=hrs)
        for slug, who, handle, text, likes, replies in HOT_TAKES:
            HotTake.objects.create(video=Video.objects.get(slug=slug), author_name=who, handle=handle, text=text, likes=to_number(likes), replies=replies)
        self.stdout.write(self.style.SUCCESS("Added licenses, reviews and hot takes"))

        # 6. optional: Netflix dataset
        self.import_netflix(opts["csv"], opts["limit"])
        self.stdout.write(self.style.SUCCESS(f"Done. Total videos: {Video.objects.count()}"))

    def import_netflix(self, path, limit):
        if not Path(path).exists():
            self.stdout.write(self.style.WARNING("netflix_titles.csv not found, skipping Netflix import."))
            return
        videos, seen = [], set()
        with open(path, encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                if len(videos) >= limit:
                    break
                title, desc = (row.get("title") or "").strip(), (row.get("description") or "").strip()
                if not title or not desc:
                    continue
                genres = row.get("listed_in") or ""
                if "Anime" in genres:
                    cat = "Anime"
                elif "Documentar" in genres:
                    cat = "Documentary"
                elif row.get("type") == "TV Show":
                    cat = "Series"
                else:
                    cat = "Movies"
                dur = row.get("duration") or ""
                if "min" in dur:
                    secs = int(dur.split()[0]) * 60
                else:
                    secs = 2700  # TV shows: 45 minutes per episode
                rating = (row.get("rating") or "NR").strip()
                if "min" in rating or len(rating) > 10:
                    rating = "NR"
                slug = f"{slugify(title)[:100]}-{row['show_id']}"
                if slug in seen:
                    continue
                seen.add(slug)
                views = random.randint(50_000, 3_000_000)
                videos.append(Video(
                    slug=slug, title=title[:200], category=cat, description=desc,
                    year=int(row.get("release_year") or 2020), rating=rating,
                    duration_seconds=secs, views=views,
                    img=f"video{(len(videos) % 20) + 1:02}.jpg",   # reuse your 20 thumbnails
                    featured=random.random() < 0.2, trending=random.random() < 0.3,
                    status="Published", genre=genres.split(",")[0][:100],
                    watch_hours=views * 2, completion_pct=random.randint(50, 90),
                ))
        Video.objects.bulk_create(videos)
        self.stdout.write(self.style.SUCCESS(f"Imported {len(videos)} Netflix titles"))