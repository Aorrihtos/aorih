export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  tags: string[];
};

export type BlogPost = BlogPostSummary & {
  /** Rendered body, ready to be injected as HTML. */
  html: string;
};
