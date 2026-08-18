/**
 * Composition root: the only place that binds a repository contract to a concrete
 * implementation. Swapping the content source (Strapi, Payload, a database, an
 * HTTP API...) means changing the right-hand side here and nothing else — pages
 * and components only ever import these constants.
 */
import { astroBlogRepository } from '@/infrastructure/content/astro-blog-repository';
import { astroEducationRepository } from '@/infrastructure/content/astro-education-repository';
import { astroExperienceRepository } from '@/infrastructure/content/astro-experience-repository';
import { astroLanguageRepository } from '@/infrastructure/content/astro-language-repository';
import { astroProjectRepository } from '@/infrastructure/content/astro-project-repository';
import { astroSiteSettingsRepository } from '@/infrastructure/content/astro-site-settings-repository';
import { astroSocialLinkRepository } from '@/infrastructure/content/astro-social-link-repository';
import { astroTechnologyRepository } from '@/infrastructure/content/astro-technology-repository';

import type { BlogRepository } from './blog-repository';
import type { EducationRepository } from './education-repository';
import type { ExperienceRepository } from './experience-repository';
import type { LanguageRepository } from './language-repository';
import type { ProjectRepository } from './project-repository';
import type { SiteSettingsRepository } from './site-settings-repository';
import type { SocialLinkRepository } from './social-link-repository';
import type { TechnologyRepository } from './technology-repository';

export const experienceRepository: ExperienceRepository = astroExperienceRepository;
export const educationRepository: EducationRepository = astroEducationRepository;
export const projectRepository: ProjectRepository = astroProjectRepository;
export const technologyRepository: TechnologyRepository = astroTechnologyRepository;
export const languageRepository: LanguageRepository = astroLanguageRepository;
export const socialLinkRepository: SocialLinkRepository = astroSocialLinkRepository;
export const blogRepository: BlogRepository = astroBlogRepository;
export const siteSettingsRepository: SiteSettingsRepository = astroSiteSettingsRepository;
