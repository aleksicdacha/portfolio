// ─────────────────────────────────────────────────────────────────────────────
//  SINGLE SOURCE OF TRUTH  –  update this file to update all portfolio content
//  Generated from CV + LinkedIn: https://www.linkedin.com/in/aleksicdacha42a29b111/
// ─────────────────────────────────────────────────────────────────────────────

import { Profile } from "./profile.model";

export const PROFILE: Profile = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: "Dalibor Aleksic",
  headline: "Full-Stack Developer",
  tagline:
    "Building scalable web products at the intersection of great engineering and clean design.",
  email: "aleksic.dacha@gmail.com",
  phone: "+381 (069) 2924776",
  location: "Nis, Serbia",
  timezone: "CET (UTC+1)",
  cvUrl: "/assets/cv/cv.pdf", // TODO: drop your CV PDF in src/assets/cv/
  headshot: "/assets/images/me.png", // TODO: add URL e.g. '/assets/images/headshot.jpg'

  // ── Social Links ──────────────────────────────────────────────────────────
  socialLinks: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/aleksicdacha42a29b111/",
      icon: "linkedin",
    },
    {
      label: "GitHub",
      url: "https://github.com/aleksicdacha", // TODO: confirm GitHub username
      icon: "github",
    },
    {
      label: "Email",
      url: "mailto:aleksic.dacha@gmail.com",
      icon: "email",
    },
  ],

  // ── Summary ───────────────────────────────────────────────────────────────
  summary: `Experienced Full-Stack Web Developer with over two decades of experience in web and software development, spanning freelancing and in-house roles. Skilled in creating complex front-end and back-end solutions across diverse industries, from telecommunications and online gaming to health services and sports media. Proficient in a broad range of programming languages and technologies — Angular, React, Node.js, PHP, PostgreSQL — with a commitment to continuous learning and innovation.`,

  // ── Quick Facts (shown in hero) ────────────────────────────────────────────
  quickFacts: [
    { label: "Location", value: "Nis, Serbia" },
    { label: "Experience", value: "20+ Years" },
    { label: "Stack", value: "Angular · React · Node · PHP" },
    { label: "Availability", value: "Open to opportunities" },
  ],

  // ── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      company: "Union Studio",
      companyUrl: "https://www.olla.me/",
      location: "Serbia / US (Remote)",
      role: "Senior Software Engineer",
      startDate: "April 2025",
      endDate: "August 2025",
      summary:
        "Frontend development for multiple health-support services targeting Android and iOS.",
      achievements: [
        "Developed Angular (v19+) and Ionic Framework applications for multi-platform mobile health services.",
        "Integrated CI/CD pipelines using Azure DevOps Services for code management, testing, and deployment.",
        "Delivered scalable, maintainable codebases guided by strong software infrastructure and design principles.",
        "Ensured responsive, accessible, and high-performance UI across mobile and web platforms.",
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
      role: "Full-Stack Web Developer / Senior Web Developer",
      startDate: "November 2018",
      endDate: "November 2024",
      summary:
        "Built high-profile sports media platforms and AI-powered content generation tools.",
      achievements: [
        "Developed and maintained AI-powered tools for automated sports content generation using CrewAI and LLM agents.",
        "Complete front-end revamp of Vegas Insider (vegasinsider.com) — a top US sports-betting platform — using Web Components.",
        "Architected back-end services in PHP (Symfony/Laravel) and Node.js for high-traffic sports media sites.",
        "Made key architectural and design decisions; mentored junior developers and guided internship programs.",
        "Worked across a portfolio of high-traffic, SEO-critical sports media properties.",
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
      ],
    },
    {
      company: "HORISEN AG",
      companyUrl: "https://www.horisen.com/",
      location: "Switzerland",
      role: "Full-Stack Web Developer",
      startDate: "2015",
      endDate: "2018",
      summary:
        "Built enterprise platforms and white-label products for telecom and gaming clients.",
      achievements: [
        "Developed and maintained HORISEN-pro — a comprehensive enterprise messaging platform.",
        "Built iCard loyalty program platform and an SMS newsletter marketing platform.",
        "Developed security and account administration apps (front-end and back-end).",
        "Delivered Nestlé-Frisco VTool Marketing — an admin app for targeted promotional campaigns.",
        "Built white-label software and online gaming apps for clients including Orange.pl and Ringier Axel Springer.",
      ],
      tech: ["PHP", "Zend Framework", "JavaScript", "AngularJS", "MySQL"],
    },
    {
      company: "Olymp Real-Estates",
      companyUrl: "https://www.olymp-nekretnine.co.rs",
      location: "Nis, Serbia",
      role: "Co-owner & Web Developer",
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
        "Complete front-end revamp of a top US sports-betting platform using Web Components.",
      longDescription:
        "Led the complete front-end architecture overhaul of VegasInsider.com — one of the most visited sports-betting platforms in the US. Implemented a modern Web Components (Stencil) architecture, coupled with a PHP backend rebuild, delivering improved performance and a drastically improved user experience.",
      role: "Full-Stack Web Developer",
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
        "Designed and developed an AI-powered content generation system that autonomously produces high-quality sports editorial content. Built using CrewAI multi-agent framework with custom prompt engineering and editorial validation pipelines.",
      role: "Full-Stack Web Developer",
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
      role: "Co-owner & Web Developer",
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
        "Angular (v2–v19)",
        "React / Next.js",
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
        "Express",
        "NestJS",
        "PHP",
        "Symfony",
        "Python",
        "Laravel",
        "CodeIgniter",
        "Zend Framework",
        "REST APIs",
        "GraphQL",
        "WebSockets",
        "OAuth / JWT",
      ],
    },
    {
      label: "Databases",
      category: "database",
      skills: ["PostgreSQL", "MySQL", "NoSQL", "Redis (data caching)"],
    },
    {
      label: "DevOps & Cloud",
      category: "devops",
      skills: [
        "Docker",
        "Azure DevOps",
        "GitHub Actions",
        "AWS Amplify",
        "CI/CD Pipelines",
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
      label: "AI & Emerging",
      category: "tools",
      skills: ["CrewAI", "LLM Agent Frameworks", "Prompt Engineering"],
    },
    {
      label: "Performance & Architecture",
      category: "performance",
      skills: [
        "Code Splitting",
        "Lazy Loading",
        "Asset Optimization",
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
      text: "Focused on building polished Angular and React applications, exploring AI-augmented development workflows and cross-platform mobile with Ionic.",
    },
    {
      label: "Next",
      text: "Deepening expertise in LLM agent orchestration, production-grade NestJS backends, and contributing to open-source tooling.",
    },
  ],
};
