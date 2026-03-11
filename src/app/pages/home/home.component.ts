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
  styleUrl: './home.component.scss',
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
