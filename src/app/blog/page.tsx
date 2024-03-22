import { MDXRemoteWrapper } from '@/components/MDXRemoteWrapper';
import { NextPage } from 'next';
import { getPathsFromDir, readMDX } from '@/lib/mdx';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { Metadata } from 'next';
import { getMetadataFromMDX } from '@/lib/metadata';

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
      <div className="mx-auto max-w-md sm:max-w-xl md:max-w-3xl">
        <ul className="flex grid-cols-2 flex-col gap-4 sm:grid md:grid-cols-3">
          {allPostsData.map(({ slug, content }) => {
            return (
              <li key={slug}>
                <Link href={`/blog/${slug}`} className="flex flex-col items-center">
                  <ImageWithFallback
                    src={`/images/blog-thumbnails/${slug}.png`}
                    alt={(content?.frontmatter?.thumbnailAlt as string) || `${slug} thumbnail`}
                  />
                  <span className="text-xl">{(content?.frontmatter?.title as string) || 'Untitled'}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export const generateMetadata = async (): Promise<Metadata> => {
  return await getMetadataFromMDX(`${process.cwd()}/src/content/blog.mdx`);
};

export default Page;

export const dynamic = 'error';
