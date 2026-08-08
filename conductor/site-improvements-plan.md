# Site Improvements Plan

## Objective
Address user experience and content management pain points on `dailygrindband.com`. This includes replacing the clunky Juicer feed with Behold.so, creating an Agent Skill for news post automation, drafting new posts using the skill, adding a live gig indicator to the hero section, and removing the intrusive cookie banner and GA4 tracking.

## Scope & Implementation Steps

### Phase 1: News Automation Agent Skill
*   **Action:** Create a dedicated Agent Skill at `.agents/skills/news/SKILL.md`.
*   **Functionality:**
    *   Provides standardized guidelines for scaffolding new posts (`_posts/YYYY-MM-DD-title.md`).
    *   Injects standard frontmatter (`layout: page`, `title`, `assets` array).
    *   Documents asset processing workflows (`make import-image-asset` / `make import-video-asset`).
    *   Enforces brand voice (energetic German rock band) and relative links (`{{ site.url }}#live`).
*   **Files Affected:**
    *   `.agents/skills/news/SKILL.md` (New file)
*   **Status:** [x] Implemented

### Phase 2: Create New News Post
*   **Action:** Publish a new news post using the `news` skill created in Phase 1.
*   **Functionality:**
    *   Scaffold new post file in `_posts/`.
    *   Process and convert any accompanying media assets using `make import-image-asset` or `make import-video-asset`.
    *   Verify site build with `make build`.
*   **Files Affected:**
    *   `_posts/YYYY-MM-DD-title.md` (New file)
    *   `assets/images/news/` / `assets/videos/news/`
*   **Status:** [x] Implemented

### Phase 3: Live Events CSV Cleanup & Hero Indicator
*   **Action (Data):** Audit and clean `_data/live.csv`. Ensure dates are standard (`YYYY-MM-DD`), remove empty columns, and sort correctly.
*   **Action (UI):** Update `_includes/hero.html` with Liquid logic to find the earliest event where `date >= today`.
*   **Action (Styling):** Design a sleek, floating badge or banner (using Bootstrap 5 utilities) overlaid on the Hero image indicating "Next Live: [Date] @ [Venue]" linking to `#live` or ticket URLs.
*   **Files Affected:**
    *   `_data/live.csv`
    *   `_includes/hero.html`
    *   `_sass/_base.scss`
*   **Status:** [ ] Pending

### Phase 4: Analytics & Cookie Banner Cleanup
*   **Action:** Completely remove Google Analytics 4 and the Osano cookie consent banner.
*   **Files Affected:**
    *   `_includes/google-analytics.html` (Delete)
    *   `_includes/analytics-cookie-consent.html` (Delete)
    *   `_config.yml` (Remove `google-analytics-id`)
    *   `_includes/head.html` (Remove include of analytics cookie consent)
    *   `privacy.md` (Update privacy disclosures)
*   **Outcome:** The site will no longer set tracking cookies, making the banner obsolete. This vastly improves page load speed and UX. Traffic will be monitored via Strato's built-in tools.
*   **Status:** [ ] Pending

### Completed: Behold.so Social Feed Integration
*   **Action:** Removed Juicer iframe, integrated Behold.so widget embed, and updated privacy disclosures.
*   **Files Affected:**
    *   `_config.yml`
    *   `_includes/social-feed.html`
    *   `privacy.md`
*   **Status:** [x] Implemented

## Verification
1.  Verify `.agents/skills/news/SKILL.md` exists and is recognized by agent tools.
2.  Verify the new news post renders correctly and media assets compile without errors.
3.  Verify the Hero section displays the correct upcoming gig from the cleaned CSV.
4.  Run `make serve` and verify no cookies are set and no banner appears.
