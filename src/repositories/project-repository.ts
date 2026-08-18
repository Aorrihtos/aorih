import type { Project } from '@/domain/project';

export interface ProjectRepository {
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
}
