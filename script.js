/* ============================================================
   CAUSEWAY CHRONICLE — script.js
   ============================================================ */

// ─── DARK MODE TOGGLE ───────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;
const html = document.documentElement;

const savedTheme = localStorage.getItem("cc-theme") || "light";
html.setAttribute("data-theme", savedTheme);
if (themeIcon) themeIcon.textContent = savedTheme === "dark" ? "☀" : "☽";

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("cc-theme", next);
    if (themeIcon) themeIcon.textContent = next === "dark" ? "☀" : "☽";
  });
}

// ─── BACK TO TOP ────────────────────────────────────────────
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── READING PROGRESS BAR ───────────────────────────────────
const progressBar = document.getElementById("readingProgress");

if (progressBar) {
  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  });
}

// ─── SEARCH ─────────────────────────────────────────────────
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const searchStatus = document.getElementById("searchStatus");
const noResults = document.getElementById("noResults");
const fieldNotes = document.getElementById("fieldNotes");
const memoryMap = document.getElementById("memoryMap");

// Collect all searchable items on page load
const searchables = document.querySelectorAll(".searchable");

function performSearch(query) {
  const q = query.trim().toLowerCase();

  // Toggle clear button
  if (searchClear) {
    searchClear.classList.toggle("visible", q.length > 0);
  }

  if (q === "") {
    // Reset everything
    searchables.forEach(function (el) {
      el.classList.remove("search-hidden");
    });
    if (searchStatus) searchStatus.textContent = "";
    if (noResults) noResults.style.display = "none";
    if (fieldNotes) fieldNotes.style.display = "";
    if (memoryMap) memoryMap.style.display = "";
    return;
  }

  // Hide secondary sections while searching
  if (fieldNotes) fieldNotes.style.display = "none";
  if (memoryMap) memoryMap.style.display = "none";

  let visibleCount = 0;

  searchables.forEach(function (el) {
    const tags = (el.getAttribute("data-tags") || "").toLowerCase();
    const text = el.textContent.toLowerCase();
    const matches = tags.includes(q) || text.includes(q);

    if (matches) {
      el.classList.remove("search-hidden");
      visibleCount++;
    } else {
      el.classList.add("search-hidden");
    }
  });

  if (searchStatus) {
    searchStatus.textContent = visibleCount === 0
      ? ""
      : visibleCount === 1
      ? "1 story found"
      : visibleCount + " stories found";
  }

  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    performSearch(this.value);
  });
}

if (searchClear) {
  searchClear.addEventListener("click", function () {
    searchInput.value = "";
    performSearch("");
    searchInput.focus();
  });
}

// ─── FORM SUBMISSION ────────────────────────────────────────
const postcardForm = document.querySelector(".postcard-form");
const formMessage = document.querySelector(".form-message");

if (postcardForm && formMessage) {
  postcardForm.addEventListener("submit", function (event) {
    event.preventDefault();
    formMessage.textContent = "✦ Your story has been sent to The Chronicle.";
    postcardForm.reset();
    setTimeout(function () {
      formMessage.textContent = "";
    }, 4500);
  });
}

// ─── SCROLL REVEAL ──────────────────────────────────────────
// Main story — fade up
const mainStory = document.querySelector(".main-story");
if (mainStory) mainStory.classList.add("hidden");

// Side stories — slide in from right
document.querySelectorAll(".side-stories article").forEach(function (el) {
  el.classList.add("hidden-right");
});

// Note cards — fade up with stagger (handled via CSS delay)
document.querySelectorAll(".note-card").forEach(function (el) {
  el.classList.add("hidden");
});

// Memory map — scale in
const memMapEl = document.querySelector(".memory-map");
if (memMapEl) memMapEl.classList.add("hidden-scale");

// Postcard — fade up
const postcardEl = document.querySelector(".postcard");
if (postcardEl) postcardEl.classList.add("hidden");

// Article elements — fade up
document.querySelectorAll(".article-content, .article-sidebar .sidebar-box, .article-hero").forEach(function (el) {
  el.classList.add("hidden");
});

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(
  ".main-story, .side-stories article, .note-card, .memory-map, .postcard, .article-content, .article-hero, .article-sidebar .sidebar-box"
).forEach(function (el) {
  observer.observe(el);
});