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
        <a class="nav-logo" routerLink="/" aria-label="Cod-a – Home">
          <svg
            class="logo-icon"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M14 4l-4 16" />
            <path d="M9 8l-4 4 4 4" />
            <path d="M15 8l4 4-4 4" />
          </svg>
          <span class="logo-name">Cod-a</span>
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
  styleUrl: './nav.component.scss',
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
