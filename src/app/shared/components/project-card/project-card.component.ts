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
  styles: [
    `
      .project-card {
        display: flex;
        flex-direction: column;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        transition:
          transform var(--transition),
          box-shadow var(--transition),
          border-color var(--transition);
        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-accent);
        }
      }
      .card-image-link {
        display: block;
      }
      .card-image {
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: var(--color-surface-2);
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.4s ease;
        }
      }
      .project-card:hover .card-image img {
        transform: scale(1.03);
      }
      .card-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          var(--color-surface-2),
          var(--color-surface)
        );
      }
      .placeholder-label {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 700;
        color: var(--color-border);
        opacity: 0.5;
      }
      .card-body {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        flex: 1;
      }
      .card-meta {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
      }
      .card-company::before {
        content: "·";
        margin-right: var(--space-2);
      }
      .card-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
        a {
          color: var(--color-text);
          text-decoration: none;
          &:hover {
            color: var(--color-accent);
          }
          &:focus-visible {
            outline: 2px solid var(--color-accent);
            outline-offset: 2px;
          }
        }
      }
      .card-desc {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin: 0;
      }
      .card-tech {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-top: auto;
        padding-top: var(--space-2);
      }
      .more-tags {
        display: inline-flex;
        align-items: center;
        padding: var(--space-1) var(--space-3);
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
      }
      .card-actions {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding-top: var(--space-4);
        border-top: 1px solid var(--color-border);
        margin-top: var(--space-2);
      }
      .card-link-primary {
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
      .card-link-secondary {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
        text-decoration: none;
        &:hover {
          color: var(--color-text);
        }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }

      /* Brutalist variant */
      :host-context([data-variant="brutalist"]) .project-card {
        border-radius: 0;
        border: 2px solid var(--color-text);
        &:hover {
          transform: translate(-3px, -3px);
          box-shadow: 6px 6px 0 var(--color-text);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .project-card {
          transition: none;
        }
        .project-card:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
