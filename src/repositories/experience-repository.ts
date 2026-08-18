import type { Experience } from '@/domain/experience';

export interface ExperienceRepository {
  /** Ordered from most to least recent. */
  getAll(): Promise<Experience[]>;
  getById(id: string): Promise<Experience | null>;
}
