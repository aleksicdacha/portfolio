import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PROFILE } from "../../data/profile";
import { SkillTagComponent } from "../../shared/components/skill-tag/skill-tag.component";

@Component({
  selector: "app-about",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SkillTagComponent],
  template: `
    <div class="page-about">
      <!-- Bio Section -->
      <section class="section about-hero">
        <div class="container about-grid">
          <!-- Text -->
          <div class="about-text">
            <p class="page-eyebrow">About</p>
            <h1 class="page-title">{{ name }}</h1>
            <h2 class="about-headline">{{ headline }}</h2>
            <p class="about-bio">{{ summary }}</p>
            <div class="about-actions">
              <a class="btn-primary" routerLink="/contact">Get In Touch</a>
              <a class="btn-outline" [href]="cvUrl" download>Download CV ↓</a>
            </div>
          </div>

          <!-- Photo -->
          <aside class="about-photo-col">
            <div class="about-photo" aria-label="Profile photo">
              @if (headshot) {
                <img
                  [src]="headshot"
                  [alt]="name + ' – ' + headline"
                  loading="eager"
                  decoding="async"
                  width="480"
                  height="560"
                />
              } @else {
                <!-- TODO: Replace with actual headshot image in profile.ts -->
                <div class="photo-placeholder" aria-hidden="true">
                  <span class="initials">DA</span>
                </div>
              }
            </div>
          </aside>
        </div>
      </section>

      <!-- Now / Next -->
      <section class="section-alt section" aria-labelledby="nownext-title">
        <div class="container">
          <h2 class="section-title" id="nownext-title">Now & Next</h2>
          <div class="nownext-grid">
            @for (item of nowNext; track item.label) {
              <div class="nownext-card">
                <h3 class="nownext-label">{{ item.label }}</h3>
                <p class="nownext-text">{{ item.text }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section class="section" aria-labelledby="skills-title">
        <div class="container">
          <h2 class="section-title" id="skills-title">Skills & Expertise</h2>
          <p class="section-sub">
            Technologies and practices I've worked with across 20+ years of
            professional development.
          </p>
          <div class="skills-grid">
            @for (group of skillGroups; track group.label) {
              <div class="skill-group">
                <h3 class="skill-group-title">
                  <span class="skill-group-icon" aria-hidden="true">{{
                    getCategoryIcon(group.category)
                  }}</span>
                  {{ group.label }}
                </h3>
                <div class="skill-tags">
                  @for (skill of group.skills; track skill) {
                    <app-skill-tag
                      [label]="skill"
                      [category]="group.category"
                    />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Education -->
      <section class="section-alt section" aria-labelledby="edu-title-about">
        <div class="container">
          <h2 class="section-title" id="edu-title-about">Education</h2>
          <div class="edu-list">
            @for (edu of education; track edu.institution) {
              <div class="edu-item">
                <p class="edu-degree">{{ edu.degree }} in {{ edu.field }}</p>
                <p class="edu-institution">{{ edu.institution }}</p>
                <p class="edu-loc">{{ edu.years }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Interests -->
      <section
        class="section interests-section"
        aria-labelledby="interests-title"
      >
        <div class="container">
          <h2 class="section-title" id="interests-title">Interests</h2>
          <div class="interests-list">
            @for (interest of interests; track interest) {
              <span class="interest-tag">{{ interest }}</span>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      /* About Hero */
      .about-hero {
        padding: var(--space-16) 0 var(--space-20);
      }
      .about-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: var(--space-16);
        align-items: start;
      }
      .page-eyebrow {
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: var(--space-4);
      }
      .about-headline {
        font-size: 1.25rem;
        font-weight: 400;
        color: var(--color-text-secondary);
        margin: var(--space-2) 0 var(--space-6);
      }
      .about-bio {
        font-size: 1.0625rem;
        color: var(--color-text-secondary);
        line-height: 1.75;
        margin-bottom: var(--space-8);
      }
      .about-actions {
        display: flex;
        gap: var(--space-4);
        flex-wrap: wrap;
      }

      /* Photo */
      .about-photo {
        border-radius: var(--radius-md);
        overflow: hidden;
        aspect-ratio: 1/1;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 200px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .photo-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          var(--color-surface-2) 0%,
          var(--color-surface) 100%
        );
      }
      .initials {
        font-family: var(--font-display);
        font-size: 6rem;
        font-weight: 700;
        color: var(--color-border);
        opacity: 0.6;
        letter-spacing: -0.05em;
      }

      /* Now & Next */
      .section-alt {
        background: var(--color-surface);
      }
      .section-sub {
        font-size: 1rem;
        color: var(--color-text-secondary);
        margin: var(--space-2) 0 var(--space-10);
        max-width: 560px;
        line-height: 1.7;
      }
      .nownext-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-6);
        margin-top: var(--space-8);
      }
      .nownext-card {
        padding: var(--space-8);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg);
      }
      .nownext-label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin: 0 0 var(--space-4);
      }
      .nownext-text {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
        line-height: 1.7;
        margin: 0;
      }

      /* Skills */
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-8);
        margin-top: var(--space-4);
      }
      .skill-group {
        padding: var(--space-6);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
      }
      .skill-group-title {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-size: 0.875rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-text);
        margin: 0 0 var(--space-5);
      }
      .skill-group-icon {
        font-size: 1rem;
      }
      .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      /* Education */
      .edu-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        margin-top: var(--space-8);
      }
      .edu-item {
        padding: var(--space-6);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg);
      }
      .edu-degree {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 var(--space-2);
      }
      .edu-institution {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
        margin: 0 0 var(--space-1);
      }
      .edu-loc {
        font-size: 0.8125rem;
        color: var(--color-text-tertiary);
        margin: 0;
      }

      /* Interests */
      .interests-section {
        padding-bottom: var(--space-20);
      }
      .interests-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        margin-top: var(--space-8);
      }
      .interest-tag {
        padding: var(--space-2) var(--space-5);
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        color: var(--color-text-secondary);
        background: var(--color-surface);
        transition: all var(--transition-fast);
        &:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-subtle);
        }
      }

      /* Brutalist variant */
      :host-context([data-variant="brutalist"]) .about-photo,
      :host-context([data-variant="brutalist"]) .nownext-card,
      :host-context([data-variant="brutalist"]) .skill-group,
      :host-context([data-variant="brutalist"]) .edu-item {
        border-radius: 0;
        border: 2px solid var(--color-text);
      }

      @media (max-width: 960px) {
        .about-grid {
          grid-template-columns: 1fr;
        }
        .about-photo-col {
          max-width: 320px;
        }
      }
      @media (max-width: 640px) {
        .nownext-grid {
          grid-template-columns: 1fr;
        }
        .about-actions {
          flex-direction: column;
          a {
            text-align: center;
          }
        }
      }
    `,
  ],
})
export class AboutComponent {
  readonly name = PROFILE.name;
  readonly headline = PROFILE.headline;
  readonly summary = PROFILE.summary;
  readonly cvUrl = PROFILE.cvUrl;
  readonly headshot = PROFILE.headshot;
  readonly nowNext = PROFILE.nowNext;
  readonly skillGroups = PROFILE.skillGroups;
  readonly education = PROFILE.education;
  readonly interests = PROFILE.interests;

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      frontend: "⬡",
      backend: "⚙",
      database: "▤",
      devops: "⬆",
      testing: "✓",
      tools: "◈",
      platforms: "☁",
      security: "⚑",
      performance: "⚡",
      languages: "{ }",
    };
    return icons[category] ?? "·";
  }
}
