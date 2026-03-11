import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Dalibor Aleksic – Full-Stack Developer',
    data: {
      description: 'Experienced Full-Stack Developer with 20+ years of expertise in Angular, React, Node.js, PHP, and modern web technologies.',
      ogTitle: 'Dalibor Aleksic – Full-Stack Developer',
    },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
    title: 'Projects – Dalibor Aleksic',
    data: {
      description: 'Portfolio of projects built by Dalibor Aleksic – web apps, platforms, and tools across diverse industries.',
      ogTitle: 'Projects – Dalibor Aleksic',
    },
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    title: 'Project Detail – Dalibor Aleksic',
    data: { description: 'Project detail' },
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./pages/experience/experience.component').then(m => m.ExperienceComponent),
    title: 'Experience – Dalibor Aleksic',
    data: {
      description: '20+ years of full-stack development experience across Serbia, Denmark, and Switzerland.',
      ogTitle: 'Experience – Dalibor Aleksic',
    },
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About – Dalibor Aleksic',
    data: {
      description: 'About Dalibor Aleksic – Full-Stack Developer based in Nis, Serbia.',
      ogTitle: 'About – Dalibor Aleksic',
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact – Dalibor Aleksic',
    data: {
      description: 'Get in touch with Dalibor Aleksic.',
      ogTitle: 'Contact – Dalibor Aleksic',
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 – Page Not Found',
    data: { description: 'Page not found' },
  },
];
