import Link from 'next/link';
import { getPathsFromDir, readMDX } from '@/lib/mdx';

interface IProps {}
export const Navigation: React.FC<IProps> = async () => {
  const allPagesSlugs = await getPathsFromDir(`${process.cwd()}/src/content/`);

  allPagesSlugs.push({ slug: 'index' });

  const allPagesData = await Promise.all(
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
    <nav className="sticky mx-auto w-full">
      <ul className="container flex flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:gap-4">
        {allPagesData.map(({ slug, content }) => {
          if (!content?.frontmatter?.showInNav) return null;
          return (
            <li key={slug}>
              <Link href={`/${slug}`}>{(content?.frontmatter?.navLabel as string) || slug}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
