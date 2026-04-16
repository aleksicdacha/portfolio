# Portfolio — Project Context & Change Log

> **Purpose**: Living document that AI agents and developers scan at the start of every session.
> Contains the **complete project context**, architecture, design system, infrastructure details,
> and a running log of every significant modification.
>
> **Rule**: Always **append** new changes to the Change Log at the bottom — never overwrite history.

---

## 1. Project Identity

| Field          | Value                                       |
| -------------- | ------------------------------------------- |
| **Name**       | Dalibor Aleksić — Developer Portfolio       |
| **Repo**       | `aleksicdacha/portfolio`                    |
| **Type**       | Angular 19 SPA (standalone components)      |
| **Owner**      | Dalibor Aleksić (`aleksic.dacha@gmail.com`) |
| **Production** | https://aleksicdacha.com                    |
| **Server**     | Hetzner VPS `46.224.231.217` (Ubuntu 24.04) |
| **Deploy**     | rsync + nginx reload (no server-side build) |

---

## 2. Architecture

```
src/
├── app/
│   ├── core/services/      → Singleton services (ThemeService, SeoService, ScrollService)
│   ├── data/
│   │   ├── profile.ts      → SINGLE SOURCE OF TRUTH for ALL content
│   │   ├── profile.model.ts → TypeScript interfaces
│   │   └── design.config.ts → Swappable design system config
│   ├── pages/              → Lazy-loaded route components
│   │   ├── home/           → Landing page
│   │   ├── projects/       → Portfolio grid + individual project detail
│   │   ├── experience/     → Work history timeline
│   │   ├── about/          → Bio section
│   │   ├── contact/        → Contact form
│   │   └── not-found/      → 404 page
│   └── shared/components/  → Reusable UI (Nav, Footer, BgScene, SkipLink)
├── assets/                 → CV PDF, headshot, project screenshots
└── styles/
    ├── _tokens.scss        → CSS custom properties (colors, spacing, shadows)
    ├── _animations.scss    → Keyframe animations
    ├── _typography.scss    → Font declarations
    └── _reset.scss         → CSS reset

deploy/
├── deploy.sh               → Quick deploy (build + rsync to Hetzner)
├── deploy-playbook.sh      → Master orchestration for ALL 3 projects
├── nginx/
│   ├── nginx.conf           → Global nginx config
│   ├── conf.d/rate-limiting.conf
│   ├── sites-available/     → Configs for portfolio, realestate, rps
│   └── snippets/            → security-headers.conf, ssl-params.conf
└── server-hardening/
    ├── setup-server.sh      → One-time Ubuntu hardening
    ├── setup-security-monitoring.sh → ClamAV, rkhunter, auditd
    └── daily-security-scan.sh → Crons: malware, rootkits, ports, logins
```

### Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Framework  | Angular 19 (standalone components, OnPush default) |
| Language   | TypeScript strict                                  |
| Styling    | SCSS + CSS custom properties + Tailwind utilities  |
| Animations | Angular animations + CSS keyframes                 |
| Routing    | Angular Router (lazy-loaded, view transitions)     |
| Deployment | rsync to Hetzner, nginx static serving             |
| Build      | Angular CLI, 500kB initial budget, SRI enabled     |

---

## 3. Critical Patterns

### 3.1 Content Management

**All portfolio content lives in `src/app/data/profile.ts`** — this is the single source of truth.
To update work history, projects, skills, education: edit ONLY this file.
Components read from the `PROFILE` constant; they never contain hardcoded content.

### 3.2 Design System (Swappable Variants)

Two design variants are defined in `src/app/data/design.config.ts`:

| Aspect        | Editorial (default)  | Brutalist          |
| ------------- | -------------------- | ------------------ |
| Accent        | `#0057FF` (blue)     | `#FF3B00` (orange) |
| Display font  | Fraunces (serif)     | Inter (sans-serif) |
| Border radius | 4-16px               | 0px (hard edges)   |
| Shadows       | Full depth hierarchy | None               |

- Switch variants: change `ACTIVE_DESIGN` export in `design.config.ts`
- Runtime switching: `ThemeService` + HTML `[data-variant]` attribute
- All spacing/colors/typography use CSS custom properties defined in `_tokens.scss`

### 3.3 SCSS Token System

Defined in `src/styles/_tokens.scss` on `:root`:

```
Fonts:     --font-body, --font-display, --font-mono, --font-logo
Spacing:   --space-1 (4px) through --space-32 (128px), base 4px
Radius:    --radius-sm, --radius-md, --radius-lg, --radius-full
Colors:    Light theme (bg #fafafa, surface #fff) / Dark theme (bg #0a0a0a)
Accent:    HSL via --accent-h (218°), --accent-s (100%), --accent-l (55%)
Shadows:   sm, md, lg, xl (layered opacity)
Transitions: --transition (200ms), --transition-fast (120ms), --transition-slow (400ms)
```

### 3.4 No Database

Pure SPA — all data is static TypeScript. No API calls, no backend, no database.

---

## 4. Data Model

### Profile Interface (profile.model.ts)

```typescript
Profile {
  name, headline, tagline, email, phone
  location, timezone, cvUrl, headshot
  socialLinks: SocialLink[]        // linkedin, github, email, external, instagram
  summary: string
  quickFacts: { label, value }[]
  experience: ExperienceItem[]     // company, role, dates, achievements[], tech[]
  projects: Project[]              // slug, title, liveUrl, repoUrl, imageUrl, tech[], featured
  skills: SkillGroup[]             // label, category (TechCategory), skills[]
  education: Education[]           // institution, degree, field, years
}

TechCategory = "frontend" | "backend" | "database" | "devops" | "testing"
             | "tools" | "platforms" | "security" | "performance" | "languages"
```

