import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PROFILE } from "../../data/profile";
import { ExperienceItem } from "../../data/profile.model";
import { SkillTagComponent } from "../../shared/components/skill-tag/skill-tag.component";

@Component({
  selector: "app-experience",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkillTagComponent],
  template: `
    <div class="page-experience">
      <!-- Header -->
      <section class="page-hero section-sm">
        <div class="container">
          <p class="page-eyebrow">Background</p>
          <h1 class="page-title">Experience</h1>
          <p class="page-lead">
            Two decades of building for the web — from freelance projects in Nis
            to enterprise platforms in Switzerland and Denmark.
          </p>
        </div>
      </section>

      <!-- Timeline -->
      <section class="section" aria-label="Work experience timeline">
        <div class="container">
          <div class="timeline">
            @for (
              item of experience;
              track item.company + item.startDate;
              let i = $index
            ) {
              <article class="timeline-item" [class.first]="i === 0">
                <!-- Date range (left column) -->
                <aside class="timeline-dates" aria-label="Employment dates">
                  <span class="date-end">{{ item.endDate }}</span>
                  <span class="date-separator" aria-hidden="true">↓</span>
                  <span class="date-start">{{ item.startDate }}</span>
                </aside>

                <!-- Connector -->
                <div class="timeline-connector" aria-hidden="true">
                  <div
                    class="connector-dot"
                    [class.current]="item.endDate === 'Present'"
                  ></div>
                  <div class="connector-line"></div>
                </div>

                <!-- Content -->
                <div class="timeline-content">
                  <header class="timeline-header">
                    <h2 class="timeline-role">{{ item.role }}</h2>
                    <div class="timeline-company">
                      @if (item.companyUrl) {
                        <a
                          [href]="item.companyUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="company-link"
                        >
                          {{ item.company }}
                        </a>
                      } @else {
                        <span>{{ item.company }}</span>
                      }
                      <span class="company-location"
                        >· {{ item.location }}</span
                      >
                    </div>
                  </header>

                  @if (item.summary) {
                    <p class="timeline-summary">{{ item.summary }}</p>
                  }

                  <ul class="timeline-achievements">
                    @for (achievement of item.achievements; track achievement) {
                      <li>{{ achievement }}</li>
                    }
                  </ul>

                  <div class="timeline-tech">
                    @for (tag of item.tech; track tag) {
                      <app-skill-tag [label]="tag" />
                    }
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- Education -->
      <section class="section-alt section" aria-labelledby="edu-title">
        <div class="container">
          <h2 class="section-title" id="edu-title">Education</h2>
          <div class="edu-grid">
            @for (edu of education; track edu.institution) {
              <div class="edu-card">
                <p class="edu-degree">{{ edu.degree }} · {{ edu.field }}</p>
                <p class="edu-institution">{{ edu.institution }}</p>
                <p class="edu-years">{{ edu.years }}</p>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .page-hero {
        padding: var(--space-16) 0 var(--space-10);
      }
      .page-eyebrow {
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: var(--space-4);
      }
      .page-lead {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        max-width: 600px;
        line-height: 1.7;
        margin-top: var(--space-4);
      }

      /* Timeline */
      .timeline {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-bottom: var(--space-16);
      }
      .timeline-item {
        display: grid;
        grid-template-columns: 120px 40px 1fr;
        gap: 0 var(--space-6);
        position: relative;
        min-height: 160px;
      }
      .timeline-dates {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-top: 2px;
        gap: var(--space-2);
        padding-right: var(--space-2);
      }
      .date-end {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-text);
      }
      .date-start {
        font-size: 0.8125rem;
        color: var(--color-text-tertiary);
      }
      .date-separator {
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        line-height: 1;
      }

      /* Connector */
      .timeline-connector {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 4px;
      }
      .connector-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--color-border);
        background: var(--color-bg);
        flex-shrink: 0;
        transition: border-color var(--transition);
        &.current {
          border-color: var(--color-accent);
          background: var(--color-accent);
        }
      }
      .connector-line {
        flex: 1;
        width: 1px;
        background: var(--color-border);
        margin-top: var(--space-2);
      }
      .timeline-item:last-child .connector-line {
        display: none;
      }

      /* Content */
      .timeline-content {
        padding-bottom: var(--space-12);
      }
      .timeline-header {
        margin-bottom: var(--space-4);
      }
      .timeline-role {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text);
        margin: 0 0 var(--space-2);
      }
      .timeline-company {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      .company-link {
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
      .company-location {
        color: var(--color-text-tertiary);
      }
      .timeline-summary {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0 0 var(--space-4);
        font-style: italic;
      }
      .timeline-achievements {
        margin: 0 0 var(--space-5);
        padding-left: var(--space-5);
        li {
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-2);
          &::marker {
            color: var(--color-accent);
          }
        }
      }
      .timeline-tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      /* Education */
      .section-alt {
        background: var(--color-surface);
      }
      .edu-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-8);
      }
      .edu-card {
        padding: var(--space-6);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-bg);
      }
      .edu-degree {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 var(--space-2);
        color: var(--color-text);
      }
      .edu-institution {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
        margin: 0 0 var(--space-2);
      }
      .edu-years {
        font-size: 0.8125rem;
        color: var(--color-text-tertiary);
        margin: 0;
      }

      /* Brutalist variant */
      :host-context([data-variant="brutalist"]) .connector-dot {
        border-radius: 0;
      }
      :host-context([data-variant="brutalist"]) .edu-card {
        border-radius: 0;
        border: 2px solid var(--color-text);
      }

      @media (max-width: 768px) {
        .timeline-item {
          grid-template-columns: 80px 32px 1fr;
          gap: 0 var(--space-3);
        }
        .timeline-dates {
          font-size: 0.75rem;
        }
        .date-separator {
          display: none;
        }
      }
      @media (max-width: 520px) {
        .timeline-item {
          grid-template-columns: 1fr;
        }
        .timeline-dates {
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          padding: 0;
          gap: var(--space-3);
        }
        .timeline-connector {
          display: none;
        }
        .date-separator {
          display: inline;
        }
      }
    `,
  ],
})
export class ExperienceComponent {
  readonly experience: ExperienceItem[] = PROFILE.experience;
  readonly education = PROFILE.education;
}
