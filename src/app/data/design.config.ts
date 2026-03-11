// ─────────────────────────────────────────────────────────────────────
//  DESIGN CONFIG – switch variants here, or expose via ThemeService
// ─────────────────────────────────────────────────────────────────────

export type DesignVariant = "editorial" | "brutalist";

export interface DesignConfig {
  variant: DesignVariant;
  accentColor: string;
  fontBody: string;
  fontDisplay: string;
}

/** Variant A: Editorial Minimal (default) */
export const EDITORIAL: DesignConfig = {
  variant: "editorial",
  accentColor: "#0057FF",
  fontBody: "'Inter', sans-serif",
  fontDisplay: "'Fraunces', serif",
};

/** Variant B: Soft Brutalist */
export const BRUTALIST: DesignConfig = {
  variant: "brutalist",
  accentColor: "#FF3B00",
  fontBody: "'Inter', sans-serif",
  fontDisplay: "'Inter', sans-serif",
};

/** Active config – change to BRUTALIST to switch variants */
export const ACTIVE_DESIGN: DesignConfig = EDITORIAL;
