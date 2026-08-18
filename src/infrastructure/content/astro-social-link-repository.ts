import { getCollection } from 'astro:content';
import type { SocialLinkRepository } from '@/repositories/social-link-repository';
import { toSocialLink } from './mappers';
import { byOrder } from './ordering';

export const astroSocialLinkRepository: SocialLinkRepository = {
  async getAll() {
    const entries = await getCollection('contact');
    return entries.map(toSocialLink).sort(byOrder);
  },
};
