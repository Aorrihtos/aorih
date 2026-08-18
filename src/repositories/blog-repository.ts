import type { BlogPost, BlogPostSummary } from '@/domain/blog-post';

export interface BlogRepository {
  /** Published posts, most recent first. Drafts are never returned. */
  getAll(): Promise<BlogPostSummary[]>;
  /** Includes the rendered body. */
  getBySlug(slug: string): Promise<BlogPost | null>;
}
