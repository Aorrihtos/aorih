import type { Education } from '@/domain/education';

export interface EducationRepository {
  /** Ordered from most to least recent. */
  getAll(): Promise<Education[]>;
  getById(id: string): Promise<Education | null>;
}
