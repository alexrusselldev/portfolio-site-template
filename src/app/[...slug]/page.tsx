import { MDXRemoteWrapper } from '@/components/MDXRemoteWrapper';
import { Metadata, NextPage } from 'next';
import { getPathsFromDir, readMDX } from '@/lib/mdx';
import { getMetadataFromMDX } from '@/lib/metadata';
import { promises as fs } from 'fs';

interface IProps {
  params: {
    slug: string;
  };
}

interface IParam {
  slug: string[];
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { slug } = params;

  let fullSlug = slug[0];
  if (slug.length == 2) fullSlug += `/${slug[1]}`;
  fullSlug += '.mdx';

  const content = await readMDX(`${process.cwd()}/src/content/${fullSlug}`);

  return <MDXRemoteWrapper {...content} />;
};

export async function generateStaticParams() {
  const params: IParam[] = [];
  const topLevelPaths = await fs.readdir(`${process.cwd()}/src/content/`);
  const topLevelPages = await Promise.all(
    topLevelPaths
      .filter((file: string) => {
        if (file == 'index.mdx') return false;
        if (file.slice(file.length - 3) != 'mdx') return false;
        return true;
      })
      .map(async (file: string) => {
        params.push({ slug: [file.substring(0, file.length - 4)] });
        return {
          slug: file.substring(0, file.length - 4),
          content: await readMDX(`${process.cwd()}/src/content/${file}`),
        };
      }),
  );

  if (!topLevelPages) return params;

  const parentPages = topLevelPages.filter((page) => {
    return page.content?.frontmatter?.isParent;
  });

  for (const page of parentPages) {
    const children = await getPathsFromDir(`${process.cwd()}/src/content/${page.slug}`);

    for (const child of children) {
      params.push({ slug: [page.slug, child.slug] });
    }
  }

  return params;
}

export const generateMetadata: ({ params }: IProps) => Promise<Metadata> = async ({ params }) => {
  const { slug } = params;

  let fullSlug = slug[0];
  if (slug.length == 2) fullSlug += `/${slug[1]}`;
  fullSlug += '.mdx';

  return await getMetadataFromMDX(`${process.cwd()}/src/content/${fullSlug}`);
};

export default Page;
