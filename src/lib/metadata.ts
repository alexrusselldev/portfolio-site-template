import { Metadata } from 'next';
import { readMDX } from './mdx';
import { defaultMetadata } from '@/cfg/metadata';

export const getMetadataFromMDX: (path: string) => Promise<Metadata> = async (path) => {
  const content = await readMDX(path);

  const title = (content?.frontmatter?.title as string) || defaultMetadata.title;
  const description = (content?.frontmatter?.description as string) || defaultMetadata.description;

  return {
    title,
    description,
  };
};