---

## 5. Routing

All routes are lazy-loaded standalone components:

| Route             | Component              | SEO Title                                |
| ----------------- | ---------------------- | ---------------------------------------- |
| `/`               | HomeComponent          | "Dalibor Aleksic – Full-Stack Developer" |
| `/projects`       | ProjectsComponent      | Portfolio grid                           |
| `/projects/:slug` | ProjectDetailComponent | Dynamic per project                      |
| `/experience`     | ExperienceComponent    | 20+ years timeline                       |
| `/about`          | AboutComponent         | Bio                                      |
| `/contact`        | ContactComponent       | Contact form                             |
| `**`              | NotFoundComponent      | 404                                      |

Router features: component input binding, in-memory scroll restoration ("top"), view transitions.

---

## 6. Root Component Structure

```html
<app-bg-scene />
<!-- Background visual -->
<skip-link to="#main-content" />
<!-- A11y -->
<app-nav />
<!-- Navigation -->
<main id="main-content" tabindex="-1">
  <router-outlet />
  <!-- Lazy-loaded page -->
</main>
<app-footer />
```

Services initialized on startup: `ThemeService.init()`, `SeoService.init()`

---

## 7. Infrastructure & Deployment

### This Repo Manages ALL Server Infrastructure

The `deploy/` directory is the **single source of truth** for the entire Hetzner server, covering three projects:

| Project             | Type               | Nginx Config      | Remote Path                   |
| ------------------- | ------------------ | ----------------- | ----------------------------- |
| Portfolio           | Angular SPA        | `portfolio.conf`  | `/root/Portfolio`             |
| RealEstatesAPI      | Turborepo monorepo | `realestate.conf` | `/root/RealEstatesAPI-NestJS` |
| Paper Rock Scissors | Node.js game       | `rps.conf`        | `/root/paper-rock-scissors`   |

### Deploy Commands

```bash
# Deploy portfolio only (build + rsync)
./deploy/deploy.sh <ssh-user>

# Master playbook for any project/phase
./deploy/deploy-playbook.sh <phase>
```

### Playbook Phases

`github-setup` | `server-bootstrap` | `deploy-portfolio` | `deploy-nginx` | `deploy-realestate` | `run-migrations` | `test` | `test-headers` | `test-ratelimit` | `test-auth` | `test-health` | `scan` | `status` | `logs`

### Nginx Configuration

- **Portfolio**: Port 80, static serving, Angular SPA fallback (`try_files $uri /index.html`)
- **Security**: X-Frame-Options DENY, CSP, X-XSS-Protection, nosniff, referrer-policy
- **Caching**: JS/CSS bundles immutable 1yr, images 6mo, HTML no-cache
- **Rate limiting**: 20 conn/IP, burst protection per route type
- **Scanner blocking**: /wp-admin, /phpmyadmin, /.env, /.git → 444

### Server Security Stack

1. **Base**: SSH key-only, UFW firewall, fail2ban (`setup-server.sh`)
2. **Monitoring**: ClamAV, rkhunter, chkrootkit, Lynis, auditd (`setup-security-monitoring.sh`)
3. **Daily scans**: Malware, rootkits, file changes, failed logins, open ports (`daily-security-scan.sh` at 03:30)

---

## 8. Build & Dev Commands

```bash
# Development
ng serve                  # Dev server on :4200

# Production build
ng build                  # Output: dist/portfolio/browser/
npm run build             # Same thing

# Deploy to Hetzner
./deploy/deploy.sh root   # Build + rsync + nginx reload

# Deploy infrastructure
./deploy/deploy-playbook.sh deploy-nginx    # Sync nginx configs
./deploy/deploy-playbook.sh test            # Run all verification tests
./deploy/deploy-playbook.sh status          # Show service health
```

---

## 9. Key Files

| File                            | Purpose                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `src/app/data/profile.ts`       | **ALL content** — experience, projects, skills, education |
| `src/app/data/design.config.ts` | Design variant config (Editorial vs Brutalist)            |
| `src/styles/_tokens.scss`       | CSS custom properties (colors, spacing, shadows)          |
| `src/app/app.routes.ts`         | Route definitions with SEO metadata                       |
| `deploy/deploy.sh`              | Production deployment (build + rsync)                     |
| `deploy/deploy-playbook.sh`     | Master orchestration for all 3 projects                   |
| `deploy/nginx/sites-available/` | Nginx configs for all hosted projects                     |
| `deploy/server-hardening/`      | Server setup & daily security scripts                     |
| `angular.json`                  | Build config, budgets, output                             |

---

## 10. Performance & Quality Notes

- **OnPush** change detection on all components (Angular schematics default)
- **Lazy loading** all route components (standalone imports)
- **Subresource Integrity** enabled in production builds
- **Budget**: 500kB initial warning, 1MB max error; 8kB per component style
- **Accessibility**: skip-link, semantic landmarks, tabindex management
- **SEO**: Per-route metadata (title, description, ogTitle) via SeoService

---

## Change Log

> Append each modification below. Format:
> `### YYYY-MM-DD — Brief Title`
>
> - What changed and why
> - Files affected

### 2026-04-16 — Created Comprehensive AGENTS.md

- Created `.github/AGENTS.md` as the living project context document
- Documents full architecture, data model, design system, deployment infrastructure
- Portfolio project was already clean — no files needed removal
- This file serves as the primary context for AI agents and new developers
