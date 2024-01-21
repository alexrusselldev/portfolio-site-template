import fs, { PathLike } from 'fs';

export function getExistingSlugs(path: PathLike): string[] {
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
