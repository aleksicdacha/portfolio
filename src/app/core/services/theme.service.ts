import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ACTIVE_DESIGN, EDITORIAL, BRUTALIST, DesignConfig } from '../../data/design.config';

export type ThemeMode = 'light' | 'dark';
export type DesignVariant = 'editorial' | 'brutalist';

const THEME_KEY = 'portfolio-theme';
const VARIANT_KEY = 'portfolio-variant';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc: Document = inject(DOCUMENT);

  // ── Signals ───────────────────────────────────────────────────────────────
  readonly mode = signal<ThemeMode>('light');
  readonly variant = signal<DesignVariant>('editorial');

  readonly isDark = computed(() => this.mode() === 'dark');

  // ── Init ──────────────────────────────────────────────────────────────────
  init(): void {
    const savedMode = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    const savedVariant = localStorage.getItem(VARIANT_KEY) as DesignVariant | null;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode: ThemeMode = savedMode ?? (prefersDark ? 'dark' : 'light');
    const initialVariant: DesignVariant = savedVariant ?? ACTIVE_DESIGN.variant;

    this.applyMode(initialMode);
    this.applyVariant(initialVariant);

    // Respond to system preference changes (only when no saved preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        this.applyMode(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  toggleMode(): void {
    this.applyMode(this.mode() === 'light' ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, this.mode());
  }

  setMode(mode: ThemeMode): void {
    this.applyMode(mode);
    localStorage.setItem(THEME_KEY, mode);
  }

  setVariant(variant: DesignVariant): void {
    this.applyVariant(variant);
    localStorage.setItem(VARIANT_KEY, variant);
  }

  toggleVariant(): void {
    this.setVariant(this.variant() === 'editorial' ? 'brutalist' : 'editorial');
  }

  // ── Private ───────────────────────────────────────────────────────────────
  private applyMode(mode: ThemeMode): void {
    this.mode.set(mode);
    const root = this.doc.documentElement;
    root.setAttribute('data-theme', mode);
    // Update meta theme-color dynamically
    const meta = this.doc.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'dark' ? '#0A0A0A' : '#FAFAFA');
    }
  }

  private applyVariant(variant: DesignVariant): void {
    this.variant.set(variant);
    const root = this.doc.documentElement;
    root.setAttribute('data-variant', variant);

    // Apply font CSS variables from the matching design config
    const config: DesignConfig = variant === 'brutalist' ? BRUTALIST : EDITORIAL;
    root.style.setProperty('--font-body', config.fontBody);
    root.style.setProperty('--font-display', config.fontDisplay);

    // Rebuild accent HSL shades from the hex accent color
    this.applyAccentShades(root, config.accentColor);
  }

  private applyAccentShades(root: HTMLElement, hex: string): void {
    // Convert hex → HSL and write the three accent component vars
    const [h, s, l] = this.hexToHsl(hex);
    root.style.setProperty('--accent-h', String(Math.round(h)));
    root.style.setProperty('--accent-s', `${Math.round(s)}%`);
    root.style.setProperty('--accent-l', `${Math.round(l)}%`);
  }

  private hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l * 100];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
    return [h * 360, s * 100, l * 100];
  }
}
