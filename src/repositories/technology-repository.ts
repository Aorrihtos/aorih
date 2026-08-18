import type { Technology } from '@/domain/technology';

export interface TechnologyRepository {
  getAll(): Promise<Technology[]>;
}
