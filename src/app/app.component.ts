import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SeoService } from "./core/services/seo.service";
import { ThemeService } from "./core/services/theme.service";
import { BgSceneComponent } from "./shared/components/bg-scene/bg-scene.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { NavComponent } from "./shared/components/nav/nav.component";

@Component({
  selector: "app-root",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavComponent, FooterComponent, BgSceneComponent],
  template: `
    <app-bg-scene />
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <app-nav />
    <main id="main-content" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.themeService.init();
    this.seoService.init();
  }
}
