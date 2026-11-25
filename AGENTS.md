# Daily Grind Band Website (dailygrindband.com)

A Jekyll-based static website for the Nuremberg-based rock and pop band **Daily Grind**.

## Project Overview

- **Technologies:** Jekyll 4.4.x (Ruby), Bootstrap 5.3 (Sass), HTMLProofer, FFmpeg (for assets).
- **Architecture:** Component-based includes for the homepage (`index.md`) and dedicated layouts (`base`, `main`, `page`) in `_layouts/`.
- **Styling:** Main stylesheet in `assets/css/style.scss` importing Sass partials from `_sass/`. Bootstrap 5 SCSS resides in `_sass/bootstrap/`.
- **Assets:** Optimized WebP images and MP4 videos stored in `assets/images/` and `assets/videos/`.

## Makefile Workflows

Use the `Makefile` targets for setup, dependencies, building, checking, serving, and asset imports. Read the relevant target and its prerequisites before running it; do not replace it with individual underlying commands. If a target fails, report the error rather than bypassing it. Ask before removing an existing dependency bundle or updating locked dependencies.

### Set up and preview the site

1. For a fresh environment, ensure Homebrew is available and run `make setup-env`. This installs the required Ruby and project dependencies. The target can remove `vendor/bundle` when the selected Ruby version differs; ask before removing an existing bundle.
2. Run `make install` to install the locked gems. This is also the setup step to use when Ruby and Bundler are already available but the gems are missing.
3. Run `make serve` and open <http://127.0.0.1:4000/>. Keep the command running while previewing the site.
4. To validate the site, run `make build` followed by `make check`. The check needs the generated `_site/` directory.

If setup reports that an rbenv rehash lock already exists, stop and report it. Do not start overlapping installs or remove the lock automatically; it may belong to an active process.

### Targets

- `make set-local-path`: Configure Bundler to install gems in `vendor/bundle`.
- `make setup-env`: Install missing rbenv, ruby-build, and Git LFS; ensure the Ruby version in `.ruby-version` is installed; install Bundler and the project gems; and enable Git LFS. If the selected Ruby version differs, this target upgrades ruby-build and installs the required Ruby before removing `vendor/bundle`; a failed upgrade or Ruby install stops setup without removing the bundle.
- `make clean-vendor`: Remove `vendor/bundle` and `.bundle/config`.
- `make install`: Set the local Bundler path and install project gems.
- `make setup-bootstrap`: Copy Bootstrap styles and JavaScript and Popper JavaScript from the installed gems into the project's asset directories.
- `make update`: Update bundled gem dependencies, potentially changing the lockfile.
- `make clean`: Set the local Bundler path and remove generated Jekyll output.
- `make serve`: Clean generated output and start the Jekyll development server.
- `make build`: Clean generated output and build the Jekyll site.
- `make doctor`: Set the local Bundler path and run Jekyll's diagnostic checks.
- `make check`: Install project gems and run HTMLProofer against `_site/`; build the site first.
- `make import-image-asset FILE="path/to/photo.jpg"`: Convert an image to WebP at 1024 pixels wide and save it in `assets/images/news/`.
- `make import-video-asset FILE="path/to/video.mp4"`: Convert a video to H.264/AAC MP4 at 1024 pixels wide and save it in `assets/videos/news/`.

## Development Conventions

- **Content Creation:**
  - **Homepage (`index.md`):** Imports modular components from `_includes/` (`hero`, `hero-links`, `news`, `live`, `bio`, `music`, `videos`, `social-feed`).
  - **Posts (`_posts/`):** Named `YYYY-MM-DD-title.md` using the `page` layout. Managed via the `news` agent skill (`.agents/skills/news/SKILL.md`).
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
- `.agents/skills/news/SKILL.md`: Agent skill for news post scaffolding and media automation.
