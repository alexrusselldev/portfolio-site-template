import fs from 'fs';
import { buildFile, writeFile } from '.';

export function createContentDir(slug: string) {
  const stats = fs.statSync(`${process.cwd()}/src/content/${slug}`, { throwIfNoEntry: false });
  const example = buildFile({ title: 'Example', description: 'An example post.' }, ['title', 'description']);

  if (stats == undefined) {
    fs.mkdirSync(`${process.cwd()}/src/content/${slug}`);
    writeFile(`${process.cwd()}/src/content/${slug}/example.mdx`, example);
    return;
  }

  if (stats.isDirectory()) {
    writeFile(`${process.cwd()}/src/content/${slug}/example.mdx`, example);
    return;
  }

  if (stats.isFile()) {
    console.log(`Content directory "${slug}" could not be created as a file with this name already exists.`);
    process.exit(1);
  }
}
