---
name: news-automation
description: Use when creating, drafting, or publishing news posts for Daily Grind, processing news media assets, or scaffolding new post files in _posts/.
---

# News Automation

## overview
This skill defines standard workflows and quality controls for creating, processing media for, and publishing news posts on the Daily Grind website (`dailygrindband.com`).

## when to use
- Drafting or scaffolding a new news post file in `_posts/`.
- Importing and optimizing image or video assets for a news update.
- Formatting post frontmatter, links, or energetic German band updates.

## cannot
- NEVER place raw, unoptimized image or video files directly into `assets/images/news/` or `assets/videos/news/` without processing via the Makefile import commands.
- NEVER hardcode absolute production URLs for live event sections; ALWAYS use `{{ site.url }}#live` for live gig references.
- NEVER omit required frontmatter fields (`layout: page`, `title`, `assets`).
- NEVER write post text in passive or unenergetic tones; post text MUST represent an energetic German rock band.

## workflow

### 1. Process Media Assets First
Before scaffolding the markdown file, convert and optimize all attached media using the Makefile tasks:

- **For images** (JPEG, PNG, etc.):
  ```bash
  make import-image-asset FILE="path/to/photo.jpg"
  ```
  *(Outputs optimized WebP image to `assets/images/news/`)*

- **For videos** (MP4, MOV, etc.):
  Ensure the input video uses or is saved with the `.mp4` extension (required by Jekyll carousel rendering):
  ```bash
  make import-video-asset FILE="path/to/video.mp4"
  ```
  *(Outputs optimized MP4 video to `assets/videos/news/`)*

Note the relative web path of generated files (e.g., `/assets/images/news/photo.webp` or `/assets/videos/news/video.mp4`).

### 2. Scaffold Post File
Create a new post file in `_posts/` with the file naming convention `YYYY-MM-DD-kebab-case-title.md`.

Inject the mandatory Jekyll frontmatter block:

```markdown
---
layout: page
title: "Your Energetic Title"
assets:
  - /assets/images/news/your-asset.webp
---
```

### 3. Write Post Content
Draft the content in German matching the energetic Daily Grind rock band voice:
- Express enthusiasm, band updates, gig announcements, or release info.
- Use rock-themed emojis appropriately (🎸, 🤘, 🔥, ⚡).
- Reference upcoming concert dates using site URL variables: `[date & location]({{ site.url }}#live)`.
- End with energetic sign-offs (e.g., "Stay tuned und rock on! 🔥").

### 4. Verify Build and Links
Verify that Jekyll parses the new post and link checking passes:
```bash
make build && make check
```

## operating rules
- **Frontmatter Invariant**: `layout` MUST be `page`. `title` MUST be enclosed in quotes if it contains special characters or colons. `assets` MUST be a list of root-relative paths starting with `/assets/`.
- **Media Optimization**: Always run `make import-image-asset` or `make import-video-asset` to maintain site performance and consistent resolution. Ensure video asset paths end in `.mp4` for correct carousel tag rendering.
- **Language & Voice**: Posts MUST be in German, adopting the persona of an energetic Nürnberg rock band.
- **Verification**: Post creation is not complete until `make build` and `make check` complete without errors.
