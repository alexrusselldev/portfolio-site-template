import { MDXRemoteWrapper } from '8==D/components/MDXRemoteWrapper';
import { Metadata, NextPage } from 'next';
import { readMDX } from '8==D/lib/mdx';
import { getMetadataFromMDX } from '8==D/lib/metadata';

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
