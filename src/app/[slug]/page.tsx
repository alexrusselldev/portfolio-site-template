import { MDXRemoteWrapper } from '@/components/MDXRemoteWrapper';
import { Metadata, NextPage } from 'next';
import { getPathsFromDir, readMDX } from '@/lib/mdx';
import { getMetadataFromMDX } from '@/lib/metadata';

interface IProps {
  params: {
    slug: string;
  };
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { slug } = params;
  const content = await readMDX(`${process.cwd()}/src/content/${slug}.mdx`);

  return <MDXRemoteWrapper {...content} />;
};

export async function generateStaticParams() {
  const params = getPathsFromDir(`${process.cwd()}/src/content/`);
  return params;
}

export const generateMetadata: ({ params }: IProps) => Promise<Metadata> = async ({ params }) => {
  return await getMetadataFromMDX(`${process.cwd()}/src/content/${params.slug}.mdx`);
};

export default Page;
