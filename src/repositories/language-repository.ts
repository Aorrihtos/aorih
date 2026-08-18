import type { Language } from '@/domain/language';

export interface LanguageRepository {
  getAll(): Promise<Language[]>;
}
