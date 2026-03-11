import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../../../data/profile';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <a class="footer-logo" routerLink="/" aria-label="Home">DA.</a>
          <p class="footer-tagline">{{ tagline }}</p>
        </div>

        <nav class="footer-nav" aria-label="Footer navigation">
          <a routerLink="/projects">Projects</a>
          <a routerLink="/experience">Experience</a>
          <a routerLink="/about">About</a>
          <a routerLink="/contact">Contact</a>
        </nav>

        <div class="footer-social">
          @for (link of socialLinks; track link.url) {
            <a
              [href]="link.url"
              class="social-link"
              [target]="link.icon === 'email' ? '_self' : '_blank'"
              [attr.rel]="link.icon !== 'email' ? 'noopener noreferrer' : null"
              [attr.aria-label]="link.label"
            >
              @switch (link.icon) {
                @case ('linkedin') {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                }
                @case ('github') {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                }
                @case ('email') {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                }
                @default {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                }
              }
              <span>{{ link.label }}</span>
            </a>
          }
        </div>
      </div>

      <div class="container footer-bottom">
        <span>© {{ year }} {{ name }}&nbsp;·&nbsp;{{ location }}&nbsp;·&nbsp;{{ timezone }}</span>
        <span class="footer-built">Built with Angular 19</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: auto;
      padding: var(--space-12) 0 var(--space-8);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }
    .footer-inner {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: var(--space-12);
      align-items: start;
      margin-bottom: var(--space-10);
    }
    .footer-logo {
      font-family: var(--font-display);
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-text);
      text-decoration: none;
      letter-spacing: -0.02em;
      display: block;
      margin-bottom: var(--space-3);
    }
    .footer-tagline {
      font-size: 0.875rem;
      color: var(--color-text-tertiary);
      max-width: 240px;
      line-height: 1.6;
    }
    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      a {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: color var(--transition-fast);
        &:hover { color: var(--color-accent); }
        &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      }
    }
    .footer-social {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .social-link {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
      &:hover { color: var(--color-accent); }
      &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      svg { flex-shrink: 0; }
    }
    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-6);
      border-top: 1px solid var(--color-border);
      font-size: 0.8125rem;
      color: var(--color-text-tertiary);
    }
    .footer-built { color: var(--color-text-tertiary); }

    /* Brutalist variant */
    :host-context([data-variant="brutalist"]) .footer {
      border-top: 2px solid var(--color-text);
    }

    @media (max-width: 768px) {
      .footer-inner {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-8);
      }
      .footer-brand { grid-column: 1 / -1; }
      .footer-bottom { flex-direction: column; gap: var(--space-2); text-align: center; }
    }
    @media (max-width: 480px) {
      .footer-inner { grid-template-columns: 1fr; }
      .footer-nav { flex-direction: row; flex-wrap: wrap; }
      .footer-social { flex-direction: row; flex-wrap: wrap; }
    }
  `],
})
export class FooterComponent {
  readonly name = PROFILE.name;
  readonly location = PROFILE.location;
  readonly timezone = PROFILE.timezone;
  readonly tagline = PROFILE.tagline;
  readonly socialLinks = PROFILE.socialLinks;
  readonly year = new Date().getFullYear();
}
