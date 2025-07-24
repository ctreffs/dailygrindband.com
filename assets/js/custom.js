document.addEventListener("DOMContentLoaded", function () {
  /**
   * Handles loading more news posts on button click.
   */
  const loadMoreNews = () => {
    const loadMoreBtn = document.getElementById("load-more-news");
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener("click", function () {
      const hiddenPost = document.querySelector(".news-post.d-none");
      if (hiddenPost) {
        hiddenPost.classList.remove("d-none");
      }

      // Hide button if no more posts are hidden
      if (!document.querySelector(".news-post.d-none")) {
        loadMoreBtn.classList.add("d-none");
      }
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
    const navLinks = document.querySelector("#navbarContent .navbar-nav:first-child");

    if (!navbarBrand || !heroTitle || !navLinks) return;

    const checkScroll = () => {
      const heroTitleBottom = heroTitle.getBoundingClientRect().bottom;
      const navbarHeight = navbarBrand.closest(".navbar").offsetHeight;

      // Get the space occupied by the navbar brand to shift the nav links
      const brandStyle = window.getComputedStyle(navbarBrand);
      const brandWidth = navbarBrand.offsetWidth;
      const brandMargin = parseFloat(brandStyle.marginRight);
      const brandSpace = brandWidth + brandMargin;

      if (heroTitleBottom < navbarHeight) {
        navbarBrand.classList.add("is-visible");
        navLinks.style.transform = "translateX(0)";
      } else {
        navbarBrand.classList.remove("is-visible");
        navLinks.style.transform = `translateX(-${brandSpace}px)`;
      }
    };

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial check on page load
  };

  loadMoreNews();
  handleCarouselVideos();
  handleNavbarBrandVisibility();
});