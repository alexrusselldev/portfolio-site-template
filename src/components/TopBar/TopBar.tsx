import { MDXRemoteProps } from 'next-mdx-remote';
import { Navigation } from '../Navigation/Navigation';
import { getPathsFromDir, readMDX } from '@/lib/mdx';
import { MobileNavigation } from '../MobileNavigation';

export interface IPageNavData {
  slug: string;
  content: MDXRemoteProps;
}

interface IProps {}

export const TopBar: React.FC<IProps> = async () => {
  const allPagesSlugs = await getPathsFromDir(`${process.cwd()}/src/content/`);

  allPagesSlugs.push({ slug: 'index' });

  const allPagesData: IPageNavData[] = await Promise.all(
    allPagesSlugs.map(async (post) => {
      return {
        slug: post.slug,
        content: await readMDX(`${process.cwd()}/src/content/${post.slug}.mdx`),
      };
    }),
  );

  allPagesData.sort((a, b) => {
    if (a?.content?.frontmatter?.navOrder == undefined && b?.content?.frontmatter?.navOrder == undefined) {
      return 0;
    }

    if (a?.content?.frontmatter?.navOrder == undefined) {
      return 1;
    }
    if (b?.content?.frontmatter?.navOrder == undefined) {
      return 1;
    }

    if (a.content.frontmatter.navOrder > b.content.frontmatter.navOrder) {
      return 1;
    }

    if (a.content.frontmatter.navOrder < b.content.frontmatter.navOrder) {
      return -1;
    }

    return 0;
  });

  return (
    <div className="sticky mx-auto w-full">
      <Navigation pages={allPagesData} />
      <MobileNavigation pages={allPagesData} />
    </div>
  );
};
