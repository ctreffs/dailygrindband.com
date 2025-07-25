document.addEventListener("DOMContentLoaded", function () {
  /**
   * Handles loading more news posts on button click.
   */
  const loadMoreNews = () => {
    const loadMoreBtn = document.getElementById("load-more-news");
    const olderNewsContainer = document.getElementById("older-news-container");
    if (!loadMoreBtn || !olderNewsContainer) return;

    loadMoreBtn.addEventListener("click", function () {
      // Show the container with all older news posts
      olderNewsContainer.classList.remove("d-none");
      // Hide the button after it's clicked
      loadMoreBtn.classList.add("d-none");
    });
  };

  /**
   * Handles video playback in the news carousel.
   * - Advances to the next slide when a video ends.
   * - Pauses non-visible videos and plays the active one when slides change.
   * - Shows video controls on hover.
   */
  const handleCarouselVideos = () => {
    const newsCarouselElement = document.getElementById("newsCarousel");
    if (!newsCarouselElement) return;

    const carousel = bootstrap.Carousel.getOrCreateInstance(newsCarouselElement);
    if (!carousel) return;

    const videos = newsCarouselElement.querySelectorAll(".news-carousel-video");

    videos.forEach((video) => {
      video.addEventListener("ended", () => {
        // Only advance the carousel if the video is not set to loop
        if (!video.hasAttribute("loop")) {
          carousel.next();
        }
      });

      // Add hover listeners to the parent carousel item to show/hide controls
      const parentItem = video.closest(".carousel-item");
      if (!parentItem) return;

      parentItem.addEventListener("mouseenter", () => {
        video.setAttribute("controls", "true");
      });

      parentItem.addEventListener("mouseleave", () => {
        video.removeAttribute("controls");
      });
    });

    newsCarouselElement.addEventListener("slid.bs.carousel", (event) => {
      // Pause all videos to ensure only the active one plays
      videos.forEach((v) => v.pause());

      // Play the video in the newly active slide, if there is one
      const activeVideo = event.relatedTarget.querySelector(".news-carousel-video");
      if (activeVideo) {
        activeVideo.play().catch((e) => console.error("Video autoplay failed:", e));
      }
    });
  };

  /**
   * Shows or hides the navbar brand based on the hero section's visibility.
   * The brand becomes visible when the hero section is scrolled out of view,
   * and the nav links shift to the right to make space for it.
   */
  const handleNavbarBrandVisibility = () => {
    const navbarBrand = document.querySelector("#navbar-main .navbar-brand");
    const heroTitle = document.getElementById("hero-title-image");
    const navLinks = document.getElementById("main-nav-links");
    const navbarContent = document.getElementById("navbarContent");

    if (!navbarBrand || !navLinks || !navbarContent) return;

    // If heroTitle doesn't exist, we are on a sub-page.
    // In this case, just make the brand logo permanently visible and stop.
    if (!heroTitle) {
      navbarBrand.classList.add("is-visible");
      return;
    }

    // The rest of the logic only applies to the main page where the hero title exists.

    const checkVisibility = () => {
      const toggler = document.querySelector(".navbar-toggler");
      const isMobileView = toggler && getComputedStyle(toggler).display !== "none";

      const heroTitleBottom = heroTitle.getBoundingClientRect().bottom;
      const navbarHeight = navbarBrand.closest(".navbar").offsetHeight;
      const isHeroScrolledPast = heroTitleBottom < navbarHeight;

      if (isMobileView) {
        // On mobile, reset transform and handle brand visibility.
        navLinks.style.transform = "";
        const isMenuOpen = navbarContent.classList.contains("show");

        if (isMenuOpen || isHeroScrolledPast) {
          navbarBrand.classList.add("is-visible");
        } else {
          navbarBrand.classList.remove("is-visible");
        }
        return;
      }

      // Desktop logic
      const brandStyle = window.getComputedStyle(navbarBrand);
      const brandWidth = navbarBrand.offsetWidth;
      const brandMargin = parseFloat(brandStyle.marginRight);
      const brandSpace = brandWidth + brandMargin;

      if (isHeroScrolledPast) {
        navbarBrand.classList.add("is-visible");
        navLinks.style.transform = "";
      } else {
        navbarBrand.classList.remove("is-visible");
        navLinks.style.transform = `translateX(-${brandSpace}px)`;
      }
    };

    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);
    navbarContent.addEventListener("shown.bs.collapse", checkVisibility);
    navbarContent.addEventListener("hidden.bs.collapse", checkVisibility);
    checkVisibility(); // Initial check on page load
  };

  /**
   * Closes the responsive navbar on mobile when a nav link is clicked.
   */
  const handleNavbarAutoclose = () => {
    const navbarContent = document.getElementById("navbarContent");
    if (!navbarContent) return;

    const navLinks = navbarContent.querySelectorAll(".nav-link");
    const navbarToggler = document.querySelector(".navbar-toggler");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Check if the navbar toggler is visible (mobile view) and the menu is expanded
        const isMobileView = navbarToggler && getComputedStyle(navbarToggler).display !== "none";
        if (isMobileView && navbarContent.classList.contains("show")) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarContent);
          bsCollapse.hide();
        }
      });
    });
  };

  /**
   * Manages the hero section's scroll-down chevron.
   * - It is positioned relative to the bottom of the hero section on page load.
   * - It becomes "sticky" to the bottom of the viewport when the user scrolls down
   *   as long as the hero section is in view.
   * - It hides as soon as the content below the hero section becomes visible.
   * - It provides smooth scrolling to the #news section.
   */
  const handleHeroChevron = () => {
    const chevronContainer = document.getElementById("scroll-down-chevron");
    const heroSection = document.getElementById("hero");
    const newsSection = document.getElementById("news"); // The section below hero

    // If any element is missing, do nothing. This also prevents errors on sub-pages.
    if (!chevronContainer || !heroSection || !newsSection) {
      if (chevronContainer) chevronContainer.style.display = "none";
      return;
    }

    const chevronLink = chevronContainer.querySelector("a");
    if (chevronLink) {
      chevronLink.addEventListener("click", function (event) {
        event.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Add transition for smooth effects
    chevronContainer.style.transition = "opacity 0.3s ease, bottom 0.1s linear";

    const checkChevronState = () => {
      const heroRect = heroSection.getBoundingClientRect();
      const newsRect = newsSection.getBoundingClientRect();

      // --- Positioning Logic ---
      // Calculate how far the hero's bottom is from the viewport's bottom.
      const heroBottomOffset = heroRect.bottom - window.innerHeight;
      // The chevron's 'bottom' should be this offset, but never less than 0.
      // This makes it stick to the hero bottom, then to the viewport bottom.
      const chevronBottomPosition = Math.max(0, heroBottomOffset);
      chevronContainer.style.bottom = `${chevronBottomPosition}px`;

      // --- Visibility Logic ---
      // Hide the chevron if the top of the news section is visible in the viewport.
      const isNewsVisible = newsRect.top < window.innerHeight;
      chevronContainer.style.opacity = isNewsVisible ? "0" : "1";
      chevronContainer.style.pointerEvents = isNewsVisible ? "none" : "auto";
    };

    window.addEventListener("scroll", checkChevronState);
    window.addEventListener("resize", checkChevronState);
    checkChevronState(); // Initial check on page load
  };

  loadMoreNews();
  handleCarouselVideos();
  handleNavbarBrandVisibility();
  handleNavbarAutoclose();
  handleHeroChevron();
});