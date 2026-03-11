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
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  readonly experience: ExperienceItem[] = PROFILE.experience;
  readonly education = PROFILE.education;
}
