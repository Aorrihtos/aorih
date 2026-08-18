import { collection, config, fields, singleton } from '@keystatic/core';

/**
 * Keystatic is the editing surface for the content in `src/content`. It writes
 * the same YAML/Markdown files that the Astro content collections read, and the
 * application never imports anything from here.
 *
 * Local storage during development so no credentials are needed; GitHub Mode in
 * production, where edits become commits on this repository.
 */
// Optional chaining so the config can also be loaded outside Vite (scripts using
// `createReader`), where `import.meta.env` is not defined.
const storage = import.meta.env?.DEV
  ? ({ kind: 'local' } as const)
  : ({ kind: 'github', repo: { owner: 'Aorrihtos', name: 'aorih' } } as const);

const icon = (label: string) =>
  fields.image({
    label,
    directory: 'public/assets/icons',
    publicPath: '/assets/icons/',
    validation: { isRequired: true },
  });

const order = fields.integer({
  label: 'Order',
  description: 'Lower values are shown first.',
  defaultValue: 0,
  validation: { isRequired: true },
});

export default config({
  storage,
  ui: {
    brand: { name: 'Aorih' },
    navigation: {
      Portfolio: ['experience', 'education', 'projects'],
      Profile: ['technologies', 'languages', 'contact'],
      Blog: ['blog'],
      Configuration: ['settings'],
    },
  },
  collections: {
    experience: collection({
      label: 'Experience',
      path: 'src/content/experience/*',
      format: { data: 'yaml' },
      slugField: 'position',
      columns: ['company', 'position'],
      schema: {
        position: fields.slug({
          name: { label: 'Position', validation: { isRequired: true } },
          slug: { description: 'Stable identifier used as the file name.' },
        }),
        company: fields.text({ label: 'Company', validation: { isRequired: true } }),
        companyLogo: fields.image({
          label: 'Company logo',
          directory: 'public/assets',
          publicPath: '/assets/',
        }),
        employmentType: fields.text({ label: 'Employment type', validation: { isRequired: true } }),
        startDate: fields.date({ label: 'Start date', validation: { isRequired: true } }),
        endDate: fields.date({ label: 'End date', description: 'Leave empty if current.' }),
        skills: fields.array(fields.text({ label: 'Skill' }), {
          label: 'Aptitudes',
          itemLabel: (props) => props.value,
        }),
      },
    }),

    education: collection({
      label: 'Education',
      path: 'src/content/education/*',
      format: { data: 'yaml' },
      slugField: 'institution',
      columns: ['institution', 'degree'],
      schema: {
        institution: fields.slug({
          name: { label: 'Institution', validation: { isRequired: true } },
          slug: { description: 'Stable identifier used as the file name.' },
        }),
        degree: fields.text({ label: 'Degree', validation: { isRequired: true } }),
        logo: icon('Logo'),
        startDate: fields.date({ label: 'Start date', validation: { isRequired: true } }),
        endDate: fields.date({ label: 'End date', description: 'Leave empty if ongoing.' }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),

    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      slugField: 'title',
      columns: ['title', 'url'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { description: 'Stable identifier used as the file name.' },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        image: icon('Image'),
        url: fields.url({ label: 'Link', validation: { isRequired: true } }),
        order,
      },
    }),

    technologies: collection({
      label: 'Technologies',
      path: 'src/content/technologies/*',
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name'],
      schema: {
        name: fields.slug({
          name: { label: 'Name', validation: { isRequired: true } },
          slug: { description: 'Stable identifier used as the file name.' },
        }),
        icon: icon('Icon'),
        order,
      },
    }),

    languages: collection({
      label: 'Languages',
      path: 'src/content/languages/*',
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name', 'level'],
      schema: {
        name: fields.slug({
          name: { label: 'Language', validation: { isRequired: true } },
          slug: { description: 'Stable identifier used as the file name.' },
        }),
        level: fields.text({ label: 'Level', validation: { isRequired: true } }),
        order,
      },
    }),

    contact: collection({
      label: 'Contact links',
      path: 'src/content/contact/*',
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name', 'url'],
      schema: {
        name: fields.slug({
          name: { label: 'Name', validation: { isRequired: true } },
          slug: { description: 'Stable identifier used as the file name.' },
        }),
        icon: icon('Icon'),
        url: fields.url({ label: 'Link', validation: { isRequired: true } }),
        order,
      },
    }),

    blog: collection({
      label: 'Blog',
      path: 'src/content/blog/*',
      // `extension: 'md'` keeps posts as plain Markdown so Astro reads them with
      // its native Markdown pipeline instead of requiring a Markdoc integration.
      format: { data: 'yaml', contentField: 'content' },
      slugField: 'title',
      columns: ['title', 'publishedAt'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { description: 'Used in the post URL. Keep it stable once published.' },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        publishedAt: fields.date({
          label: 'Published at',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/settings/site',
      format: { data: 'yaml' },
      schema: {
        email: fields.text({ label: 'Contact email', validation: { isRequired: true } }),
        birthDate: fields.date({
          label: 'Birth date',
          description: 'Drives the LEVEL value and the birthday progress bar.',
          validation: { isRequired: true },
        }),
        hp: fields.object(
          {
            min: fields.integer({ label: 'Min', validation: { isRequired: true } }),
            max: fields.integer({ label: 'Max', validation: { isRequired: true } }),
          },
          { label: 'HP range' },
        ),
        ap: fields.object(
          {
            min: fields.integer({ label: 'Min', validation: { isRequired: true } }),
            max: fields.integer({ label: 'Max', validation: { isRequired: true } }),
          },
          { label: 'AP range' },
        ),
      },
    }),
  },
});
