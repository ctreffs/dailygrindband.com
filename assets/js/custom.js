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
        carousel.next();
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

  loadMoreNews();
  handleCarouselVideos();
});