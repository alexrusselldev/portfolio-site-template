import { MDXRemoteWrapper } from '@/components/MDXRemoteWrapper';
import { NextPage } from 'next';
import { getPathsFromDir, readMDX } from '@/lib/mdx';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Metadata } from 'next';
import { getMetadataFromMDX } from '@/lib/metadata';
import { CardGrid } from '@/components/CardGrid';

interface IProps {}

const Page: NextPage<IProps> = async () => {
  const content = await readMDX(`${process.cwd()}/src/content/blog.mdx`);

  const allPostsSlugs = await getPathsFromDir(`${process.cwd()}/src/content/blog/`);

  const allPostsData = await Promise.all(
    allPostsSlugs.map(async (post) => {
      return {
        slug: post.slug,
        content: await readMDX(`${process.cwd()}/src/content/blog/${post.slug}.mdx`),
      };
    }),
  );

  return (
    <>
      <MDXRemoteWrapper {...content} />
      <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
      <CardGrid items={allPostsData} />
    </>
  );
};

export const generateMetadata = async (): Promise<Metadata> => {
  return await getMetadataFromMDX(`${process.cwd()}/src/content/blog.mdx`);
};

export default Page;

export const dynamic = 'error';
