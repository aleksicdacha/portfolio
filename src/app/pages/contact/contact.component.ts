import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ClipboardService } from "../../core/services/clipboard.service";
import { PROFILE } from "../../data/profile";

@Component({
  selector: "app-contact",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-contact">
      <!-- Header -->
      <section class="contact-hero section">
        <div class="container">
          <p class="page-eyebrow">Get In Touch</p>
          <h1 class="contact-title">Let's Work Together</h1>
          <p class="contact-lead">
            I'm open to new opportunities, interesting projects, and
            collaborations. Drop me a message and I'll get back to you.
          </p>
        </div>
      </section>

      <!-- Contact Cards -->
      <section class="section-sm contact-body">
        <div class="container contact-grid">
          <!-- Primary CTA: Email -->
          <div class="contact-primary" aria-label="Email contact">
            <h2 class="contact-card-title">Email Me</h2>
            <p class="contact-card-desc">
              The best way to reach me. I typically respond within 24 hours.
            </p>
            <div class="email-actions">
              <a
                class="btn-primary btn-lg"
                [href]="mailtoLink"
                [attr.aria-label]="'Send email to ' + email"
              >
                Send Email →
              </a>
              <button
                class="btn-copy"
                (click)="copyEmail()"
                [class.copied]="clipboard.copied()"
                [attr.aria-label]="
                  clipboard.copied() ? 'Email copied!' : 'Copy email address'
                "
                [attr.title]="
                  clipboard.copied() ? 'Copied!' : 'Copy to clipboard'
                "
              >
                @if (clipboard.copied()) {
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                } @else {
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path
                      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                    />
                  </svg>
                  {{ email }}
                }
              </button>
            </div>
          </div>

          <!-- Social Links -->
          <div class="contact-social" aria-label="Social links">
            <h2 class="contact-card-title">Find Me Online</h2>
            <ul class="social-list" role="list">
              @for (link of socialLinks; track link.url) {
                <li>
                  <a
                    class="social-item"
                    [href]="link.url"
                    [target]="link.icon === 'email' ? '_self' : '_blank'"
                    [rel]="
                      link.icon !== 'email' ? 'noopener noreferrer' : undefined
                    "
                    [attr.aria-label]="link.label"
                  >
                    <span class="social-icon" aria-hidden="true">
                      @switch (link.icon) {
                        @case ("linkedin") {
                          🔗
                        }
                        @case ("github") {
                          ⬡
                        }
                        @case ("email") {
                          ✉
                        }
                        @default {
                          ↗
                        }
                      }
                    </span>
                    <span class="social-label">{{ link.label }}</span>
                    <span class="social-arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Location / Availability -->
          <div class="contact-info" aria-label="Location and availability">
            <h2 class="contact-card-title">Location & Availability</h2>
            <dl class="info-dl">
              <div>
                <dt>Location</dt>
                <dd>{{ location }}</dd>
              </div>
              <div>
                <dt>Timezone</dt>
                <dd>{{ timezone }}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd class="status-available">
                  <span class="status-dot" aria-hidden="true"></span>
                  Open to opportunities
                </dd>
              </div>
              <div>
                <dt>Preferred Contact</dt>
                <dd>Email or LinkedIn</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- Simple contact form (mailto-based) -->
      <section
        class="section-sm contact-form-section"
        aria-labelledby="form-title"
      >
        <div class="container form-container">
          <h2 class="section-title" id="form-title">Send a Message</h2>
          <p class="form-note">
            This form opens your email client with a pre-filled message — no
            server involved.
          </p>
          <form
            class="contact-form"
            (submit)="sendForm($event)"
            novalidate
            aria-label="Contact form"
          >
            <div class="form-row">
              <div class="form-field">
                <label for="cf-name">Your Name</label>
                <input
                  id="cf-name"
                  type="text"
                  [(value)]="formName"
                  (input)="formName = getInputValue($event)"
                  placeholder="Jane Doe"
                  autocomplete="name"
                  required
                />
              </div>
              <div class="form-field">
                <label for="cf-email">Your Email</label>
                <input
                  id="cf-email"
                  type="email"
                  [(value)]="formEmail"
                  (input)="formEmail = getInputValue($event)"
                  placeholder="jane@example.com"
                  autocomplete="email"
                  required
                />
              </div>
            </div>
            <div class="form-field">
              <label for="cf-subject">Subject</label>
              <input
                id="cf-subject"
                type="text"
                [(value)]="formSubject"
                (input)="formSubject = getInputValue($event)"
                placeholder="Project inquiry / Collaboration / …"
                required
              />
            </div>
            <div class="form-field">
              <label for="cf-message">Message</label>
              <textarea
                id="cf-message"
                rows="6"
                [(value)]="formMessage"
                (input)="formMessage = getInputValue($event)"
                placeholder="Tell me about your project or opportunity…"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn-primary btn-lg">
              Open In Email Client →
            </button>
          </form>
        </div>
      </section>
    </div>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly clipboard = inject(ClipboardService);

  readonly email = PROFILE.email;
  readonly location = PROFILE.location;
  readonly timezone = PROFILE.timezone;
  readonly socialLinks = PROFILE.socialLinks;

  get mailtoLink(): string {
    return `mailto:${this.email}?subject=Hello Dalibor&body=Hi Dalibor,%0A%0A`;
  }

  // Form state
  formName = "";
  formEmail = "";
  formSubject = "";
  formMessage = "";

  copyEmail(): void {
    this.clipboard.copy(this.email);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  sendForm(event: Event): void {
    event.preventDefault();
    const subject = encodeURIComponent(
      this.formSubject || "Hello from portfolio",
    );
    const body = encodeURIComponent(
      `Hi Dalibor,\n\nMy name is ${this.formName} (${this.formEmail}).\n\n${this.formMessage}\n\nBest regards,\n${this.formName}`,
    );
    window.location.href = `mailto:${this.email}?subject=${subject}&body=${body}`;
  }
}
