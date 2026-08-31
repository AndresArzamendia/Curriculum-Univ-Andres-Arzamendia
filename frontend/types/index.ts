export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  photoUrl?: string;
  linkedin?: string;
  github?: string;
  whatsapp?: string;
  cvUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrls: string;
  tags: string;
  repoUrl?: string;
  demoUrl?: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  verifyUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  order: number;
}

export interface Metrics {
  totalVisits: number;
  totalDownloads: number;
  whatsappClicks: number;
  emailClicks: number;
  linkedinClicks: number;
  githubClicks: number;
  eventsByDay: { event: string; _count: { id: number } }[];
  visitsByDay: { date: string; count: number }[];
  recentEvents: MetricEvent[];
}

export interface MetricEvent {
  id: string;
  event: string;
  metadata?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
