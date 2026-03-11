# Dalibor Aleksic – Portfolio

> Production-ready Angular 19 SPA portfolio website.  
> Built with standalone components, OnPush change detection, Angular Router with lazy-loaded routes, and CSS variables for full theming.

---

## Design System

### Fonts

| Role                | Font                                 | Weights                 |
| ------------------- | ------------------------------------ | ----------------------- |
| Body / UI           | **Inter**                            | 300, 400, 500, 600, 700 |
| Display / Headlines | **Fraunces** (variable optical size) | 300, 400, 700           |

Fonts load via Google Fonts in `src/index.html` with `display=swap` for performance.

### Spacing Scale

Based on a **4px base unit**:

| Token        | Value |
| ------------ | ----- |
| `--space-1`  | 4px   |
| `--space-2`  | 8px   |
| `--space-3`  | 12px  |
| `--space-4`  | 16px  |
| `--space-6`  | 24px  |
| `--space-8`  | 32px  |
| `--space-12` | 48px  |
| `--space-16` | 64px  |
| `--space-20` | 80px  |
| `--space-24` | 96px  |
| `--space-32` | 128px |

### Color Tokens

| Token                    | Light                 | Dark      |
| ------------------------ | --------------------- | --------- |
| `--color-bg`             | `#FAFAFA`             | `#0A0A0A` |
| `--color-surface`        | `#FFFFFF`             | `#141414` |
| `--color-text`           | `#0A0A0A`             | `#F5F5F5` |
| `--color-text-secondary` | `#6B6B6B`             | `#A3A3A3` |
| `--color-accent`         | `hsl(218, 100%, 55%)` | same      |
| `--color-border`         | `#E5E5E5`             | `#2A2A2A` |

### Accent Color

Change the accent by editing these HSL variables in `src/styles/_tokens.scss`:

```scss
--accent-h: 218; // hue   (0–360)
--accent-s: 100%; // saturation
--accent-l: 55%; // lightness
```

### Components

| Component            | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `<app-nav>`          | Sticky top navigation with mobile hamburger menu          |
| `<app-footer>`       | 3-column footer with logo, nav links, social links        |
| `<app-theme-toggle>` | Moon/Sun icon button; persists preference to localStorage |
| `<app-skill-tag>`    | Small bordered pill with category support                 |
| `<app-project-card>` | Project card with image, tech tags, links                 |

### Design Variants

Set via `[data-variant]` attribute on `<html>`:

| Variant                   | `data-variant` | Description                                                      |
| ------------------------- | -------------- | ---------------------------------------------------------------- |
| **A – Editorial Minimal** | `editorial`    | Clean, typography-first, soft shadows, rounded corners           |
| **B – Soft Brutalist**    | `brutalist`    | Thick borders, zero border-radius, offset shadows, warm cream bg |

To permanently switch variants, edit `src/app/data/design.config.ts`:

```ts
export const ACTIVE_DESIGN: DesignConfig = BRUTALIST; // change to BRUTALIST
```

Or call `themeService.setVariant('brutalist')` at runtime.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app reloads on file changes.

### Build

**Development build:**

```bash
npm run watch
```

**Production build:**

```bash
npm run build:prod
# Output: dist/portfolio/browser/
```

---

## Updating Content

**All personal data lives in a single file:**

```
src/app/data/profile.ts
```

Edit this file to update:

- Name, headline, tagline, contact info
- Experience timeline entries
- Projects (title, description, links, tech stack)
- Skills groups
- Education, interests, Now/Next section

**No component files need to be touched** — all UI reads from `PROFILE`.

### Adding a project screenshot

1. Drop the image in `src/assets/images/projects/`
2. Update the `imageUrl` field in `profile.ts`:

```ts
imageUrl: 'assets/images/projects/my-project.jpg',
```

### Updating the CV PDF

1. Replace `src/assets/cv/dalibor-aleksic-cv.pdf`
2. Or update the path in `profile.ts`:

```ts
cvUrl: 'assets/cv/dalibor-aleksic-cv.pdf',
```

---

## Deployment

### Netlify (recommended)

1. Push repo to GitHub
2. Connect repo on [app.netlify.com](https://app.netlify.com)
3. Build settings are in `netlify.toml` (auto-detected):
   - **Build command:** `npm run build:prod`
   - **Publish directory:** `dist/portfolio/browser`
4. SPA redirects are configured automatically via `netlify.toml`

### Vercel

```bash
npm i -g vercel
vercel --prod
```

Vercel detects Angular automatically. Ensure the output directory is `dist/portfolio/browser`.

Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages

1. Set the repo name and update `angular.json` base-href if needed.
2. Build:

```bash
npm run build:gh-pages
# Adjust --base-href to match your repo name, e.g.:
# ng build --configuration production --base-href /portfolio/
```

3. Deploy `dist/portfolio/browser/` to the `gh-pages` branch:

```bash
npx angular-cli-ghpages --dir=dist/portfolio/browser
```

Or use the GitHub Action below:

```yaml
# .github/workflows/gh-pages.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run build:gh-pages
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/portfolio/browser
```

The `public/404.html` handles SPA deep-link routing on GitHub Pages.

---

## Performance Checklist

- [x] Lazy-loaded routes (all pages are separate chunks)
- [x] `OnPush` change detection on all components
- [x] `loading="lazy"` + `decoding="async"` on all non-hero images
- [x] Google Fonts with `display=swap`
- [x] CSS variables (zero JS for theming)
- [x] Minimal dependencies (no heavy UI framework)
- [ ] **TODO:** Convert images to WebP format
- [ ] **TODO:** Add `<link rel="preload">` for hero image
- [ ] **TODO:** Enable `@angular/service-worker` (PWA) for offline support
- [ ] **TODO:** Set up proper Content Security Policy headers on host

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── theme.service.ts      # Dark/light mode + variant management
│   │       ├── seo.service.ts        # Title / meta / OG per route
│   │       └── clipboard.service.ts  # Copy to clipboard
│   ├── data/
│   │   ├── profile.model.ts          # TypeScript interfaces
│   │   ├── profile.ts               # ← EDIT THIS FILE to update all content
│   │   └── design.config.ts         # Design variant configuration
│   ├── shared/
│   │   └── components/
│   │       ├── nav/                  # Sticky navigation
│   │       ├── footer/              # Site footer
│   │       ├── theme-toggle/        # Light/dark toggle button
│   │       ├── skill-tag/           # Skill/tech tag pill
│   │       └── project-card/        # Project grid card
│   ├── pages/
│   │   ├── home/                    # / (hero, featured work, experience teaser)
│   │   ├── projects/                # /projects (grid + filters)
│   │   │   └── project-detail/      # /projects/:slug
│   │   ├── experience/              # /experience (timeline)
│   │   ├── about/                   # /about (bio, skills, education)
│   │   ├── contact/                 # /contact (email + form)
│   │   └── not-found/               # ** (404 page)
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
│   ├── cv/                          # Drop CV PDF here
│   └── images/                      # Headshot, OG image, project screenshots
├── styles/
│   ├── _tokens.scss                 # Design tokens (colors, spacing, radii)
│   ├── _reset.scss                  # CSS reset
│   ├── _typography.scss             # Typography utilities
│   └── _animations.scss             # Keyframes + view transitions
├── styles.scss                      # Global styles entry + button system
├── index.html                       # Shell HTML + SEO meta + fonts
└── main.ts                          # Bootstrap
```

---

## License

MIT – feel free to fork and adapt for your own portfolio.
