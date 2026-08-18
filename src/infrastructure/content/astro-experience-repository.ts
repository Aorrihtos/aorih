import { getCollection, getEntry } from 'astro:content';
import type { Experience } from '@/domain/experience';
import type { ExperienceRepository } from '@/repositories/experience-repository';
import { toExperience } from './mappers';

const byStartDateDesc = (a: Experience, b: Experience) => b.startDate.localeCompare(a.startDate);

export const astroExperienceRepository: ExperienceRepository = {
  async getAll() {
    const entries = await getCollection('experience');
    return entries.map(toExperience).sort(byStartDateDesc);
  },

  async getById(id) {
    const entry = await getEntry('experience', id);
    return entry ? toExperience(entry) : null;
  },
};
