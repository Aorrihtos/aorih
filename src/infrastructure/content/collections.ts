import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const CONTENT_DIR = './src/content';
const yaml = (dir: string) => glob({ pattern: '**/[^_]*.yaml', base: `${CONTENT_DIR}/${dir}` });

// YAML parses an unquoted `2021-08-01` into a Date, so accept both shapes and
// normalise to the `YYYY-MM-DD` string the domain models expect.
const isoDate = z
  .union([z.string(), z.date()])
  .transform((value) => (typeof value === 'string' ? value : value.toISOString().slice(0, 10)));

const experience = defineCollection({
  loader: yaml('experience'),
  schema: z.object({
    company: z.string(),
    companyLogo: z.string().optional(),
    position: z.string(),
    employmentType: z.string(),
    startDate: isoDate,
    endDate: isoDate.optional(),
    skills: z.array(z.string()).default([]),
  }),
});

const education = defineCollection({
  loader: yaml('education'),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    logo: z.string().optional(),
    startDate: isoDate,
    endDate: isoDate.optional(),
    description: z.string(),
  }),
});

const projects = defineCollection({
  loader: yaml('projects'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    url: z.url(),
    order: z.number().int().default(0),
  }),
});

const technologies = defineCollection({
  loader: yaml('technologies'),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    order: z.number().int().default(0),
  }),
});

const languages = defineCollection({
  loader: yaml('languages'),
  schema: z.object({
    name: z.string(),
    level: z.string(),
    order: z.number().int().default(0),
  }),
});

const contact = defineCollection({
  loader: yaml('contact'),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    url: z.url(),
    order: z.number().int().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: `${CONTENT_DIR}/blog` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: isoDate,
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Singleton: a single `site.yaml` entry, kept as a collection so Keystatic and
// Astro read it through the same mechanism as every other content type.
const settings = defineCollection({
  loader: yaml('settings'),
  schema: z.object({
    email: z.email(),
    birthDate: isoDate,
    hp: z.object({ min: z.number().int(), max: z.number().int() }),
    ap: z.object({ min: z.number().int(), max: z.number().int() }),
  }),
});

export const collections = {
  experience,
  education,
  projects,
  technologies,
  languages,
  contact,
  blog,
  settings,
};
