import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PROFILE } from "../../data/profile";
import { Project } from "../../data/profile.model";
import { ProjectCardComponent } from "../../shared/components/project-card/project-card.component";

@Component({
  selector: "app-projects",
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
          <p class="page-lead">
            A selection of platforms, tools, and applications built over 20+
            years across diverse industries.
          </p>
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
              <button
                class="search-clear"
                (click)="searchQuery.set('')"
                aria-label="Clear search"
              >
                ×
              </button>
            }
          </div>

          <!-- Tag Filters -->
          <div
            class="tag-filters"
            role="group"
            aria-label="Filter by technology"
          >
            <button
              class="filter-btn"
              [class.active]="activeTag() === 'all'"
              (click)="activeTag.set('all')"
            >
              All
            </button>
            @for (tag of availableTags; track tag) {
              <button
                class="filter-btn"
                [class.active]="activeTag() === tag"
                (click)="activeTag.set(tag)"
              >
                {{ tag }}
              </button>
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
              <p>
                No projects found for "<strong>{{
                  searchQuery() || activeTag()
                }}</strong
                >"
              </p>
              <button class="btn-outline" (click)="resetFilters()">
                Reset filters
              </button>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  readonly allProjects: Project[] = PROFILE.projects;

  readonly availableTags = [
    "frontend",
    "backend",
    "fullstack",
    "angular",
    "ai",
    "mobile",
    "enterprise",
    "sports",
    "php",
  ];

  searchQuery = signal("");
  activeTag = signal<string>("all");

  readonly filteredProjects = computed<Project[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tag = this.activeTag();

    return this.allProjects.filter((p) => {
      const matchesTag = tag === "all" || p.tags.includes(tag);
      const matchesSearch =
        !q ||
        [p.title, p.description, ...p.tech, ...p.tags, p.company ?? ""].some(
          (field) => field.toLowerCase().includes(q),
        );
      return matchesTag && matchesSearch;
    });
  });

  resetFilters(): void {
    this.searchQuery.set("");
    this.activeTag.set("all");
  }
}
