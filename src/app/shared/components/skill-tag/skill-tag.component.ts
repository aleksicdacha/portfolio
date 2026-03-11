import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TechCategory } from "../../../data/profile.model";

@Component({
  selector: "app-skill-tag",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="skill-tag" [attr.data-cat]="category">{{
    label
  }}</span>`,
  styleUrl: './skill-tag.component.scss',
})
export class SkillTagComponent {
  @Input({ required: true }) label!: string;
  @Input() category: TechCategory | string = "tools";
}
