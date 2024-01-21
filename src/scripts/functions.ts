import fs from 'fs';
import prompts, { PromptObject } from 'prompts';
import Handlebars from 'handlebars';

export function slugify(string: string): string {
  return String(string)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function loadTemplate(path: string): string {
  let template;
  try {
    template = fs.readFileSync(path);
  } catch (e: any) {
    if (e?.code == 'ENOENT') {
      console.log('Page template file missing.');
      process.exit(1);
    }

    console.log('Encountered an unknown error loading the template file.');
    process.exit(1);
  }

  return template.toString();
}

export function getExistingSlugs(path: string): string[] {
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
  const slugs = files
    .filter((file: string) => {
      if (file == 'index.mdx') return false;
      if (file.slice(file.length - 3) != 'mdx') return false;
      return true;
    })
    .map((file: string) => {
      return file.substring(0, file.length - 4);
    });

  return slugs;
}

export async function populateFrontmatter(config: PromptObject[]) {
  return await prompts(config);
}

export function buildFile(template: string, frontMatter: Record<string, any>) {
  const builder = Handlebars.compile(template);
  return builder(frontMatter);
}
