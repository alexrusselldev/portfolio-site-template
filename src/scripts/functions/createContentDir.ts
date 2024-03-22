import fs from 'fs';

export function createContentDir(slug: string) {
  const stats = fs.statSync(`${process.cwd()}/src/content/${slug}`, { throwIfNoEntry: false });
  if (stats == undefined) {
    fs.mkdirSync(`${process.cwd()}/src/content/${slug}`);
    fs.writeFileSync(`${process.cwd()}/src/content/${slug}/example.mdx`, '# Example');
    return;
  }

  if (stats.isDirectory()) {
    fs.writeFileSync(`${process.cwd()}/src/content/${slug}/example.mdx`, '# Example');
    return;
  }

  if (stats.isFile()) {
    console.log(`Content directory "${slug}" could not be created as a file with this name already exists.`);
    process.exit(1);
  }
}
