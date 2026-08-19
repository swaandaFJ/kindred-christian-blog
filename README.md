# Kindred

A Christian devotional and article platform — read daily devotionals, browse articles, and (if invited) submit and review writing. Built as a plain HTML/CSS/JS front-end prototype, no framework or build step required.

> Read. Reflect. Belong.

🔗https://swaandafj.github.io/kindred-christian-blog/

---

## Features

- **Homepage** — today's devotional front and center, plus a grid of recent articles.
- **Articles** — full reading view with related content, bookmarking, and a share action.
- **Search** — debounced search-as-you-type, with a built-in demo toggle for loading / empty / error / ready states.
- **Auth (simulated)** — combined login/signup with client-side validation. Any email/password works; there's no real backend.
- **Bookmarks** — save articles for later, persisted in `localStorage`. Bookmarking while logged out opens an inline sign-up panel instead of redirecting away.
- **Writer Studio** — a dashboard for drafting, autosaving, and submitting articles for review.
- **Editor Studio** — a review queue and per-article review screen (approve / request changes / reject), with mandatory feedback on any non-approval decision.
- **Give** — a donation flow with preset/custom amounts, monthly vs. one-time, a fee-cover option with a live total, and a simulated declined-card state.

## Project structure

```
.
├── index.html              # Homepage — the only page at the project root
├── pages/                  # Every other page
│   ├── article.html
│   ├── bookmarks.html
│   ├── editor.html
│   ├── give.html
│   ├── login.html
│   ├── review-article.html
│   ├── review-queue.html
│   ├── search.html
│   ├── thank-you.html
│   └── writer-dashboard.html
├── css/
│   └── style.css           # Full design system: tokens, layout, components
└── js/
    ├── data.js              # Dummy/demo data (articles, queue, etc.)
    └── app.js                # Shared behavior: bookmarking, nav, toasts, renderers
```

`index.html` links into `pages/`; every file in `pages/` references `css/` and `js/` via `../`, and links back to the homepage via `../index.html`.

## Getting started

No build step, no dependencies. Two ways to run it:

**Just open it**
Double-click `index.html`, or open it directly in a browser.

**Serve it locally** (recommended — some browsers restrict `fetch`/module behavior on `file://` URLs)
```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000
```
Any static file server works equally well (`npx serve`, VS Code's Live Server, etc.).

## Notes on the demo

- **Login is fully simulated.** Any email and password combination logs you in; there's no real authentication or backend.
- **Data is in-memory/local only.** Articles, the review queue, and writer submissions are all hardcoded in `js/data.js`. Bookmarks and login state persist across page loads via `localStorage`, but nothing is sent to a server.
- **Card payments are simulated.** On the Give page, any card number works except one starting with `0000`, which triggers the declined-card state on purpose.

## Design system

Colors, type, spacing, and component states are all defined as CSS custom properties in `css/style.css` — see the `:root` block at the top of the file for the full token list (palette, radii, shadows, spacing scale).

---
