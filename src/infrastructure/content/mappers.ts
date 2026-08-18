import type { CollectionEntry } from 'astro:content';
import type { BlogPostSummary } from '@/domain/blog-post';
import type { Education } from '@/domain/education';
import type { Experience } from '@/domain/experience';
import type { Language } from '@/domain/language';
import type { Project } from '@/domain/project';
import type { SiteSettings } from '@/domain/site-settings';
import type { SocialLink } from '@/domain/social-link';
import type { Technology } from '@/domain/technology';

export const toExperience = (entry: CollectionEntry<'experience'>): Experience => ({
  id: entry.id,
  ...entry.data,
});

export const toEducation = (entry: CollectionEntry<'education'>): Education => ({
  id: entry.id,
  ...entry.data,
});

export const toProject = (entry: CollectionEntry<'projects'>): Project => ({
  id: entry.id,
  ...entry.data,
});

export const toTechnology = (entry: CollectionEntry<'technologies'>): Technology => ({
  id: entry.id,
  ...entry.data,
});

export const toLanguage = (entry: CollectionEntry<'languages'>): Language => ({
  id: entry.id,
  ...entry.data,
});

export const toSocialLink = (entry: CollectionEntry<'contact'>): SocialLink => ({
  id: entry.id,
  ...entry.data,
});

export const toSiteSettings = (entry: CollectionEntry<'settings'>): SiteSettings => ({
  ...entry.data,
});

export const toBlogPostSummary = (entry: CollectionEntry<'blog'>): BlogPostSummary => ({
  id: entry.id,
  slug: entry.id,
  title: entry.data.title,
  description: entry.data.description,
  publishedAt: entry.data.publishedAt,
  tags: entry.data.tags,
});
