(function () {
  // --------------------------------------------------------------------
  // ---------- Dark/Light Mode ----------
  // --------------------------------------------------------------------
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  // 1. Load saved preference (or system preference) on every page load
  const saved = localStorage.getItem("rodtheme");
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  // 2. Toggle and persist
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = html.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("rodtheme", next);
    });
  }

  // 3. Optional: stay in sync if user has two tabs open
  window.addEventListener("storage", (e) => {
    if (
      e.key === "rodtheme" &&
      (e.newValue === "dark" || e.newValue === "light")
    ) {
      applyTheme(e.newValue);
    }
  });

  // --------------------------------------------------------------------
  // ---------- Header hide on scroll down / show on scroll up ----------
  // --------------------------------------------------------------------
  const header = document.getElementById("site-header");
  if (!header) return;

  let lastScroll = 0;
  const threshold = 60; // start hiding after this many px

  window.addEventListener(
    "scroll",
    () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;

      if (current < threshold) {
        // Near top - always show
        header.style.transform = "translateY(0)";
      } else if (current > lastScroll) {
        // Scrolling down - hide
        header.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up - show
        header.style.transform = "translateY(0)";
      }

      lastScroll = current <= 0 ? 0 : current;
    },
    { passive: true },
  );

  // --------------------------------------------------------------------
  // ---------- Filter (smoother Isotope-like) ----------
  // --------------------------------------------------------------------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = Array.from(document.querySelectorAll(".portfolio-item"));
  const grid = document.getElementById("portfolio-grid");

  function applyFilter(filter) {
    items.forEach((item) => {
      const categories = item.dataset.category.split(" ");
      const match = filter === "all" || categories.includes(filter);

      if (match) {
        item.classList.remove("is-hidden");
        // force reflow then show
        item.style.display = "";
      } else {
        item.classList.add("is-hidden");
      }
    });

    // After transition, fully remove non-matching from layout flow
    setTimeout(() => {
      items.forEach((item) => {
        if (item.classList.contains("is-hidden")) {
          item.style.display = "none";
        }
      });
    }, 400);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  // --------------------------------------------------------------------
  // ---------- Modal ----------
  // --------------------------------------------------------------------
  const modal = document.getElementById("modal");
  if (modal) {
    const modalTitle = document.getElementById("modal-title");
    const modalRole = document.getElementById("modal-role");
    const modalDesc = document.getElementById("modal-desc");
    const modalTech = document.getElementById("modal-tech");
    const modalLink = document.getElementById("modal-link");
    const modalLinkText = document.getElementById("modal-link-text");
    const modalClose = document.getElementById("modal-close");
    const modalBackdrop = document.getElementById("modal-backdrop");
    const modalImage = document.getElementById("modal-image");
    const modalImagePlaceholder = document.getElementById("modal-image-placeholder");

    function openModal(item) {
      modalTitle.textContent = item.dataset.title;
      modalRole.textContent = item.dataset.role;
      modalDesc.textContent = item.dataset.desc;
      // modalImagePlaceholder.textContent = item.dataset.title;

      // Tech tags
      modalTech.innerHTML = "";
      item.dataset.tech.split(",").forEach((tech) => {
        const span = document.createElement("span");
        span.className =
          "px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full";
        span.textContent = tech.trim();
        modalTech.appendChild(span);
      });

      const link = item.dataset.link;
      if (link && link !== "#") {
        modalLink.href = link;
        modalLink.classList.remove("hidden");
        modalLinkText.textContent = item.dataset.linkText || "View Project";
      } else {
        modalLink.classList.add("hidden");
      }

      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    items.forEach((item) => {
      item.addEventListener("click", () => openModal(item));
    });

    modalClose.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open"))
        closeModal();
    });
  }

  // --------------------------------------------------------------------
  // ---------- Copyright ----------
  // --------------------------------------------------------------------
  document.getElementById("year").textContent = new Date().getFullYear();
})();
