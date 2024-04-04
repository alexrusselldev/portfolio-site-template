import fs, { PathLike } from 'fs';
import matter from 'gray-matter';

export async function getNavOrder(path: PathLike) {
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

  const frontmatter = await Promise.all(
    fileNames.map(async (fileName) => {
      const file = matter.read(`${path}/${fileName}`);
      if (file.data) {
        return {
          fileName,
          frontmatter: file.data,
        };
      }
      return file?.data || null;
    }),
  );

  const navOrder = frontmatter
    .filter((file) => {
      return file?.frontmatter?.navOrder;
    })
    .sort((a, b) => {
      if (a?.frontmatter?.navOrder == undefined && b?.frontmatter?.navOrder == undefined) {
        return 0;
      }

      if (a?.frontmatter?.navOrder == undefined) {
        return 1;
      }
      if (b?.frontmatter?.navOrder == undefined) {
        return 1;
      }

      if (a.frontmatter.navOrder > b.frontmatter.navOrder) {
        return 1;
      }

      if (a.frontmatter.navOrder < b.frontmatter.navOrder) {
        return -1;
      }

      return 0;
    })
    .map((file) => {
      return file.fileName;
    });

  return navOrder;
}

export function writeNavOrder(dir: PathLike, filenames: string[]) {
  filenames.forEach((filename, index) => {
    const file = matter.read(`${dir}${filename}`);
    file.data.navOrder = index + 1;

    const updatedContent = matter.stringify(file.content, file.data);

    fs.writeFileSync(`${dir}${filename}`, updatedContent);
  });
}
