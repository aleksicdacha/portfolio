import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { PROFILE } from "../../data/profile";

@Component({
  selector: "app-home",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="hero section" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-content" [class.visible]="isVisible()">
          <p class="hero-eyebrow" aria-hidden="true">
            Available for opportunities
          </p>
          <h1 class="hero-title" id="hero-title">
            <span class="hero-name">{{ name }}</span>
            <span class="hero-role">{{ headline }}</span>
          </h1>
          <p class="hero-tagline">{{ tagline }}</p>
          <div class="hero-actions">
            <a class="btn-primary" routerLink="/projects">View Projects</a>
            <a class="btn-secondary" [href]="cvUrl" download>Download CV ↓</a>
          </div>

          <div class="hero-socials" aria-label="Social links">
            @for (link of socialLinks; track link.url) {
              <a
                class="hero-social-link"
                [href]="link.url"
                [target]="link.icon === 'email' ? '_self' : '_blank'"
                [attr.rel]="
                  link.icon !== 'email' ? 'noopener noreferrer' : null
                "
                [attr.aria-label]="link.label"
              >
                @switch (link.icon) {
                  @case ("linkedin") {
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                      />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  }
                  @case ("github") {
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  }
                  @case ("email") {
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  @default {
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path
                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                      />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  }
                }
                <span class="sr-only">{{ link.label }}</span>
              </a>
            }
          </div>
        </div>

        <!-- Quick Facts -->
        <aside
          class="hero-facts"
          [class.visible]="isVisible()"
          aria-label="Quick facts"
        >
          @for (fact of quickFacts; track fact.label) {
            <div class="fact-card">
              <dt class="fact-label">{{ fact.label }}</dt>
              <dd class="fact-value">{{ fact.value }}</dd>
            </div>
          }
        </aside>
      </div>
    </section>

    <!-- Selected Projects preview -->
    <section class="featured-projects section" aria-labelledby="featured-title">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title" id="featured-title">Featured Work</h2>
          <a class="section-link" routerLink="/projects">All projects →</a>
        </div>
        <div class="featured-grid">
          @for (project of featuredProjects; track project.slug) {
            <article class="featured-card" [class.first]="$first">
              <div class="featured-card-inner">
                <!-- Image placeholder -->
                <div class="featured-img">
                  @if (project.imageUrl) {
                    <img
                      [src]="project.imageUrl"
                      [alt]="project.title"
                      loading="lazy"
                      decoding="async"
                    />
                  } @else {
                    <div class="featured-placeholder">
                      <span>{{ project.year }}</span>
                    </div>
                  }
                </div>
                <div class="featured-body">
                  <div class="featured-meta">
                    <span>{{ project.year }}</span>
                    @if (project.company) {
                      <span>{{ project.company }}</span>
                    }
                  </div>
                  <h3 class="featured-title">{{ project.title }}</h3>
                  <p class="featured-desc">{{ project.description }}</p>
                  <div class="featured-tech">
                    @for (t of project.tech.slice(0, 4); track t) {
                      <span class="tech-pill">{{ t }}</span>
                    }
                  </div>
                  <a
                    [routerLink]="['/projects', project.slug]"
                    class="featured-cta"
                  >
                    View project →
                  </a>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Experience teaser -->
    <section class="exp-teaser section-alt" aria-labelledby="exp-title">
      <div class="container exp-grid">
        <div class="exp-text">
          <h2 class="section-title" id="exp-title">
            20+ Years of Building for the Web
          </h2>
          <p class="exp-lead">{{ summary }}</p>
          <a class="btn-outline" routerLink="/experience"
            >View full experience →</a
          >
        </div>
        <dl class="exp-stats">
          @for (stat of stats; track stat.value) {
            <div class="exp-stat">
              <dt class="stat-value">{{ stat.value }}</dt>
              <dd class="stat-label">{{ stat.label }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: [
    `
      /* Hero */
      .hero {
        padding-top: var(--space-20);
        padding-bottom: var(--space-20);
        overflow: hidden;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: var(--space-16);
        align-items: start;
      }
      .hero-content,
      .hero-facts {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 0.7s ease,
          transform 0.7s ease;
        &.visible {
          opacity: 1;
          transform: none;
        }
      }
      .hero-facts {
        transition-delay: 0.15s;
      }
      .hero-eyebrow {
        display: inline-block;
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: var(--space-4);
      }
      .hero-title {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin: 0 0 var(--space-6);
      }
      .hero-name {
        font-family: var(--font-display);
        font-size: clamp(3rem, 8vw, 6.5rem);
        font-weight: 700;
        line-height: 0.95;
        letter-spacing: -0.03em;
        color: var(--color-text);
      }
      .hero-role {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 4vw, 3rem);
        font-weight: 300;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--color-text-secondary);
      }
      .hero-tagline {
        font-size: clamp(1rem, 2vw, 1.125rem);
        color: var(--color-text-secondary);
        max-width: 520px;
        line-height: 1.7;
        margin: 0 0 var(--space-8);
      }
      .hero-actions {
        display: flex;
        gap: var(--space-4);
        flex-wrap: wrap;
      }
      .hero-socials {
        display: flex;
        gap: var(--space-4);
        margin-top: var(--space-6);
        align-items: center;
      }
      .hero-social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border);
        text-decoration: none;
        transition:
          color var(--transition-fast),
          border-color var(--transition-fast),
          background var(--transition-fast);
        &:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          background: color-mix(in srgb, var(--color-accent) 8%, transparent);
        }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      /* Quick Facts */
      .hero-facts {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-6);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
      }
      .fact-card {
        padding: var(--space-4) 0;
        border-bottom: 1px solid var(--color-border);
        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        &:first-child {
          padding-top: 0;
        }
      }
      .fact-label {
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-text-tertiary);
        margin-bottom: var(--space-1);
      }
      .fact-value {
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--color-text);
      }

      /* Section header */
      .section-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--space-10);
        gap: var(--space-4);
      }
      .section-link {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-accent);
        text-decoration: none;
        white-space: nowrap;
        &:hover {
          text-decoration: underline;
        }
      }

      /* Featured Projects */
      .featured-projects {
        padding: var(--space-20) 0;
      }
      .featured-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: var(--space-6);
      }
      .featured-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        transition:
          transform var(--transition),
          box-shadow var(--transition),
          border-color var(--transition);
        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-accent);
        }
      }
      .featured-img {
        aspect-ratio: 16/9;
        overflow: hidden;
        background: var(--color-surface-2);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .featured-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-family: var(--font-display);
          font-size: 4rem;
          font-weight: 700;
          color: var(--color-border);
          opacity: 0.4;
        }
      }
      .featured-body {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .featured-meta {
        display: flex;
        gap: var(--space-2);
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        span + span::before {
          content: "·";
          margin-right: var(--space-2);
        }
      }
      .featured-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text);
        margin: 0;
      }
      .featured-desc {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.6;
      }
      .featured-tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      .tech-pill {
        padding: 2px 10px;
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        background: var(--color-accent-subtle);
        color: var(--color-accent);
        border-radius: var(--radius-full);
      }
      .featured-cta {
        display: inline-block;
        margin-top: var(--space-2);
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-accent);
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }

      /* Experience teaser */
      .exp-teaser {
        padding: var(--space-20) 0;
      }
      .section-alt {
        background: var(--color-surface);
      }
      .exp-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-16);
        align-items: center;
      }
      .exp-lead {
        font-size: 1rem;
        color: var(--color-text-secondary);
        line-height: 1.7;
        margin: var(--space-4) 0 var(--space-8);
      }
      .exp-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-6);
      }
      .exp-stat {
        padding: var(--space-6);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg);
      }
      .stat-value {
        font-family: var(--font-display);
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.04em;
        color: var(--color-accent);
        display: block;
        margin-bottom: var(--space-1);
      }
      .stat-label {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
      }

      /* Brutalist overrides */
      :host-context([data-variant="brutalist"]) .hero-facts,
      :host-context([data-variant="brutalist"]) .featured-card,
      :host-context([data-variant="brutalist"]) .exp-stat {
        border-radius: 0;
        border: 2px solid var(--color-text);
      }
      :host-context([data-variant="brutalist"]) .hero-social-link {
        border-radius: 0;
        border: 2px solid var(--color-text);
      }
      :host-context([data-variant="brutalist"]) .featured-card:hover {
        transform: translate(-4px, -4px);
        box-shadow: 8px 8px 0 var(--color-text);
        border-color: var(--color-text);
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-content,
        .hero-facts {
          transition: none;
          opacity: 1;
          transform: none;
        }
        .featured-card {
          transition: none;
        }
        .featured-card:hover {
          transform: none;
        }
      }

      @media (max-width: 1024px) {
        .hero-grid {
          grid-template-columns: 1fr;
          gap: var(--space-10);
        }
        .hero-facts {
          flex-direction: row;
          flex-wrap: wrap;
        }
        .fact-card {
          min-width: 140px;
          flex: 1;
          border-bottom: none;
          border-right: 1px solid var(--color-border);
          &:last-child {
            border-right: none;
          }
          padding: 0 var(--space-4);
        }
        .exp-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .hero {
          padding-top: var(--space-12);
          padding-bottom: var(--space-12);
        }
        .hero-actions {
          flex-direction: column;
        }
        .hero-actions a {
          text-align: center;
        }
        .hero-facts {
          flex-direction: column;
        }
        .fact-card {
          border-right: none;
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-3) 0;
        }
        .featured-grid {
          grid-template-columns: 1fr;
        }
        .exp-stats {
          grid-template-columns: 1fr 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent implements AfterViewInit {
  private el = inject(ElementRef);

  readonly name = PROFILE.name;
  readonly headline = PROFILE.headline;
  readonly tagline = PROFILE.tagline;
  readonly summary = PROFILE.summary;
  readonly cvUrl = PROFILE.cvUrl;
  readonly quickFacts = PROFILE.quickFacts;
  readonly socialLinks = PROFILE.socialLinks;
  readonly featuredProjects = PROFILE.projects.filter((p) => p.featured);

  readonly stats = [
    { value: "20+", label: "Years Experience" },
    { value: "5+", label: "Countries Served" },
    { value: "10+", label: "Major Platforms" },
    { value: "∞", label: "Lines of Code" },
  ];

  isVisible = signal(false);

  ngAfterViewInit(): void {
    // Trigger entrance animation after a small frame delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.isVisible.set(true));
    });
  }
}
