import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { promises as fs } from 'fs';

const readMDX: (path: string) => Promise<MDXRemoteProps> = async (path) => {
  const readContent: string | { error: true; code: string } = await fs.readFile(path, 'utf-8').catch((error) => {
    return { error: true, code: error.code };
  });

  if (typeof readContent != 'string' && readContent.code == 'ENOENT') {
    if (readContent.code == 'ENOENT') notFound();
  }

  return await serialize(readContent, { parseFrontmatter: true });
};

const getPathsFromDir: (path: string) => Promise<{ slug: string }[]> = async (path) => {
  const files = await fs.readdir(path);
  const returnValue = files
    .filter((file: string) => {
      if (file == 'index.mdx') return false;
      if (file.slice(file.length - 3) != 'mdx') return false;
      return true;
    })
    .map((file: string) => {
      return { slug: file.substring(0, file.length - 4) };
    });

  return returnValue;
};

export { readMDX, getPathsFromDir };
