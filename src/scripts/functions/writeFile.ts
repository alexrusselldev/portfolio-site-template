import fs, { PathOrFileDescriptor } from 'fs';

export function writeFile(path: PathOrFileDescriptor, data: string) {
  fs.writeFileSync(path, data);
}
