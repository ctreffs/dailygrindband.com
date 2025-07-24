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

  loadMoreNews();
});