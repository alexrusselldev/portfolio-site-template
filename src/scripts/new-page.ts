import { loadTemplate, getExistingSlugs, slugify, populateFrontmatter } from './functions';
import { ReadLine } from 'readline';
import { PromptObject } from 'prompts';

const pageConfig: PromptObject[] = [
  {
    type: 'text',
    name: 'title',
    message: 'Please enter a title for this page',
  },
  {
    type: 'text',
    name: 'slug',
    message: 'Please enter a slug for this page.',
    initial: (_prev, values) => {
      return slugify(values.title);
    },
    validate: (value) => {
      const kebabCase = /^([a-z](?![\d])|[\d](?![a-z]))+(-?([a-z](?![\d])|[\d](?![a-z])))*$|^$/.test(value);
      const slugExists = getExistingSlugs(`${process.cwd()}/src/content`).includes(value);

      if (!kebabCase) return 'Slugs must be kebab case.';
      if (slugExists) return `Slug ${value} already exists.`;

      return true;
    },
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
      console.log(value);
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
  const frontMattter = await populateFrontmatter(pageConfig);

  console.log(frontMattter);
}

script();
