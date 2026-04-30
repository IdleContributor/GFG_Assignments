// =============================================
// DARK / LIGHT THEME TOGGLE
// Flips data-theme on <html> between "dark"
// and "light". CSS variables handle the rest —
// no inline styles needed.
// =============================================
const html        = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const toggleIcon  = document.querySelector(".theme-toggle__icon");

// Persist preference across page reloads
const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  // Moon = currently dark (click to go light), Sun = currently light (click to go dark)
  toggleIcon.textContent = theme === "dark" ? "☀" : "☾";
}

// =============================================
// HAMBURGER MENU TOGGLE (mobile nav)
// =============================================
const hamburger = document.querySelector(".hamburger");
const navLinks  = document.querySelector(".nav__links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// =============================================
// ACTIVE NAV LINK ON SCROLL
// Highlights the nav link for the section
// currently in the viewport
// =============================================
const sections = document.querySelectorAll("section[id]");
const links    = document.querySelectorAll(".nav__link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => link.classList.remove("nav__link--active"));
        const active = document.querySelector(
          `.nav__link[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add("nav__link--active");
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

// =============================================
// CTA FORM SUBMISSION
// =============================================
const ctaForm = document.querySelector(".cta__form");

ctaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = ctaForm.email.value.trim();

  if (!email) {
    ctaForm.email.focus();
    return;
  }

  const btn = ctaForm.querySelector(".cta__submit");
  btn.textContent = "You're In ✓";
  btn.style.background = "#22c55e";
  btn.disabled = true;

  ctaForm.reset();

  setTimeout(() => {
    btn.textContent = "Get Access";
    btn.style.background = "";
    btn.disabled = false;
  }, 3000);
});

// =============================================
// SCROLL REVEAL ANIMATION
// Fades in elements as they enter the viewport
// =============================================
const revealElements = document.querySelectorAll(
  ".feature-card, .stats__item, .banner__card, .cta__inner"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = "1";
        entry.target.style.transform  = "translateY(0)";
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => {
  el.style.opacity    = "0";
  el.style.transform  = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  revealObserver.observe(el);
});
