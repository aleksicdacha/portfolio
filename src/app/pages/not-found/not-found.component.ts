import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="container">
        <p class="not-found-code" aria-hidden="true">404</p>
        <h1 class="not-found-title">Page Not Found</h1>
        <p class="not-found-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="not-found-actions">
          <a class="btn-primary" routerLink="/">Go Home</a>
          <a class="btn-outline" routerLink="/projects">View Projects</a>
          <a class="btn-outline" routerLink="/contact">Get In Touch</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
