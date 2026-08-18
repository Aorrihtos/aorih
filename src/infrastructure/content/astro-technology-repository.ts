import { getCollection } from 'astro:content';
import type { TechnologyRepository } from '@/repositories/technology-repository';
import { toTechnology } from './mappers';
import { byOrder } from './ordering';

export const astroTechnologyRepository: TechnologyRepository = {
  async getAll() {
    const entries = await getCollection('technologies');
    return entries.map(toTechnology).sort(byOrder);
  },
};
