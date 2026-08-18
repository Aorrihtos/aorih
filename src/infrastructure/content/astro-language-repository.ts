import { getCollection } from 'astro:content';
import type { LanguageRepository } from '@/repositories/language-repository';
import { toLanguage } from './mappers';
import { byOrder } from './ordering';

export const astroLanguageRepository: LanguageRepository = {
  async getAll() {
    const entries = await getCollection('languages');
    return entries.map(toLanguage).sort(byOrder);
  },
};
