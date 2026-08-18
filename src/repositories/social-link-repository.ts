import type { SocialLink } from '@/domain/social-link';

export interface SocialLinkRepository {
  getAll(): Promise<SocialLink[]>;
}
