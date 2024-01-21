import fs, { PathOrFileDescriptor } from 'fs';

export function loadTemplate(path: PathOrFileDescriptor): string {
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
