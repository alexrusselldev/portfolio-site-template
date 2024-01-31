import { MDXRemoteWrapper } from '@/components/MDXRemoteWrapper';
import { Metadata, NextPage } from 'next';
import { readMDX } from '@/lib/mdx';
import { getMetadataFromMDX } from '@/lib/metadata';

interface IProps {}

const Home: NextPage<IProps> = async () => {
  const content = await readMDX(`${process.cwd()}/src/content/index.mdx`);

  return (
    <>
      <MDXRemoteWrapper {...content} />
    </>
  );
};

export const generateMetadata = async (): Promise<Metadata> => {
  return await getMetadataFromMDX(`${process.cwd()}/src/content/index.mdx`);
};

export default Home;

export const dynamic = 'error';
