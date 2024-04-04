import {
  getExistingSlugs,
  slugify,
  populateFrontmatter,
  buildFile,
  writeFile,
  createContentDir,
  getNavOrder,
  writeNavOrder,
} from './functions';
import { PromptObject } from 'prompts';
import fs, { PathLike } from 'fs';
import matter from 'gray-matter';

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
  {
    type: 'toggle',
    name: 'isParent',
    message: 'Would you like to be able to add posts to this page?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
];

async function script() {
  const frontmatter = await populateFrontmatter(pageConfig);

  if (frontmatter?.isParent) {
    createContentDir(frontmatter.slug);
  }

  const file = buildFile(frontmatter, ['title', 'description', 'showInNav', 'navLabel', 'navOrder', 'isParent']);
  writeFile(`${process.cwd()}/src/content/${frontmatter.slug}.mdx`, file);

  if (frontmatter.showInNav) {
    const navOrder = await getNavOrder(`${process.cwd()}/src/content/`);

    navOrder.splice(frontmatter.navOrder - 1, 0, `${frontmatter.slug}.mdx`);

    writeNavOrder(`${process.cwd()}/src/content/`, navOrder);
  }
}

script();
