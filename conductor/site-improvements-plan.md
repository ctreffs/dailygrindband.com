# Site Improvements Plan

## Objective
Address user experience and content management pain points on `dailygrindband.com`. This includes removing the intrusive cookie banner, improving traffic analytics via server logs, adding a live gig indicator to the hero section, replacing the clunky Juicer social feed with a native solution, and streamlining news creation.

## Scope & Implementation Steps

### Phase 1: Analytics & Cookie Banner (Points 1 & 5)
*   **Action:** Completely remove Google Analytics 4 and the Osano cookie consent banner.
*   **Files Affected:**
    *   `_includes/google-analytics.html` (Delete)
    *   `_includes/analytics-cookie-consent.html` (Delete)
    *   `_config.yml` (Remove `google-analytics-id`)
    *   `_includes/head.html` (Remove include of analytics cookie consent)
*   **Outcome:** The site will no longer set tracking cookies, making the banner obsolete. This vastly improves page load speed and UX.
*   **Strato Stats Guide:** Traffic will be monitored via Strato's built-in tools.
*   **Status:** [ ] Pending

### Phase 2: Live Events CSV Cleanup & Hero Indicator (Points 2 & 6)
*   **Action (Data):** Audit and clean `_data/live.csv`. Ensure dates are standard (`YYYY-MM-DD`), remove empty columns, and sort correctly.
*   **Action (UI):** Update `_includes/hero.html` with Liquid logic to find the earliest event where `date >= today`.
*   **Action (Styling):** Design a sleek, floating badge or banner (using Bootstrap 5 utilities) overlaid on the Hero image indicating "Next Live: [Date] @ [Venue]" linking to the events section or ticket URL.
*   **Files Affected:**
    *   `_data/live.csv`
    *   `_includes/hero.html`
    *   `assets/css/style.scss` / `_sass/_base.scss` (if custom CSS is needed)
*   **Status:** [ ] Pending

### Phase 3: News Automation CLI Tool (Point 4)
*   **Action:** Create a bash script `scripts/new_post.sh` and link it to the `Makefile`.
*   **Functionality:**
    *   Running `make new-post` will prompt for a Title.
    *   It will generate a slugified filename (`_posts/YYYY-MM-DD-title.md`).
    *   It will inject the standard Jekyll frontmatter (layout, title, assets array).
    *   It will open the file in the user's default `$EDITOR`.
*   **Files Affected:**
    *   `Makefile` (New target)
    *   `scripts/new_post.sh` (New file)
*   **Status:** [ ] Pending

### Phase 4: Native Social Feed (Point 3)
*   **Action:** Remove the Juicer iframe integration.
*   **Action:** Create a static, native UI grid in `_includes/social-feed.html` that reads from a new `_data/social.json` file.
*   **Action:** Create a Ruby script (`scripts/fetch_social.rb`) to fetch recent posts and save them to `_data/social.json`. *Note: Depending on how strict Instagram's API is currently acting, we might need to use a free RSS-to-JSON proxy, but the script will be fully prepared to handle the sync.*
*   **Files Affected:**
    *   `_includes/social-feed.html`
    *   `scripts/fetch_social.rb` (New file)
    *   `_data/social.json` (New file)
*   **Status:** [ ] Pending

## Verification
1.  Run `make serve` and verify no cookies are set and no banner appears.
2.  Verify the Hero section displays the correct upcoming gig from the cleaned CSV.
3.  Run `make new-post` to ensure the Markdown file is scaffolded perfectly.
4.  Verify the native social feed renders correctly using the data structure.
