---
type: project
status: active
priority: medium
category: app
languages: [HTML/CSS, Ruby, Sass, JavaScript]
description: "Jekyll-based rock band static website with GHA auto-deployment pipeline."
last_active: 2026-08-08
git_branch: main
---
# dailygrind-2024

## 🛠️ Project Blueprint & Architecture
*   **Target Profile:** Jekyll Static Web Application
*   **Primary Frameworks:** Jekyll 4.4.x, Bootstrap 5.3 (Sass)
*   **Platforms:** Web (GitHub Pages / Web Server via rsync deployment)
*   **Dependencies:** Bundler (Ruby), HTMLProofer, FFmpeg, Git LFS

### 📂 Directory Structure
```text
├── 404.html
├── AGENTS.md
├── Gemfile
├── Gemfile.lock
├── Icon.png
├── LICENSE
├── Makefile
├── PROJECT.md
├── README.md
├── _config.yml
├── _data/
├── _drafts/
├── _includes/
├── _keep_local/
├── _layouts/
├── _posts/
├── _sass/
├── _site/
├── assets/
├── conductor/
├── imprint.md
├── index.md
├── privacy.md
├── renovate.json
├── robots.txt
├── scripts/
└── vendor/
```

<!-- DESCRIPTION_START -->
## 📝 AI Context & Core Purpose
Official Jekyll static website for the Nuremberg-based rock & pop band **Daily Grind** (dailygrindband.com). Serves band information, live concert dates, news, music, media galleries, and social media links.
<!-- DESCRIPTION_END -->

<!-- BACKLOG_START -->
## 📋 Current State & Backlog
- [ ] Phase 1: Analytics & Cookie Banner Cleanup (Remove GA4 and Osano consent banner)
- [ ] Phase 2: Live Events CSV Audit & Hero Next-Gig Indicator
- [ ] Phase 3: News Automation CLI Tool (`make new-post` / `scripts/new_post.sh`)
- [ ] Phase 4: Native Social Feed (`_data/social.json` + `scripts/fetch_social.rb`)
<!-- BACKLOG_END -->
