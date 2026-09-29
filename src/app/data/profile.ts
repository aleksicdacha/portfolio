// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH  –  update this file to update all portfolio content
//  Generated from CV + LinkedIn: https://www.linkedin.com/in/dalibor-aleksic
// ─────────────────────────────────────────────────────────────────────────────

import { Profile } from "./profile.model";

export const PROFILE: Profile = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: "Dalibor Aleksić",
  headline: "Senior Full-Stack & AI Engineer",
  tagline:
    "Building scalable web platforms and agentic AI systems — from architecture through production.",
  email: "aleksic.dacha@gmail.com",
  phone: "+381 (069) 2924776",
  location: "Nis, Serbia",
  timezone: "CET (UTC+1)",
  // The query busts caches holding an older immutable copy of the CV; netlify.toml
  // serves /assets/cv/* with must-revalidate, so no further bumps are needed.
  cvUrl: "/assets/cv/cv.pdf?v=2026-09",
  headshot: "/assets/images/me.png", // TODO: add URL e.g. '/assets/images/headshot.jpg'

  // ── Social Links ──────────────────────────────────────────────────────────
  socialLinks: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/dalibor-aleksic",
      icon: "linkedin",
    },
    {
      label: "GitHub",
      url: "https://github.com/aleksicdacha",
      icon: "github",
    },
    {
      label: "Email",
      url: "mailto:aleksic.dacha@gmail.com",
      icon: "email",
    },
  ],

  // ── Summary ───────────────────────────────────────────────────────────────
  summary: `Senior Full-Stack Engineer with 20+ years designing and delivering scalable web platforms across sports media, healthcare, telecom, loyalty, and real estate. Expert in TypeScript, Node.js/NestJS, Angular/React/Next.js and PostgreSQL, with hands-on cloud CI/CD and production ownership of high-traffic systems serving millions of users. Delivered agentic AI and LLM integrations in production, with a track record of measurable impact on performance, delivery speed, and reliability.`,

  // ── Quick Facts (shown in hero) ────────────────────────────────────────────
  quickFacts: [
    { label: "Location", value: "Nis, Serbia" },
    { label: "Experience", value: "20+ Years" },
    { label: "Stack", value: "TypeScript · Node/NestJS · Angular/React" },
    { label: "AI", value: "Agentic AI · LLM Orchestration" },
    { label: "Availability", value: "Open to opportunities" },
  ],

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      company: "Independent Consultant",
      location: "Nis, Serbia (Remote)",
      role: "Senior Software Engineer & Consultant",
      startDate: "September 2025",
      endDate: "Present",
      summary:
        "Independent full-stack and AI engineering consultancy, owning delivery from architecture to production.",
      achievements: [
        "Delivered a full-stack real estate platform end-to-end (NestJS + Next.js 15, Turborepo monorepo), owning architecture, API design, CI/CD, E2E testing, and production deployment.",
        "Shipped a multilingual Google Gemini AI chatbot, custom TypeORM repositories, JWT auth with RBAC, Redis caching, and a sanitised public API kept separate from the admin API.",
      ],
      tech: [
        "TypeScript",
        "NestJS",
        "Next.js 15",
        "PostgreSQL",
        "TypeORM",
        "Redis",
        "Docker",
        "Google Gemini",
        "Playwright",
        "Turborepo",
      ],
    },
    {
      company: "Union Studio",
      companyUrl: "https://www.olla.me/",
      location: "Serbia / United States (Remote)",
      role: "Senior Software Engineer",
      startDate: "April 2025",
      endDate: "August 2025",
      summary:
        "Frontend development for multiple health-support web and mobile applications.",
      achievements: [
        "Led frontend development for multiple health-support web and mobile applications (Android/iOS) using Angular v19+ and Ionic Framework.",
        "Delivered responsive, accessible cross-platform UI components, reducing reported UX issues by ~30% during QA cycles.",
        "Integrated Azure DevOps CI/CD pipelines (build, test, deploy), increasing release cadence.",
        "Applied SOLID principles and component-driven architecture across multiple product teams.",
      ],
      tech: [
        "Angular",
        "Ionic",
        "TypeScript",
        "Azure DevOps",
        "PostgreSQL",
        "React",
        "Node.js",
      ],
    },
    {
      company: "Better Collective",
      companyUrl: "https://www.bettercollective.com/",
      location: "Denmark (Remote)",
      role: "Senior Software Engineer",
      startDate: "November 2018",
      endDate: "November 2024",
      summary:
        "Delivered high-traffic sports media platforms and AI-powered editorial tooling for a global sports media group.",
      achievements: [
        "Designed and shipped AI-powered content generation tools using the CrewAI multi-agent framework and LLM APIs, cutting manual editorial workload by ~60% on target workflows.",
        "Full-stack revamp of Vegas Insider (vegasinsider.com), a top-tier US sports-betting platform with millions of monthly active users — owning the PHP/Symfony backend and the TypeScript Web Components frontend architecture.",
        "Architected back-end services in PHP (Symfony/Laravel) and Node.js for high-traffic sports media sites.",
        "Drove architectural and technical design decisions across a team of 8+ engineers; conducted code reviews and maintained engineering standards.",
        "Mentored 3+ junior developers and guided 2 internship programs to completion.",
        "Integrated GraphQL APIs and optimised complex PostgreSQL queries, improving performance up to 2x on data-intensive pages.",
        "Introduced automated testing (Jest, Playwright), reaching >80% coverage on critical user flows.",
      ],
      tech: [
        "Angular",
        "React",
        "TypeScript",
        "Node.js",
        "PHP",
        "Symfony",
        "Laravel",
        "Web Components",
        "Stencil",
        "PostgreSQL",
        "GraphQL",
        "CrewAI",
        "Python",
      ],
    },
    {
      company: "HORISEN AG",
      companyUrl: "https://www.horisen.com/",
      location: "Switzerland / Serbia",
      role: "Full-Stack Web Developer",
      startDate: "2015",
      endDate: "2018",
      summary:
        "Built enterprise platforms and white-label products for telecom and gaming clients across Europe.",
      achievements: [
        "Developed and maintained HORISEN-pro — a comprehensive enterprise messaging platform used by telecom and marketing clients across Europe.",
        "Built iCard loyalty program platform and an SMS newsletter marketing platform, serving thousands of end users.",
        "Developed security and account administration apps (front-end and back-end).",
        "Delivered Nestlé-Frisco VTool Marketing — an admin app for targeted promotional campaigns.",
        "Built white-label software and online gaming apps for clients including Orange.pl and Ringier Axel Springer.",
        "Implemented security hardening (XSS prevention, CSRF protection, secure session management) across front-end and back-end applications.",
      ],
      tech: ["PHP", "Zend Framework", "JavaScript", "AngularJS", "MySQL"],
    },
    {
      company: "Olymp Real-Estates",
      companyUrl: "https://www.olymp-nekretnine.co.rs",
      location: "Nis, Serbia",
      role: "Co-Founder & Full-Stack Web Developer",
      startDate: "2009",
      endDate: "2015",
      summary: "Co-founded and operated a real estate management web portal.",
      achievements: [
        "Co-founded and developed a full real estate management portal from the ground up.",
        "Handled deployment, maintenance, SEO, and digital marketing.",
        "Engaged in parallel freelance web development for local small businesses.",
      ],
      tech: ["PHP", "CodeIgniter", "Smarty", "MySQL", "HTML", "CSS"],
    },
    {
      company: "Pixel Graphics",
      companyUrl: undefined,
      location: "Nis, Serbia",
      role: "Owner & Web Developer",
      startDate: "2005",
      endDate: "2009",
      summary:
        "Ran a small web development, graphic design, and IT hardware business.",
      achievements: [
        "Managed end-to-end client relations; delivered web development, maintenance, and graphic design services.",
        "Provided hardware sales and IT support services.",
      ],
      tech: ["PHP", "HTML", "CSS", "Adobe Photoshop"],
    },
  ],

  // ── Projects ──────────────────────────────────────────────────────────────
  projects: [
    {
      slug: "real-estate-api-platform",
      title: "Real Estate API Platform",
      description:
        "Full-stack Turborepo monorepo: a NestJS REST API with Next.js 15 admin and public apps.",
      longDescription:
        "Production real estate platform delivered end to end — a NestJS REST API with custom TypeORM repositories, a multilingual Google Gemini AI chatbot with live agent handover, JWT auth with RBAC, and a sanitised public API kept separate from the admin API for security. Backed by Redis caching and shipped with Docker Compose, GitHub Actions CI/CD, and Playwright E2E coverage.",
      role: "Architect & Full-Stack Engineer",
      company: "Independent",
      liveUrl: undefined,
      repoUrl: undefined, // repo is private
      imageUrl: undefined, // TODO: add screenshot
      tech: [
        "TypeScript",
        "NestJS",
        "Next.js 15",
        "PostgreSQL",
        "TypeORM",
        "Redis",
        "Docker",
        "Google Gemini",
        "Playwright",
        "Turborepo",
      ],
      tags: ["fullstack", "backend", "ai", "real-estate", "typescript"],
      featured: true,
      year: 2026,
    },
    {
      slug: "olla-health",
      title: "Olla Health App",
      description:
        "Multi-platform health-support mobile and web application built with Angular and Ionic.",
      longDescription:
        "A suite of health-support services delivered as a cross-platform application targeting Android, iOS, and web. Built with Angular v19+ and Ionic Framework, integrated with Azure DevOps for CI/CD.",
      role: "Senior Software Engineer",
      company: "Union Studio",
      companyUrl: "https://www.olla.me/",
      liveUrl: "https://www.olla.me/",
      repoUrl: undefined,
      imageUrl: "/assets/images/projects/olla.png", // TODO: add screenshot
      tech: ["Angular", "Ionic", "TypeScript", "Azure DevOps", "PostgreSQL"],
      tags: ["mobile", "frontend", "health", "angular"],
      featured: true,
      year: 2025,
    },
    {
      slug: "vegas-insider",
      title: "Vegas Insider Revamp",
      description:
        "Front-end architecture overhaul of VegasInsider.com, a top-tier US sports-betting platform with millions of monthly active users.",
      longDescription:
        "Led the complete front-end architecture overhaul of VegasInsider.com — one of the most visited sports-betting platforms in the US, with millions of monthly active users. Implemented a modern Web Components (Stencil) architecture, coupled with a PHP backend rebuild, delivering improved performance and a drastically improved user experience.",
      role: "Senior Software Engineer",
      company: "Better Collective",
      companyUrl: "https://www.bettercollective.com/",
      liveUrl: "https://www.vegasinsider.com/",
      repoUrl: undefined,
      imageUrl: "/assets/images/projects/vegas.png", // TODO: add screenshot
      tech: ["Web Components", "Stencil", "TypeScript", "PHP", "Symfony"],
      tags: ["frontend", "web-components", "sports", "php"],
      featured: true,
      year: 2022,
    },
    {
      slug: "ai-sports-content",
      title: "AI Sports Content Engine",
      description:
        "AI-powered content generation pipeline for automated sports articles using CrewAI and LLM agents.",
      longDescription:
        "Designed and developed an AI-powered content generation system using the CrewAI multi-agent framework with custom prompt engineering and editorial validation pipelines, cutting manual editorial workload by ~60% on target workflows.",
      role: "Senior Software Engineer",
      company: "Better Collective",
      companyUrl: "https://www.bettercollective.com/",
      liveUrl: "https://www.bettercollective.com/",
      repoUrl: undefined,
      imageUrl: "/assets/images/projects/bc.png", // TODO: add screenshot
      tech: ["Python", "CrewAI", "LLM Agents", "Node.js", "TypeScript"],
      tags: ["ai", "backend", "machine-learning", "sports"],
      featured: true,
      year: 2024,
    },
    {
      slug: "horisen-pro",
      title: "HORISEN-Pro Enterprise Platform",
      description:
        "Comprehensive enterprise messaging and workflow management platform for telecom clients.",
      longDescription:
        "Full-stack development of the HORISEN-pro enterprise platform — a comprehensive suite covering messaging, workflow management, reporting, SMS marketing, and account administration for telecom operators across Europe.",
      role: "Full-Stack Web Developer",
      company: "HORISEN AG",
      companyUrl: "https://www.horisen.com/",
      liveUrl: "https://www.horisen.com/",
      repoUrl: undefined,
      imageUrl: "/assets/images/projects/horisen.png", // TODO: add screenshot
      tech: ["PHP", "Zend Framework", "AngularJS", "JavaScript", "MySQL"],
      tags: ["backend", "enterprise", "telecom", "php"],
      featured: false,
      year: 2017,
    },
    {
      slug: "real-estate-portal",
      title: "Real Estate Management Portal",
      description:
        "Full real estate listing and management web portal built from the ground up.",
      longDescription:
        "Co-founded and fully developed a real estate management portal handling property listings, search, agency management, and digital marketing automation. Handled full deployment, maintenance, and SEO strategy.",
      role: "Co-Founder & Full-Stack Web Developer",
      company: "Olymp Real-Estates",
      companyUrl: "https://www.olymp-nekretnine.co.rs",
      liveUrl: "https://www.olymp-nekretnine.co.rs",
      repoUrl: undefined,
      imageUrl: "/assets/images/projects/olymp.png", // TODO: add screenshot
      tech: ["PHP", "CodeIgniter", "Smarty", "MySQL", "jQuery"],
      tags: ["backend", "fullstack", "real-estate", "php"],
      featured: false,
      year: 2012,
    },
  ],

  // ── Skills ────────────────────────────────────────────────────────────────
  skillGroups: [
    {
      label: "Frontend",
      category: "frontend",
      skills: [
        "TypeScript",
        "Angular (v1–v21)",
        "React",
        "Next.js 15",
        "Ionic",
        "AngularJS",
        "Web Components / Stencil",
        "HTML5",
        "CSS3 / SCSS",
        "CSS Grid / Flexbox",
        "Responsive Design",
        "Accessibility (WCAG)",
        "jQuery",
      ],
    },
    {
      label: "Backend",
      category: "backend",
      skills: [
        "Node.js",
        "NestJS",
        "Express",
        "FastAPI",
        "PHP",
        "Symfony",
        "Laravel",
        "CodeIgniter",
        "Zend Framework",
        "Python",
        "REST APIs",
        "GraphQL",
        "WebSockets",
        "OpenAPI / Swagger",
        "OAuth / JWT",
      ],
    },
    {
      label: "Databases",
      category: "database",
      skills: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis (data caching)",
        "TypeORM",
        "Prisma",
      ],
    },
    {
      label: "DevOps & Cloud",
      category: "devops",
      skills: [
        "Docker",
        "Docker Compose",
        "GitHub Actions",
        "Azure DevOps",
        "CI/CD Pipelines",
        "AWS Amplify",
        "Nginx",
        "Linux (Ubuntu)",
        "Bash / Zsh scripting",
        "SSH / Networking",
        "systemd",
        "VirtualBox",
        "Vagrant",
      ],
    },
    {
      label: "Testing",
      category: "testing",
      skills: [
        "Jest",
        "Vitest",
        "Testing Library",
        "PHPUnit",
        "Playwright",
        "Cypress",
        "Unit / Integration / E2E",
      ],
    },
    {
      label: "AI & Agentic",
      category: "tools",
      skills: [
        "CrewAI (Multi-Agent)",
        "OpenAI API",
        "Google Gemini",
        "Claude",
        "Prompt Engineering",
        "Tool Calling",
        "LLM Workflow Orchestration",
      ],
    },
    {
      label: "Performance & Architecture",
      category: "performance",
      skills: [
        "Core Web Vitals",
        "Code Splitting",
        "Lazy Loading",
        "Asset Optimization",
        "Caching / CDN",
        "Lighthouse / DevTools",
        "Browser Rendering",
        "Software Architecture",
        "Design Patterns",
      ],
    },
    {
      label: "Security",
      category: "security",
      skills: [
        "OWASP Top 10",
        "Input Validation / Encoding",
        "CSRF Protection",
        "Secure Headers / CORS",
        "Auth / Session Hardening",
        "Parameterized Queries",
        "Secrets Management",
        "Dependency Hygiene",
      ],
    },
    {
      label: "Tools",
      category: "tools",
      skills: [
        "Git",
        "Jira",
        "Confluence",
        "Agile / Scrum",
        "VS Code",
        "Postman",
      ],
    },
  ],

  // ── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      institution: "School of Electrical Engineering 'Mija Stanimirovic'",
      degree: "Specialty",
      field: "Electro-Medical Equipment",
      years: "Nis, Serbia",
    },
  ],

  // ── Interests ─────────────────────────────────────────────────────────────
  interests: [
    "Emerging Technologies",
    "Mountain Biking",
    "Fishing (Lure & Fly)",
    "Guitar",
    "Reading",
    "Movies",
  ],

  // ── Now / Next ─────────────────────────────────────────────────────────────
  nowNext: [
    {
      label: "Now",
      text: "Independent consulting and end-to-end product delivery — NestJS and Next.js 15 platforms, agentic AI features, and production ownership from architecture through deployment.",
    },
    {
      label: "Next",
      text: "Going deeper into LLM agent orchestration and tool calling, and bringing more agentic workflows into production systems.",
    },
  ],
};
