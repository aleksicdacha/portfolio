import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SeoService } from "./core/services/seo.service";
import { ThemeService } from "./core/services/theme.service";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { NavComponent } from "./shared/components/nav/nav.component";

@Component({
  selector: "app-root",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <app-nav />
    <main id="main-content" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
      }
      main {
        flex: 1;
        outline: none;
      }
      .skip-link {
        position: absolute;
        top: -100%;
        left: var(--space-4);
        z-index: 9999;
        padding: var(--space-2) var(--space-4);
        background: var(--color-accent);
        color: #fff;
        font-weight: 600;
        font-size: 0.875rem;
        border-radius: var(--radius-sm);
        text-decoration: none;
        transition: top 0.1s;
        &:focus {
          top: var(--space-4);
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.themeService.init();
    this.seoService.init();
  }
}
