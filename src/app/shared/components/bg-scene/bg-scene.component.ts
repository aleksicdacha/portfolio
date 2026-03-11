import { isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from "@angular/core";

@Component({
  selector: "app-bg-scene",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-scene" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>
      <div class="noise"></div>
    </div>
  `,
  styleUrl: './bg-scene.component.scss',
})
export class BgSceneComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  private scrollHandler?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    this.initParallax();
  }

  ngOnDestroy(): void {
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
    }
  }

  private initParallax(): void {
    const orbs = this.el.nativeElement.querySelectorAll(
      ".orb",
    ) as NodeListOf<HTMLElement>;
    // Different scroll multipliers per orb → depth illusion
    const speeds = [0.045, -0.065, 0.03, -0.055];
    let ticking = false;

    this.scrollHandler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          orb.style.setProperty("--py", `${(y * speeds[i]).toFixed(2)}px`);
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }
}
