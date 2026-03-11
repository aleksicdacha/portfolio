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
  styleUrl: './about.component.scss',
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
