import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { PROFILE } from "../../../data/profile";
import { SkillTagComponent } from "../../../shared/components/skill-tag/skill-tag.component";

@Component({
  selector: "app-project-detail",
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
              <p class="project-desc">
                {{ project()!.longDescription || project()!.description }}
              </p>
              <div class="project-actions">
                @if (project()!.liveUrl) {
                  <a
                    class="btn-primary"
                    [href]="project()!.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Live ↗
                  </a>
                }
                @if (project()!.repoUrl) {
                  <a
                    class="btn-outline"
                    [href]="project()!.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
        <section
          class="container project-tech section-sm"
          aria-label="Technology stack"
        >
          <h2 class="section-label">Tech Stack</h2>
          <div class="tech-list">
            @for (tag of project()!.tech; track tag) {
              <app-skill-tag [label]="tag" />
            }
          </div>
        </section>

        <!-- Navigation between projects -->
        <nav
          class="container project-nav section-sm"
          aria-label="Project navigation"
        >
          @if (prevProject()) {
            <a
              class="project-nav-link prev"
              [routerLink]="['/projects', prevProject()!.slug]"
            >
              ← {{ prevProject()!.title }}
            </a>
          } @else {
            <span></span>
          }
          @if (nextProject()) {
            <a
              class="project-nav-link next"
              [routerLink]="['/projects', nextProject()!.slug]"
            >
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
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);

  readonly projects = PROFILE.projects;

  readonly slug = computed(
    () => this.route.snapshot.paramMap.get("slug") ?? "",
  );
  readonly project = computed(
    () => this.projects.find((p) => p.slug === this.slug()) ?? null,
  );
  readonly currentIndex = computed(() =>
    this.projects.findIndex((p) => p.slug === this.slug()),
  );
  readonly prevProject = computed(() =>
    this.currentIndex() > 0 ? this.projects[this.currentIndex() - 1] : null,
  );
  readonly nextProject = computed(() =>
    this.currentIndex() < this.projects.length - 1
      ? this.projects[this.currentIndex() + 1]
      : null,
  );
}
