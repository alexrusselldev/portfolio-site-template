import { loadTemplate, getExistingSlugs, slugify, populateFrontmatter, buildFile, writeFile } from './functions';
import { PromptObject } from 'prompts';

const pageConfig: PromptObject[] = [
  {
    type: 'text',
    name: 'title',
    message: 'Please enter a title for this page.',
    validate: (value) => {
      return value.length > 0 || 'Please enter a title.';
    },
  },
  {
    type: 'text',
    name: 'slug',
    message: 'Please enter a slug for this page.',
    initial: (_prev, values) => {
      return slugify(values.title);
    },
    validate: (value) => {
      const empty = value.length == 0;
      const kebabCase = /^([a-z](?![\d])|[\d](?![a-z]))+(-?([a-z](?![\d])|[\d](?![a-z])))*$|^$/.test(value);
      const slugExists = getExistingSlugs(`${process.cwd()}/src/content/blog`).includes(value);

      if (empty) return 'Please enter a slug.';
      if (!kebabCase) return 'Slugs must be kebab case.';
      if (slugExists) return `Slug ${value} already exists.`;

      return true;
    },
  },
  {
    type: 'text',
    name: 'description',
    message: 'Please enter a description for this page.',
  },
  {
    type: 'toggle',
    name: 'showInNav',
    message: 'Would you like this page to be shown in the navbar?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_prev, values) => {
      if (!values.showInNav) return false;
      return 'text';
    },
    initial: (_prev, values) => {
      return values.title;
    },
    name: 'navLabel',
    message: 'Enter a label for when this page is shown on the navbar.',
  },
  {
    type: (_prev, values) => {
      if (!values.showInNav) return false;
      return 'number';
    },
    name: 'navOrder',
    message: 'What position would you like this item to be in the nav?',
    hint: 'Positive int. Null entries get sorted last.',
    validate: (value: number) => {
      const isInteger = Number.isInteger(value);
      const isPositive = value > 0;

      if (!isInteger) return 'Please enter a whole number.';
      if (!isPositive) return 'Please enter a positive number.';
      return true;
    },
  },
];

async function script() {
  const template = loadTemplate(`${process.cwd()}/src/templates/page.hbs`);
  const frontMatter = await populateFrontmatter(pageConfig);
  const file = buildFile(template, frontMatter);
  writeFile(`${process.cwd()}/src/content/${frontMatter.slug}.mdx`, file);
}

script();
