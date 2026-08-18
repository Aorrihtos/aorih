import { getCollection, getEntry, render } from 'astro:content';
import type { BlogPostSummary } from '@/domain/blog-post';
import type { BlogRepository } from '@/repositories/blog-repository';
import { toBlogPostSummary } from './mappers';

const byPublishedAtDesc = (a: BlogPostSummary, b: BlogPostSummary) =>
  b.publishedAt.localeCompare(a.publishedAt);

export const astroBlogRepository: BlogRepository = {
  async getAll() {
    const entries = await getCollection('blog', ({ data }) => !data.draft);
    return entries.map(toBlogPostSummary).sort(byPublishedAtDesc);
  },

  async getBySlug(slug) {
    const entry = await getEntry('blog', slug);
    if (!entry || entry.data.draft) return null;

    // `render` populates the entry's rendered content; reading it back keeps the
    // Markdown pipeline from leaking out of this layer as an Astro component.
    await render(entry);
    return { ...toBlogPostSummary(entry), html: entry.rendered?.html ?? '' };
  },
};
