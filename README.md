# dailygrindband.com

Official website for the rock and pop band **Daily Grind** from Nuremberg, Germany.

![Daily Grind](assets/images/dg-og.jpg)

## Tech Stack

- **Static Site Generator:** [Jekyll](https://jekyllrb.com/) 4.4.x
- **CSS Framework:** [Bootstrap](https://getbootstrap.com/) 5.3 (via Sass)
- **Quality Assurance:** [HTMLProofer](https://github.com/gjtorikian/html-proofer)
- **Asset Processing:** [FFmpeg](https://ffmpeg.org/) (for optimized images/videos)
- **CI/CD:** GitHub Actions with `rsync` deployment

## Prerequisites

- **Ruby:** Managed via `.ruby-version` (recommended: `rbenv`)
- **Bundler:** For managing Ruby gems
- **FFmpeg:** Required for asset import scripts (`brew install ffmpeg`)
- **Git LFS:** For managing large media files

## Setup & Development

The project uses a `Makefile` to automate common tasks:

### Initial Setup
```bash
make setup-env   # Installs dependencies and prepares the environment
make install     # Installs Ruby gems
```

### Local Development
```bash
make serve       # Runs the Jekyll development server at http://localhost:4000
```

### Building & Testing
```bash
make build       # Generates the static site in _site/
make check       # Runs html-proofer to validate links and images
```

## Asset Management

To keep the repository size manageable and ensure fast loading times, use the provided import scripts to optimize media:

- **Images:** `make import-image-asset FILE="path/to/photo.jpg"`
  - Converts to WebP and scales to a maximum width of 1024px.
- **Videos:** `make import-video-asset FILE="path/to/video.mp4"`
  - Optimizes for web streaming (h264/aac) and scales to 1024px width.

Assets are saved to `assets/images/news/` or `assets/videos/news/` and can then be referenced in your posts.

## Deployment

The site is automatically built and tested on every push to `main`. 

**To trigger a deployment to production:**
1.  **Publish a GitHub Release** in the repository.

The deployment job will use `rsync` to sync the `_site/` directory with the production server.

## Project Structure

- `_includes/`: Reusable HTML components (Hero, News, Live, etc.)
- `_layouts/`: Page templates
- `_posts/`: Blog posts and news updates
- `_sass/`: Custom styling and Bootstrap integration
- `assets/`: Media files, fonts, and JavaScript
- `_data/live.csv`: Source of truth for upcoming live dates
