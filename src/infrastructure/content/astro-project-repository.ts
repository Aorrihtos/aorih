import { getCollection, getEntry } from 'astro:content';
import type { ProjectRepository } from '@/repositories/project-repository';
import { toProject } from './mappers';
import { byOrder } from './ordering';

export const astroProjectRepository: ProjectRepository = {
  async getAll() {
    const entries = await getCollection('projects');
    return entries.map(toProject).sort(byOrder);
  },

  async getById(id) {
    const entry = await getEntry('projects', id);
    return entry ? toProject(entry) : null;
  },
};
