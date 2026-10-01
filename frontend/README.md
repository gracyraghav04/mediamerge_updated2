# MediaMerge frontend

Static frontend (HTML/CSS/JS, no build step, no backend).

## Run
Open `index.html` with VS Code Live Server or any local static server.
Internet is needed once for the Manrope font (Google Fonts); without it the site falls back to Segoe UI / system fonts.

## What changed in this version
- **Font:** Manrope on every page, in a compact size scale (body 14px, page titles up to 40px, hero up to 62px).
- **Logo:** new outlined play-square icon. Icon box (42px) and wordmark (26px) are sized together; "Media" follows the text colour, "Merge" is purple. Same markup on navbar, footer, auth pages and dashboards.
- **Theme switching:** dark (default) / light. Toggle button in the navbar, in the dashboard sidebars and on login/signup. The choice is saved in `localStorage` (`mm_theme`) and applied before first paint, so there is no flash.
- **Browse:** large search bar with magnifier icon, pill category chips (active chip is purple-tinted), "Showing X of 20 titles" counter. Search also matches descriptions.
- **My Library:** Continue Watching (progress bar + "% watched"), Saved Videos (round x to remove, "Browse more"), Watch History ("Clear history"), with empty states.
  The watch page now has a **Save to library** button, records history, and stores/resumes playback progress. Library data lives in `localStorage` (`mm_library`).

- **One Content Owner Dashboard** (`pages/dashboard.html`): the old Admin console and Creator dashboard are merged into a single dashboard for the agency using MediaMerge as its DAM (`admin.html` is removed).
  Sidebar: Overview, My Assets, Upload Content, Collections, Metadata, Rights & Licenses, Content Review, Analytics, Organization / Profile - same icon sidebar, stat cards, tables and status pills as before.
  Overview combines Recent Assets with Quick Actions (Review Queue, Upload Content, Export Report, Manage Rights) and Recent Activity. Deep links like `dashboard.html#review` work.
- **Landing page:** the CTAs are now "Explore Your Content" (opens the viewer dashboard) and "Manage Content" (opens the Content Owner Dashboard). "Recommended For You" is replaced by a "Hot Takes of the Week" column.
- **Viewer dashboard** (`pages/viewer.html`, where viewers land after sign-up/login): hero with trailer carousel and a latest-releases poster rail, followed by Featured Videos, Trending Now and Recommended For You. Favorite saves to the same library as "Save to library".

## Theming
Colours are CSS variables at the top of `css/style.css` (`:root` for dark, `:root[data-theme="light"]` for light). Change a variable there to restyle both themes.

> Authentication, uploads, dashboards, hot takes and rights data remain frontend/demo functionality.
