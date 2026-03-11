import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TechCategory } from '../../../data/profile.model';

@Component({
  selector: 'app-skill-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="skill-tag" [attr.data-cat]="category">{{ label }}</span>`,
  styles: [`
    .skill-tag {
      display: inline-flex;
      align-items: center;
      padding: var(--space-1) var(--space-3);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: var(--color-text-secondary);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      white-space: nowrap;
      transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
      &:hover {
        background: var(--color-accent-subtle);
        color: var(--color-accent);
        border-color: var(--color-accent);
      }
    }

    /* Brutalist variant */
    :host-context([data-variant="brutalist"]) .skill-tag {
      border-radius: 0;
      border-width: 1.5px;
      border-color: var(--color-text);
      font-weight: 600;
    }
  `],
})
export class SkillTagComponent {
  @Input({ required: true }) label!: string;
  @Input() category: TechCategory | string = 'tools';
}
