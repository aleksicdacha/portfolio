import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
    title: "Dalibor Aleksic – Senior Full-Stack & AI Engineer",
    data: {
      description:
        "Senior Full-Stack & AI Engineer with 20+ years building scalable web platforms in TypeScript, Node.js/NestJS, Angular, React and PostgreSQL — now focused on agentic AI and LLM integration.",
      ogTitle: "Dalibor Aleksic – Senior Full-Stack & AI Engineer",
    },
  },
  {
    path: "projects",
    loadComponent: () =>
      import("./pages/projects/projects.component").then(
        (m) => m.ProjectsComponent,
      ),
    title: "Projects – Dalibor Aleksic",
    data: {
      description:
        "Portfolio of Dalibor Aleksic – full-stack platforms, AI-powered tools, and web applications across sports media, healthcare, telecom, and real estate.",
      ogTitle: "Projects – Dalibor Aleksic",
    },
  },
  {
    path: "projects/:slug",
    loadComponent: () =>
      import("./pages/projects/project-detail/project-detail.component").then(
        (m) => m.ProjectDetailComponent,
      ),
    title: "Project Detail – Dalibor Aleksic",
    data: { description: "Project detail" },
  },
  {
    path: "experience",
    loadComponent: () =>
      import("./pages/experience/experience.component").then(
        (m) => m.ExperienceComponent,
      ),
    title: "Experience – Dalibor Aleksic",
    data: {
      description:
        "20+ years of full-stack engineering across Serbia, Denmark, Switzerland and the US — from telecom and sports media to agentic AI.",
      ogTitle: "Experience – Dalibor Aleksic",
    },
  },
  {
    path: "about",
    loadComponent: () =>
      import("./pages/about/about.component").then((m) => m.AboutComponent),
    title: "About – Dalibor Aleksic",
    data: {
      description:
        "About Dalibor Aleksic – Senior Full-Stack & AI Engineer based in Nis, Serbia.",
      ogTitle: "About – Dalibor Aleksic",
    },
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./pages/contact/contact.component").then(
        (m) => m.ContactComponent,
      ),
    title: "Contact – Dalibor Aleksic",
    data: {
      description: "Get in touch with Dalibor Aleksic.",
      ogTitle: "Contact – Dalibor Aleksic",
    },
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/not-found/not-found.component").then(
        (m) => m.NotFoundComponent,
      ),
    title: "404 – Page Not Found",
    data: { description: "Page not found" },
  },
];
