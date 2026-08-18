# Aorih — portfolio

Personal portfolio of Sergio Ferrer. CRT-terminal aesthetic, content-driven, deployed on Netlify
and edited through a Git-based CMS.

## Stack

| Concern         | Choice                                                       |
| --------------- | ------------------------------------------------------------ |
| Framework       | [Astro](https://astro.build) 7, static/prerendered by default |
| Language        | TypeScript (strict)                                           |
| Content         | YAML + Markdown files in `src/content`, versioned in Git      |
| Content typing  | Astro Content Collections (Zod schemas)                       |
| CMS             | [Keystatic](https://keystatic.com) — local in dev, GitHub Mode in production |
| Hosting         | Netlify (`@astrojs/netlify` adapter)                          |
| React           | Only to mount the Keystatic admin UI. No React in the portfolio itself. |

---

## Architecture

The one rule this project enforces: **the UI never knows where content comes from.**

```
 Keystatic  ─writes→  Markdown / YAML in Git
                            │
                            ▼
                    infrastructure/        ← the only layer that imports `astro:content`
                            │
                            ▼
                    repositories/          ← contracts (interfaces) + composition root
                            │
                            ▼
                      domain/              ← plain TypeScript types, zero dependencies
                            │
                            ▼
              pages/ · components/ · layouts/
```

A page asks a repository for domain objects and renders them:

```astro
---
import { experienceRepository } from '@/repositories';
import ExperienceList from '@/components/experience/ExperienceList.astro';

const experiences = await experienceRepository.getAll();
---

<ExperienceList experiences={experiences} />
```

It never does `getCollection('experience')`, never touches a `CollectionEntry`, never imports
anything from Keystatic.

### Folder structure

```
├── astro.config.mjs          # site URL, Netlify adapter, integrations
├── keystatic.config.ts       # CMS schema — storage mode, collections, singletons
├── netlify.toml              # build command + publish directory
├── .env.example              # environment variables needed by GitHub Mode
│
├── public/
│   ├── assets/               # images and icons, served verbatim at /assets/...
│   └── favicon.svg
│
└── src/
    ├── domain/               # Experience, Education, Project, Technology, Language,
    │                         # SocialLink, BlogPost, SiteSettings — pure types
    │
    ├── repositories/         # one interface per entity + index.ts (composition root)
    │
    ├── infrastructure/
    │   └── content/
    │       ├── collections.ts            # Zod schemas for every collection
    │       ├── mappers.ts                # CollectionEntry → domain model
    │       ├── ordering.ts
    │       └── astro-*-repository.ts     # implementations of the contracts
    │
    ├── content/              # the actual content, edited by Keystatic
    │   ├── experience/  education/  projects/
    │   ├── technologies/  languages/  contact/  settings/     (*.yaml)
    │   └── blog/                                              (*.md)
    │
    ├── content.config.ts     # required by Astro; re-exports infrastructure/content/collections
    │
    ├── layouts/BaseLayout.astro
    ├── components/           # grouped by domain concept
    ├── pages/                # /, /projects, /contact, /blog, /blog/[slug]
    ├── styles/               # global.css (visual identity) + crt.css (CRT filter)
    └── lib/                  # format-date, player-stats, data-slides
```

### Why this and not more

There is no dependency-injection container, no factory, no event bus and no generic adapter
layer. The abstraction is exactly two files per entity — an interface and an implementation —
plus one composition root. That is the minimum needed to make the content source replaceable.

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:4321
```

The CMS is at **http://localhost:4321/keystatic**. In development it uses local storage, so it
writes directly to `src/content` and needs no credentials or GitHub setup.

```bash
npm run check        # astro check — TypeScript diagnostics
npm run build        # astro check && astro build
npm run preview      # serve the production build
```

> While `src/content/blog` has no posts, the build prints
> `The collection "blog" does not exist or is empty`. It is harmless and disappears with the
> first post.

---

## How the content works

Everything is file-driven: **adding a file adds an entry**. No page, component or layout has to
be touched to add an experience, a project or an article.

### Add an experience

Create `src/content/experience/<stable-slug>.yaml`:

```yaml
company: Acme
companyLogo: /assets/acme.png
position: Backend Engineer
employmentType: Full time
startDate: 2024-01-01
endDate: 2025-06-01 # omit while current
skills:
  - Go
  - PostgreSQL
```

It appears automatically on `/`, sorted by `startDate` descending. Consecutive entries from the
same company are grouped under a single logo, matching the original layout.

### Add a project

`src/content/projects/<stable-slug>.yaml`:

```yaml
title: My Project
description: What it is.
image: /assets/icons/my-project.png
url: https://example.com
order: 3
```

Shown on `/projects`, sorted by `order` ascending.

### Add a blog post

`src/content/blog/<stable-slug>.md`:

```markdown
---
title: My first post
description: A short summary used in the listing and in the meta description.
publishedAt: 2026-09-01
tags:
  - astro
draft: false
---

Markdown body goes here.
```

The post appears at `/blog/<stable-slug>` and in the `/blog` listing, most recent first. Entries
with `draft: true` are excluded from both.

> `/blog` is live but deliberately not linked from the header yet — add a fourth entry to the
> `links` array in `src/components/layout/Header.astro` when you want it visible.

### Other collections

`technologies/`, `languages/` and `contact/` follow the same pattern (`order` controls position).
`settings/site.yaml` is a singleton holding the contact email, the birth date that drives the
footer `LEVEL`, and the HP/AP ranges.

### File names are the identifiers

The file name is the stable ID and, for blog posts, the URL slug. Keystatic exposes it as a
separate editable field, so renaming a project title does not have to change its identifier.

---

## Repository pattern

Contract (`src/repositories/experience-repository.ts`):

```ts
import type { Experience } from '@/domain/experience';

export interface ExperienceRepository {
  getAll(): Promise<Experience[]>;
  getById(id: string): Promise<Experience | null>;
}
```

Implementation (`src/infrastructure/content/astro-experience-repository.ts`) — the only place
allowed to know about Markdown, YAML or `astro:content`:

```ts
export const astroExperienceRepository: ExperienceRepository = {
  async getAll() {
    const entries = await getCollection('experience');
    return entries.map(toExperience).sort(byStartDateDesc);
  },
  ...
};
```

Composition root (`src/repositories/index.ts`):

```ts
export const experienceRepository: ExperienceRepository = astroExperienceRepository;
```

### Replacing the content source

To move to Strapi, Payload, a database or an HTTP API:

1. Write `src/infrastructure/strapi/strapi-experience-repository.ts` implementing
   `ExperienceRepository`.
2. Change one line in `src/repositories/index.ts`:

   ```diff
   - export const experienceRepository: ExperienceRepository = astroExperienceRepository;
   + export const experienceRepository: ExperienceRepository = strapiExperienceRepository;
   ```

Pages, components and layouts stay untouched. If the new source is not available at build time,
set `export const prerender = false` on the affected pages — that is the only other change.

---

## Keystatic GitHub Mode

Development uses `storage: { kind: 'local' }`. Production uses
`storage: { kind: 'github', repo: { owner: 'Aorrihtos', name: 'aorih' } }`, so every save in the
CMS becomes a commit (or a pull request) on this repository. Authentication is GitHub's — there
are no users, passwords or tokens of our own.

### One-time setup

1. Deploy the site to Netlify first, so you have the production URL.
2. Visit `https://<your-domain>/keystatic` and follow the "set up GitHub App" flow. Keystatic
   creates the GitHub App for you and shows the resulting credentials.
3. Copy them into Netlify → **Site configuration → Environment variables**:

   | Variable                            | Notes                                       |
   | ----------------------------------- | ------------------------------------------- |
   | `KEYSTATIC_GITHUB_CLIENT_ID`        | From the GitHub App                         |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET`    | From the GitHub App                         |
   | `KEYSTATIC_SECRET`                  | Any long random string (session encryption)  |
   | `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`  | The App slug; `PUBLIC_` because the browser needs it |

4. Redeploy.

`.env.example` lists the same variables. Never commit a real `.env` — it is git-ignored.

Only collaborators with write access to the repository can edit content.

---

## Netlify

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 22 (set in `netlify.toml`)

The site is built with `output: 'static'` plus the Netlify adapter. Every portfolio page is
prerendered to plain HTML; only the two routes injected by the Keystatic integration
(`/keystatic` and `/api/keystatic/*`) run on demand as a Netlify function. There is no backend,
no API of our own and no database.

### Deploy flow

```
Keystatic → commit on GitHub → Netlify build → new HTML deployed
```

Publishing a new article therefore requires no code change at all.

If you change the domain, update `site` in `astro.config.mjs` — it feeds the canonical URLs,
Open Graph tags and the sitemap.

---

## Visual identity

The design is a faithful port of the original vanilla site, not a redesign: same palette
(`#171616` / `#9EF49C` / `#153716`), same IBM Plex Mono typography, same tab-shaped header, same
game-like footer, same spacing, breakpoints and animations.

The **CRT filter is global and unchanged**: `src/styles/crt.css` is applied through
`<body class="crt">` in `BaseLayout` and combines scanlines and an RGB subpixel mask
(`::before`), a brightness flicker (`::after`) and per-frame chromatic aberration on text
(`textShadow`). The keyframe values are the original ones and should not be "tidied up" — the
irregularity is what makes it look like a real tube.

Client-side JavaScript is limited to two small vanilla modules: the DATA page panel navigation
(`src/lib/data-slides.ts`) and the footer stats (`src/lib/player-stats.ts`).
