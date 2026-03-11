import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class SeoService {
  private doc: Document = inject(DOCUMENT);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly baseTitle = "Dalibor Aleksic – Full-Stack Developer";
  readonly baseDescription =
    "Experienced Full-Stack Developer with 20+ years of expertise in Angular, React, Node.js, PHP, and modern web technologies.";
  readonly baseUrl = "https://aleksicdacha.dev";

  init(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        const title = data["title"] ?? this.baseTitle;
        const description = data["description"] ?? this.baseDescription;
        const ogTitle = data["ogTitle"] ?? title;
        this.updateMeta(title, description, ogTitle);
      });
  }

  updateMeta(title: string, description: string, ogTitle?: string): void {
    // Title
    this.doc.title = title;

    // Description
    this.setMetaTag("name", "description", description);

    // OG
    this.setMetaTag("property", "og:title", ogTitle ?? title);
    this.setMetaTag("property", "og:description", description);
    this.setMetaTag("property", "og:url", this.baseUrl + this.router.url);

    // Canonical
    this.setOrCreateCanonical(this.baseUrl + this.router.url);
  }

  private setMetaTag(
    attrName: string,
    attrValue: string,
    content: string,
  ): void {
    let el = this.doc.querySelector(
      `meta[${attrName}="${attrValue}"]`,
    ) as HTMLMetaElement | null;
    if (!el) {
      el = this.doc.createElement("meta");
      el.setAttribute(attrName, attrValue);
      this.doc.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  private setOrCreateCanonical(url: string): void {
    let el = this.doc.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement("link");
      el.setAttribute("rel", "canonical");
      this.doc.head.appendChild(el);
    }
    el.setAttribute("href", url);
  }
}
