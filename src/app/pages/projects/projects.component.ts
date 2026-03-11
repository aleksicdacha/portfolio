import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { PROFILE } from '../../data/profile';
import { Project } from '../../data/profile.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ProjectCardComponent],
  template: `
    <div class="page-projects">
      <!-- Page Header -->
      <section class="page-hero section-sm">
        <div class="container">
          <p class="page-eyebrow">Work</p>
          <h1 class="page-title">Projects</h1>
          <p class="page-lead">A selection of platforms, tools, and applications built over 20+ years across diverse industries.</p>
        </div>
      </section>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="container filters-inner">
          <!-- Search -->
          <div class="search-wrap">
            <label class="sr-only" for="project-search">Search projects</label>
            <input
              id="project-search"
              type="search"
              class="search-input"
              placeholder="Search projects…"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              aria-label="Search projects"
            />
            @if (searchQuery()) {
              <button class="search-clear" (click)="searchQuery.set('')" aria-label="Clear search">×</button>
            }
          </div>

          <!-- Tag Filters -->
          <div class="tag-filters" role="group" aria-label="Filter by technology">
            <button
              class="filter-btn"
              [class.active]="activeTag() === 'all'"
              (click)="activeTag.set('all')"
            >All</button>
            @for (tag of availableTags; track tag) {
              <button
                class="filter-btn"
                [class.active]="activeTag() === tag"
                (click)="activeTag.set(tag)"
              >{{ tag }}</button>
            }
          </div>
        </div>
      </div>

      <!-- Grid -->
      <section class="projects-content section-sm">
        <div class="container">
          @if (filteredProjects().length > 0) {
            <div class="projects-grid">
              @for (project of filteredProjects(); track project.slug) {
                <app-project-card [project]="project" />
              }
            </div>
          } @else {
            <div class="no-results" role="status" aria-live="polite">
              <p>No projects found for "<strong>{{ searchQuery() || activeTag() }}</strong>"</p>
              <button class="btn-outline" (click)="resetFilters()">Reset filters</button>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-hero { padding: var(--space-16) 0 var(--space-10); }
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

    /* Filters */
    .filters-bar {
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      padding: var(--space-4) 0;
      background: var(--color-bg);
      position: sticky;
      top: 64px;
      z-index: 10;
    }
    .filters-inner {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
      align-items: center;
    }
    .search-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .search-input {
      padding: var(--space-2) var(--space-4);
      padding-right: var(--space-8);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: 0.875rem;
      width: 220px;
      outline: none;
      transition: border-color var(--transition-fast);
      &::placeholder { color: var(--color-text-tertiary); }
      &:focus { border-color: var(--color-accent); }
    }
    .search-clear {
      position: absolute;
      right: var(--space-2);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-tertiary);
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 2px;
      &:hover { color: var(--color-text); }
    }
    .tag-filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    .filter-btn {
      padding: var(--space-1) var(--space-4);
      font-size: 0.8125rem;
      font-weight: 500;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: var(--color-surface);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      &:hover { border-color: var(--color-accent); color: var(--color-accent); background: var(--color-accent-subtle); }
      &.active { background: var(--color-accent); color: white; border-color: var(--color-accent); }
      &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
    }

    /* Grid */
    .projects-content { padding: var(--space-12) 0 var(--space-20); }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--space-6);
    }

    /* No results */
    .no-results {
      text-align: center;
      padding: var(--space-20) 0;
      color: var(--color-text-secondary);
      p { margin-bottom: var(--space-6); font-size: 1.125rem; }
    }

    /* Brutalist variant */
    :host-context([data-variant="brutalist"]) .filter-btn.active {
      border-radius: 0;
      border: 2px solid var(--color-accent);
    }
    :host-context([data-variant="brutalist"]) .search-input { border-radius: 0; }

    @media (max-width: 640px) {
      .filters-inner { flex-direction: column; align-items: stretch; }
      .search-input { width: 100%; }
      .projects-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ProjectsComponent {
  readonly allProjects: Project[] = PROFILE.projects;

  readonly availableTags = [
    'frontend', 'backend', 'fullstack', 'angular', 'ai',
    'mobile', 'enterprise', 'sports', 'php',
  ];

  searchQuery = signal('');
  activeTag = signal<string>('all');

  readonly filteredProjects = computed<Project[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tag = this.activeTag();

    return this.allProjects.filter(p => {
      const matchesTag = tag === 'all' || p.tags.includes(tag);
      const matchesSearch = !q || [p.title, p.description, ...p.tech, ...p.tags, p.company ?? '']
        .some(field => field.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  });

  resetFilters(): void {
    this.searchQuery.set('');
    this.activeTag.set('all');
  }
}
