# Assignment 1 — Portfolio Website

## What This Is

A responsive personal portfolio website built with **HTML, CSS, and vanilla JavaScript**. No frameworks, no build tools — just the fundamentals.

---

## Features

- Sticky navigation bar with smooth scroll
- Hero section with animated avatar
- About section with skill bars
- Projects grid with hover effects
- Contact form with validation
- Hamburger menu for mobile
- Scroll reveal animations
- Active nav link highlighting

---

## How to Run

### Option 1: Open Directly in Browser

1. Navigate to this folder:
   ```bash
   cd Assignments/A1
   ```

2. Open `index.html` in your browser:
   - **Windows:** Double-click `index.html`, or right-click → Open with → Chrome/Edge
   - **Mac:** Double-click `index.html`, or `open index.html` in terminal
   - **Linux:** `xdg-open index.html`

### Option 2: Use a Local Server (Recommended)

Using a local server prevents CORS issues and mimics real hosting:

```bash
# If you have Python installed:
python -m http.server 8000

# If you have Node.js installed:
npx serve .

# If you have VS Code:
# Install "Live Server" extension, right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` (or the port shown).

---

## What You Need to Customize

### 1. Personal Information

Open `index.html` and replace placeholders:

| Line | What to Change | Example |
|------|---------------|---------|
| ~20 | `<div class="logo">Portfolio</div>` | Your brand name |
| ~35 | `<h1 class="hero-name">Your Name</h1>` | Your actual name |
| ~36 | `<h2 class="hero-role">Full Stack Developer</h2>` | Your role/title |
| ~37-40 | Hero bio paragraph | Your intro |
| ~66 | Avatar initials `<span>YN</span>` | Your initials |
| ~150 | Email `yourname@email.com` | Your email |
| ~154 | Phone `+91 12345 67890` | Your phone |
| ~158 | Location `Your City, India` | Your location |
| ~162-164 | Social links `href="#"` | Your GitHub/LinkedIn/Twitter URLs |
| ~200 | Footer `Your Name` | Your name |

### 2. Skills Section

Edit the skill bars in `index.html` (lines ~75-110):

```html
<div class="skill-item">
  <span class="skill-name">Your Skill</span>
  <div class="skill-bar">
    <div class="skill-fill" style="--fill: 85%"></div>
  </div>
</div>
```

Change `--fill: 85%` to your proficiency level (0-100%).

### 3. Projects Section

Replace the 4 placeholder projects (lines ~120-180) with your actual projects:

```html
<article class="project-card">
  <div class="card-img card-img-1">
    <span class="card-tag">Your Tech</span>
  </div>
  <div class="card-body">
    <h3>Your Project Name</h3>
    <p>Your project description...</p>
    <div class="card-links">
      <a href="https://your-demo.com" class="btn btn-sm">Live Demo</a>
      <a href="https://github.com/you/repo" class="btn btn-sm btn-outline">GitHub</a>
    </div>
  </div>
</article>
```

### 4. Colors (Optional)

Edit CSS custom properties in `style.css` (lines ~10-20):

```css
:root {
  --primary:     #6c63ff;  /* Main brand color */
  --accent:      #ff6584;  /* Secondary accent */
  --bg:          #0f0f1a;  /* Page background */
  --bg-card:     #1a1a2e;  /* Card background */
  /* ... */
}
```

---

## File Structure

```
A1/
├── index.html   # Main HTML structure
├── style.css    # All styles (CSS Grid, Flexbox, animations)
└── script.js    # Interactivity (hamburger, scroll reveal, form)
```

---

## Concepts Demonstrated

- **HTML5 Semantic Elements:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **CSS Flexbox:** Navbar, hero layout, contact grid
- **CSS Grid:** Projects grid with `auto-fit` and `minmax()`
- **CSS Custom Properties:** All colors and spacing in `:root`
- **CSS Animations:** Skill bar fill, avatar float, scroll reveal
- **Responsive Design:** Two breakpoints (900px, 600px)
- **JavaScript DOM:** `querySelector`, `addEventListener`, `classList`
- **Intersection Observer:** Active nav link, scroll reveal
- **Form Validation:** Contact form with required fields

---

## No Dependencies

This assignment uses **zero external libraries**. Everything is vanilla HTML, CSS, and JavaScript.

---

## Next Steps

1. Replace all placeholder text with your actual information
2. Add your real project links and descriptions
3. Adjust skill percentages to match your proficiency
4. Customize colors in `style.css` to match your brand
5. Test on mobile (resize browser or use DevTools device mode)
6. Deploy to GitHub Pages, Netlify, or Vercel

---

## Deployment (Optional)

### GitHub Pages (Free)

1. Push this folder to a GitHub repo
2. Go to repo Settings → Pages
3. Source: Deploy from branch `main`, folder `/Assignments/A1`
4. Your site will be at `https://username.github.io/repo-name/Assignments/A1/`

### Netlify (Free)

1. Drag the `A1` folder into [netlify.com/drop](https://app.netlify.com/drop)
2. Done — you get a live URL instantly

---

**Assignment 1 Complete** ✅  
A fully functional portfolio website ready to customize and deploy.
