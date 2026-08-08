# Daily Grind Band Website (dailygrindband.com)

A Jekyll-based static website for the Nuremberg-based rock and pop band **Daily Grind**.

## Project Overview

- **Technologies:** Jekyll 4.4.x (Ruby), Bootstrap 5.3 (Sass), HTMLProofer, FFmpeg (for assets).
- **Architecture:** Component-based includes for the homepage (`index.md`) and dedicated layouts (`base`, `main`, `page`) in `_layouts/`.
- **Styling:** Main stylesheet in `assets/css/style.scss` importing Sass partials from `_sass/`. Bootstrap 5 SCSS resides in `_sass/bootstrap/`.
- **Assets:** Optimized WebP images and MP4 videos stored in `assets/images/` and `assets/videos/`.

## Building and Running

Key commands are provided via the `Makefile`:

- **Setup Environment:** `make setup-env` (Installs rbenv, ruby-build, Git LFS, and Bundler dependencies).
- **Install Dependencies:** `make install` (Runs `bundle install`).
- **Development Server:** `make serve` (Cleans and runs `jekyll serve` locally).
- **Production Build:** `make build` (Cleans and runs `jekyll build`).
- **Quality Check:** `make check` (Runs `htmlproofer` on `_site/`).
- **Import Image Asset:** `make import-image-asset FILE="path/to/photo.jpg"` (Converts to WebP, resizes to max width 1024px, and places in `assets/images/news/`).
- **Import Video Asset:** `make import-video-asset FILE="path/to/video.mp4"` (Optimizes to MP4/AAC, resizes to max width 1024px, and places in `assets/videos/news/`).

## Development Conventions

- **Content Creation:**
  - **Homepage (`index.md`):** Imports modular components from `_includes/` (`hero`, `hero-links`, `news`, `live`, `bio`, `music`, `videos`, `social-feed`).
  - **Posts (`_posts/`):** Named `YYYY-MM-DD-title.md` using the `page` layout.
  - **Live Dates (`_data/live.csv`):** Single source of truth for concert dates and event links.
- **Assets:** Always use the `Makefile` import commands (`import-image-asset` / `import-video-asset`) to ensure assets are properly converted and scaled.
- **Styling:** Main entry point is `assets/css/style.scss`. Create or modify SCSS partials inside `_sass/`. Do not directly modify `_sass/bootstrap/` as it is populated via `make setup-bootstrap`.
- **Configuration:** `_config.yml` contains global metadata, social links, hero carousel settings, and YouTube gallery references.
- **Improvements Roadmap:** Managed via `conductor/site-improvements-plan.md`.

## Key Files

- `_config.yml`: Core site settings and data.
- `index.md`: Homepage component assembly.
- `Makefile`: Build, serve, check, news automation, and asset import tasks.
- `Gemfile` / `.ruby-version`: Ruby dependency definitions.
- `_data/live.csv`: Live concert schedule data.
- `_includes/`: Reusable HTML components (e.g. `head.html`, `hero.html`, `social-feed.html`).
- `_layouts/`: Page templates (`base.html`, `main.html`, `page.html`).
- `scripts/`: Shell and Ruby automation scripts for media imports and content tooling.
- `conductor/site-improvements-plan.md`: Roadmap and feature specifications.
