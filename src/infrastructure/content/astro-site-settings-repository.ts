import { getEntry } from 'astro:content';
import type { SiteSettingsRepository } from '@/repositories/site-settings-repository';
import { toSiteSettings } from './mappers';

export const astroSiteSettingsRepository: SiteSettingsRepository = {
  async get() {
    const entry = await getEntry('settings', 'site');
    if (!entry) throw new Error('Missing src/content/settings/site.yaml');
    return toSiteSettings(entry);
  },
};
