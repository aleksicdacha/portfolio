import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SkillTagComponent } from '../../../shared/components/skill-tag/skill-tag.component';
import { PROFILE } from '../../../data/profile';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SkillTagComponent],
  template: `
    @if (project()) {
      <div class="project-detail">
        <!-- Back -->
        <div class="container back-bar">
          <a class="back-link" routerLink="/projects">← Back to Projects</a>
        </div>

        <!-- Header -->
        <header class="project-header section-sm">
          <div class="container project-header-inner">
            <div>
              <div class="project-meta">
                <span>{{ project()!.year }}</span>
                @if (project()!.company) {
                  <span>{{ project()!.company }}</span>
                }
                <span>{{ project()!.role }}</span>
              </div>
              <h1 class="project-name">{{ project()!.title }}</h1>
              <p class="project-desc">{{ project()!.longDescription || project()!.description }}</p>
              <div class="project-actions">
                @if (project()!.liveUrl) {
                  <a class="btn-primary" [href]="project()!.liveUrl" target="_blank" rel="noopener noreferrer">
                    View Live ↗
                  </a>
                }
                @if (project()!.repoUrl) {
                  <a class="btn-outline" [href]="project()!.repoUrl" target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                }
              </div>
            </div>
          </div>
        </header>

        <!-- Image -->
        <div class="container project-image-wrap">
          @if (project()!.imageUrl) {
            <img
              [src]="project()!.imageUrl"
              [alt]="project()!.title + ' screenshot'"
              class="project-image"
              loading="eager"
              decoding="async"
              width="1200"
              height="675"
            />
          } @else {
            <div class="project-image-placeholder" aria-hidden="true">
              <!-- TODO: replace with actual project screenshot -->
              <span>{{ project()!.title }}</span>
              <small>Screenshot coming soon</small>
            </div>
          }
        </div>

        <!-- Tech Stack -->
        <section class="container project-tech section-sm" aria-label="Technology stack">
          <h2 class="section-label">Tech Stack</h2>
          <div class="tech-list">
            @for (tag of project()!.tech; track tag) {
              <app-skill-tag [label]="tag" />
            }
          </div>
        </section>

        <!-- Navigation between projects -->
        <nav class="container project-nav section-sm" aria-label="Project navigation">
          @if (prevProject()) {
            <a class="project-nav-link prev" [routerLink]="['/projects', prevProject()!.slug]">
              ← {{ prevProject()!.title }}
            </a>
          } @else {
            <span></span>
          }
          @if (nextProject()) {
            <a class="project-nav-link next" [routerLink]="['/projects', nextProject()!.slug]">
              {{ nextProject()!.title }} →
            </a>
          }
        </nav>
      </div>
    } @else {
      <div class="container not-found-inline section">
        <h1>Project Not Found</h1>
        <a class="btn-primary" routerLink="/projects">View All Projects</a>
      </div>
    }
  `,
  styles: [`
    .back-bar { padding-top: var(--space-8); }
    .back-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-decoration: none;
      &:hover { color: var(--color-accent); }
      &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
    }
    .project-header { padding: var(--space-8) 0 var(--space-10); }
    .project-header-inner { max-width: 760px; }
    .project-meta {
      display: flex;
      gap: var(--space-3);
      font-size: 0.75rem;
      color: var(--color-text-tertiary);
      margin-bottom: var(--space-4);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
      span + span::before { content: '·'; margin-right: var(--space-3); }
    }
    .project-name {
      font-family: var(--font-display);
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin: 0 0 var(--space-6);
    }
    .project-desc {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      max-width: 640px;
      margin: 0 0 var(--space-8);
    }
    .project-actions { display: flex; gap: var(--space-4); flex-wrap: wrap; }

    .project-image-wrap { margin-bottom: var(--space-10); }
    .project-image {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }
    .project-image-placeholder {
      width: 100%;
      aspect-ratio: 16/9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--color-surface);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-md);
      gap: var(--space-3);
      span {
        font-family: var(--font-display);
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-text-tertiary);
      }
      small { font-size: 0.875rem; color: var(--color-text-tertiary); }
    }

    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-tertiary);
      margin-bottom: var(--space-4);
    }
    .tech-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }

    .project-nav {
      display: flex;
      justify-content: space-between;
      padding-top: var(--space-8);
      padding-bottom: var(--space-16);
      border-top: 1px solid var(--color-border);
    }
    .project-nav-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-decoration: none;
      &:hover { color: var(--color-accent); }
      &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      &.next { margin-left: auto; }
    }

    .not-found-inline {
      padding: var(--space-20) 0;
      h1 { margin-bottom: var(--space-8); }
    }

    :host-context([data-variant="brutalist"]) .project-image,
    :host-context([data-variant="brutalist"]) .project-image-placeholder {
      border-radius: 0;
      border: 2px solid var(--color-text);
    }
  `],
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);

  readonly projects = PROFILE.projects;

  readonly slug = computed(() => this.route.snapshot.paramMap.get('slug') ?? '');
  readonly project = computed(() => this.projects.find(p => p.slug === this.slug()) ?? null);
  readonly currentIndex = computed(() => this.projects.findIndex(p => p.slug === this.slug()));
  readonly prevProject = computed(() => this.currentIndex() > 0 ? this.projects[this.currentIndex() - 1] : null);
  readonly nextProject = computed(() => this.currentIndex() < this.projects.length - 1 ? this.projects[this.currentIndex() + 1] : null);
}
