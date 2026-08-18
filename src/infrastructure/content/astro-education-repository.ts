import { getCollection, getEntry } from 'astro:content';
import type { Education } from '@/domain/education';
import type { EducationRepository } from '@/repositories/education-repository';
import { toEducation } from './mappers';

const byStartDateDesc = (a: Education, b: Education) => b.startDate.localeCompare(a.startDate);

export const astroEducationRepository: EducationRepository = {
  async getAll() {
    const entries = await getCollection('education');
    return entries.map(toEducation).sort(byStartDateDesc);
  },

  async getById(id) {
    const entry = await getEntry('education', id);
    return entry ? toEducation(entry) : null;
  },
};
