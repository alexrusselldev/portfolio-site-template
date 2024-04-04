import fs from 'fs';
import matter from 'gray-matter';

export function getParentPages() {
  let files;
  try {
    files = fs.readdirSync(`${process.cwd()}/src/content`);
  } catch (e: any) {
    if (e?.code == 'ENOENT') {
      console.log('Content directory missing.');
      process.exit(1);
    }

    console.log('Encountered an unknown error loading the template file.');
    process.exit(1);
  }

  const parents = files
    .filter((file: string) => {
      if (file == 'index.mdx') return false;
      if (file.slice(file.length - 3) != 'mdx') return false;
      return true;
    })
    .map((file: string) => {
      const contents = fs.readFileSync(`${process.cwd()}/src/content/${file}`, 'utf-8');

      console.log(contents);
      const parsed = matter(contents);

      if (parsed.data.isParent)
        return {
          name: parsed?.data?.navLabel || parsed?.data?.title || file.substring(0, file.length - 4),
          slug: file.substring(0, file.length - 4),
        };

      return false;
    })
    .filter((item) => item);

  return parents;
}
