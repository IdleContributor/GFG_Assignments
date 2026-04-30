// =============================================
// HAMBURGER MENU TOGGLE (mobile nav)
// =============================================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
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
const links = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => link.classList.remove("active"));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => observer.observe(section));

// =============================================
// CONTACT FORM SUBMISSION
// =============================================
const form = document.querySelector(".contact-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all required fields.");
    return;
  }

  // Simulate a successful send
  const btn = form.querySelector("button[type='submit']");
  btn.textContent = "Message Sent ✓";
  btn.style.background = "#22c55e";
  btn.disabled = true;

  form.reset();

  // Reset button after 3 seconds
  setTimeout(() => {
    btn.textContent = "Send Message";
    btn.style.background = "";
    btn.disabled = false;
  }, 3000);
});

// =============================================
// SCROLL REVEAL ANIMATION
// Fades in elements as they enter the viewport
// =============================================
const revealElements = document.querySelectorAll(
  ".project-card, .skill-item, .about-text, .contact-info, .contact-form"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  revealObserver.observe(el);
});
