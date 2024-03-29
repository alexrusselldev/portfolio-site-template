import { getExistingSlugs, slugify, populateFrontmatter, buildFile, writeFile } from './functions';
import { PromptObject } from 'prompts';
import fs, { PathLike } from 'fs';

const pageConfig: PromptObject[] = [
  {
    type: 'text',
    name: 'title',
    message: 'Please enter a title for this post.',
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
    message: 'Please enter a description for this post.',
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
    message: 'Please enter a path for your file.',
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

function createThumbnail(source: PathLike, destination: PathLike) {
  fs.copyFileSync(source, destination);
}

async function script() {
  const frontMatter = await populateFrontmatter(pageConfig);
  if (!frontMatter.slug || frontMatter.slug == '') return;

  const file = buildFile(frontMatter, ['title', 'description', 'postTitle', 'thumbnailAlt']);
  if (frontMatter.addThumbnail && frontMatter?.thumbnailPath) {
    createThumbnail(
      frontMatter.thumbnailPath,
      `${process.cwd()}/public/images/blog-thumbnails/${frontMatter.slug}.${frontMatter.thumbnailPath.split('.').pop()}`,
    );
  }
  writeFile(`${process.cwd()}/src/content/blog/${frontMatter.slug}.mdx`, file);
}

script();
