import { loadTemplate, getExistingSlugs, slugify, populateFrontmatter, buildFile, writeFile } from './functions';
import { PromptObject } from 'prompts';
import fs from 'fs';

const pageConfig: PromptObject[] = [
  {
    type: 'text',
    name: 'title',
    message: 'Please enter a title for this post',
    validate: (value) => {
      return value.length > 0 || 'Please enter a title.';
    },
  },
  {
    type: 'text',
    name: 'slug',
    message: 'Please enter a slug for this post.',
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
    message: 'Please enter a description for this post',
  },
  {
    name: 'addThumbnail',
    type: 'toggle',
    message: 'Would you like us to automatically add a thumbnail to your post?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_prev, values) => {
      if (!values?.addThumbnail) return false;
      return 'text';
    },
    name: 'thumbnailPath',
    message: 'Please enter a path for your file',
    validate: (value) => {
      const exists = fs.existsSync(value);

      if (!exists) return 'Please enter a valid file path.';
      return true;
    },
  },
  {
    type: (_prev, values) => {
      if (!values?.addThumbnail) return false;
      return 'text';
    },
    name: 'thumbnailAlt',
    message: 'Please enter alt text for this posts thumbnail.',
  },
];

async function script() {
  const template = loadTemplate(`${process.cwd()}/src/templates/blog.hbs`);
  const frontMatter = await populateFrontmatter(pageConfig);
  if (!frontMatter.slug || frontMatter.slug == '') return;

  const file = buildFile(template, frontMatter);
  writeFile(`${process.cwd()}/src/content/blog/${frontMatter.slug}.mdx`, file);
}

script();
