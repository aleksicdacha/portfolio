import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { PROFILE } from "../../../data/profile";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";

interface NavItem {
  label: string;
  path: string;
  fragment?: string;
}

@Component({
  selector: "app-nav",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <header
      class="nav-header"
      [class.scrolled]="scrolled()"
      [class.menu-open]="menuOpen()"
    >
      <div class="nav-inner container">
        <!-- Logo -->
        <a class="nav-logo" routerLink="/" aria-label="Dalibor Aleksic – Home">
          <span class="logo-name">DA.</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-links" aria-label="Main navigation">
          @for (item of navItems; track item.path) {
            <a
              class="nav-link"
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/' }"
              >{{ item.label }}</a
            >
          }
        </nav>

        <!-- Actions -->
        <div class="nav-actions">
          <app-theme-toggle />
          <a
            class="btn-outline btn-sm"
            [href]="cvUrl"
            download
            aria-label="Download CV"
          >
            CV ↓
          </a>
          <!-- Hamburger -->
          <button
            class="hamburger"
            [class.active]="menuOpen()"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        id="mobile-menu"
        class="mobile-menu"
        [class.open]="menuOpen()"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav aria-label="Mobile navigation links">
          @for (item of navItems; track item.path) {
            <a
              class="mobile-link"
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/' }"
              (click)="closeMenu()"
              >{{ item.label }}</a
            >
          }
        </nav>
        <div class="mobile-actions">
          <a class="btn-primary" [href]="cvUrl" download>Download CV</a>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .nav-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--color-bg);
        border-bottom: 1px solid transparent;
        transition:
          border-color var(--transition),
          background var(--transition),
          box-shadow var(--transition);
      }
      .nav-header.scrolled {
        border-bottom-color: var(--color-border);
        box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
      }
      .nav-inner {
        display: flex;
        align-items: center;
        height: 64px;
        gap: var(--space-6);
      }
      .nav-logo {
        text-decoration: none;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .logo-name {
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text);
        letter-spacing: -0.02em;
        line-height: 1;
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        margin-left: auto;
      }
      .nav-link {
        padding: var(--space-2) var(--space-3);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        text-decoration: none;
        border-radius: var(--radius-sm);
        transition:
          color var(--transition-fast),
          background var(--transition-fast);
        &:hover {
          color: var(--color-text);
          background: var(--color-surface);
        }
        &.active {
          color: var(--color-accent);
        }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }
      .nav-actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        flex-shrink: 0;
      }
      .btn-outline {
        display: inline-flex;
        align-items: center;
        padding: var(--space-2) var(--space-4);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-text);
        text-decoration: none;
        letter-spacing: 0.02em;
        transition:
          border-color var(--transition-fast),
          background var(--transition-fast),
          color var(--transition-fast);
        &:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          background: var(--color-accent-subtle);
        }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }
      .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        padding: 4px;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: var(--radius-sm);
        span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--color-text);
          border-radius: 2px;
          transition:
            transform 0.25s,
            opacity 0.25s;
          transform-origin: center;
        }
        &.active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        &.active span:nth-child(2) {
          opacity: 0;
        }
        &.active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        &:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      }
      .mobile-menu {
        display: none;
        position: fixed;
        inset: 64px 0 0 0;
        background: var(--color-bg);
        padding: var(--space-8) var(--space-6);
        flex-direction: column;
        gap: var(--space-2);
        border-top: 1px solid var(--color-border);
        overflow-y: auto;
        nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
      }
      .mobile-menu.open {
        display: flex;
      }
      .mobile-link {
        display: block;
        padding: var(--space-4) var(--space-2);
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        text-decoration: none;
        border-bottom: 1px solid var(--color-border);
        transition: color var(--transition-fast);
        &.active {
          color: var(--color-accent);
        }
        &:hover {
          color: var(--color-text);
        }
      }
      .mobile-actions {
        margin-top: var(--space-6);
        .btn-primary {
          display: block;
          text-align: center;
          padding: var(--space-4);
          background: var(--color-accent);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: var(--radius-sm);
        }
      }

      /* Brutalist variant */
      :host-context([data-variant="brutalist"]) .nav-header {
        border-bottom: 2px solid var(--color-text);
      }
      :host-context([data-variant="brutalist"]) .logo-name {
        font-family: var(--font-body);
        font-weight: 700;
        letter-spacing: 0;
      }

      @media (max-width: 768px) {
        .nav-links {
          display: none;
        }
        .btn-outline.btn-sm {
          display: none;
        }
        .hamburger {
          display: flex;
        }
      }
    `,
  ],
})
export class NavComponent {
  private doc: Document = inject(DOCUMENT);
  private router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Experience", path: "/experience" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  readonly cvUrl = PROFILE.cvUrl;

  scrolled = signal(false);
  menuOpen = signal(false);

  constructor() {
    // Close menu on navigation
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  @HostListener("window:scroll")
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void {
    const isOpen = !this.menuOpen();
    this.menuOpen.set(isOpen);
    this.doc.body.style.overflow = isOpen ? "hidden" : "";
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.doc.body.style.overflow = "";
  }
}
