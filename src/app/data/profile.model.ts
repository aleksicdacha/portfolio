// ─────────────────────────────────────────────
// Profile data model – edit profile.ts to update content
// ─────────────────────────────────────────────

export interface SocialLink {
  label: string;
  url: string;
  icon: "linkedin" | "github" | "email" | "external" | "instagram"; // TODO: add more icons as needed
}

export interface TechTag {
  label: string;
  category: TechCategory;
}

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "testing"
  | "tools"
  | "platforms"
  | "security"
  | "performance"
  | "languages";

export interface SkillGroup {
  label: string;
  category: TechCategory;
  skills: string[];
}

export interface ExperienceItem {
  company: string;
  companyUrl?: string;
  location: string;
  role: string;
  startDate: string; // e.g. "April 2025"
  endDate: string; // e.g. "August 2025" | "Present"
  summary?: string;
  achievements: string[];
  tech: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  role: string;
  company?: string;
  companyUrl?: string;
  liveUrl?: string;
  repoUrl?: string; // TODO: add GitHub repo URLs
  imageUrl?: string; // TODO: replace with actual screenshots
  tech: string[];
  tags: string[]; // used for filtering
  featured: boolean;
  year: number;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  years: string;
}

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  cvUrl: string; // path to PDF
  headshot?: string; // TODO: add headshot URL
  socialLinks: SocialLink[];
  summary: string;
  quickFacts: { label: string; value: string }[];
  experience: ExperienceItem[];
  projects: Project[];
  skillGroups: SkillGroup[];
  education: Education[];
  interests: string[];
  nowNext: { label: string; text: string }[];
}
