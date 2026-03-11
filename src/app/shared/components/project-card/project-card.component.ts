import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Project } from "../../../data/profile.model";
import { SkillTagComponent } from "../skill-tag/skill-tag.component";

@Component({
  selector: "app-project-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SkillTagComponent],
  template: `
    <article class="project-card" [class.featured]="project.featured">
      <!-- Image -->
      <a
        class="card-image-link"
        [routerLink]="['/projects', project.slug]"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="card-image">
          @if (project.imageUrl) {
            <img
              [src]="project.imageUrl"
              [alt]="project.title + ' screenshot'"
              loading="lazy"
              decoding="async"
              width="600"
              height="360"
            />
          } @else {
            <div class="card-placeholder" aria-hidden="true">
              <span class="placeholder-label">{{ project.year }}</span>
            </div>
          }
        </div>
      </a>

      <!-- Content -->
      <div class="card-body">
        <div class="card-meta">
          <span class="card-year">{{ project.year }}</span>
          @if (project.company) {
            <span class="card-company">{{ project.company }}</span>
          }
        </div>

        <h3 class="card-title">
          <a [routerLink]="['/projects', project.slug]">{{ project.title }}</a>
        </h3>

        <p class="card-desc">{{ project.description }}</p>

        <div class="card-tech">
          @for (tag of project.tech.slice(0, 5); track tag) {
            <app-skill-tag [label]="tag" />
          }
          @if (project.tech.length > 5) {
            <span class="more-tags">+{{ project.tech.length - 5 }}</span>
          }
        </div>

        <div class="card-actions">
          <a
            [routerLink]="['/projects', project.slug]"
            class="card-link-primary"
          >
            View details →
          </a>
          @if (project.liveUrl) {
            <a
              [href]="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="card-link-secondary"
              [attr.aria-label]="'Live site for ' + project.title"
            >
              Live ↗
            </a>
          }
          @if (project.repoUrl) {
            <a
              [href]="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="card-link-secondary"
              [attr.aria-label]="'Repository for ' + project.title"
            >
              Repo ↗
            </a>
          }
        </div>
      </div>
    </article>
  `,
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
