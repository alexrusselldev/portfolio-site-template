import { MDXRemoteWrapper } from '@/components/MDXRemoteWrapper';
import { NextPage } from 'next';
import { getPathsFromDir, readMDX } from '@/lib/mdx';
import { Metadata } from 'next';
import { getMetadataFromMDX } from '@/lib/metadata';

interface IProps {
  params: {
    slug: string;
  };
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { slug } = params;
  const content = await readMDX(`${process.cwd()}/src/content/blog/${slug}.mdx`);

  return <MDXRemoteWrapper {...content} />;
};

export async function generateStaticParams() {
  const params = getPathsFromDir(`${process.cwd()}/src/content/blog/`);
  return params;
}

export const generateMetadata: ({ params }: IProps) => Promise<Metadata> = async ({ params }) => {
  return await getMetadataFromMDX(`${process.cwd()}/src/content/blog/${params.slug}.mdx`);
};

export default Page;
