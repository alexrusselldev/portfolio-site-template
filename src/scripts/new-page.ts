import { loadTemplate, getExistingSlugs, slugify, populateFrontmatter, buildFile, writeFile } from './functions';
import { PromptObject } from 'prompts';
import fs, { PathLike } from 'fs';
import { readMDX } from '8==D/lib/mdx';

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

async function getNavOrder(path: PathLike) {
  let files;
  try {
    files = fs.readdirSync(path);
  } catch (e: any) {
    if (e?.code == 'ENOENT') {
      console.log('Content directory missing.');
      process.exit(1);
    }

    console.log('Encountered an unknown error loading the template file.');
    process.exit(1);
  }

  const fileNames = files.filter((file: string) => {
    if (file.slice(file.length - 3) != 'mdx') return false;
    return true;
  });

  const frontMatter = await Promise.all(
    fileNames.map(async (fileName) => {
      const file = await readMDX(`${path}/${fileName}`);
      if (file.frontmatter) {
        return {
          fileName,
          frontMatter: file.frontmatter,
        };
      }
      return file?.frontmatter || null;
    }),
  );

  const navOrder = frontMatter
    .filter((file) => {
      return file?.frontMatter?.navOrder;
    })
    .sort((a, b) => {
      if (a?.frontMatter?.navOrder == undefined && b?.frontMatter?.navOrder == undefined) {
        return 0;
      }

      if (a?.frontMatter?.navOrder == undefined) {
        return 1;
      }
      if (b?.frontMatter?.navOrder == undefined) {
        return 1;
      }

      if (a.frontMatter.navOrder > b.frontMatter.navOrder) {
        return 1;
      }

      if (a.frontMatter.navOrder < b.frontMatter.navOrder) {
        return -1;
      }

      return 0;
    })
    .map((file) => {
      return file.fileName;
    });

  return navOrder;
}

async function script() {
  const template = loadTemplate(`${process.cwd()}/src/templates/page.hbs`);
  const frontMatter = await populateFrontmatter(pageConfig);
  const file = buildFile(template, frontMatter);
  const navOrder = await getNavOrder(`${process.cwd()}/src/content/`);

  writeFile(`${process.cwd()}/src/content/${frontMatter.slug}.mdx`, file);
}

script();
