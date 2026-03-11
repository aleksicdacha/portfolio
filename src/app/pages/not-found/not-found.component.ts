import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="container">
        <p class="not-found-code" aria-hidden="true">404</p>
        <h1 class="not-found-title">Page Not Found</h1>
        <p class="not-found-desc">The page you're looking for doesn't exist or has been moved.</p>
        <div class="not-found-actions">
          <a class="btn-primary" routerLink="/">Go Home</a>
          <a class="btn-outline" routerLink="/projects">View Projects</a>
          <a class="btn-outline" routerLink="/contact">Get In Touch</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100dvh - 128px);
      text-align: center;
      padding: var(--space-20) 0;
    }
    .not-found-code {
      font-family: var(--font-display);
      font-size: clamp(6rem, 20vw, 14rem);
      font-weight: 700;
      letter-spacing: -0.06em;
      line-height: 1;
      color: var(--color-border);
      margin: 0 0 var(--space-4);
      user-select: none;
    }
    .not-found-title {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      margin: 0 0 var(--space-4);
    }
    .not-found-desc {
      font-size: 1.0625rem;
      color: var(--color-text-secondary);
      margin: 0 0 var(--space-10);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    .not-found-actions {
      display: flex;
      justify-content: center;
      gap: var(--space-4);
      flex-wrap: wrap;
    }
  `],
})
export class NotFoundComponent {}
