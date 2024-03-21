import Link from 'next/link';
import { IPageNavData } from '../TopBar';

interface IProps {
  pages: IPageNavData[];
}

export const Navigation: React.FC<IProps> = async (props) => {
  const { pages } = props;

  return (
    <nav role="navigation" className="hidden sm:block">
      <ul className="container flex  items-center justify-center gap-4 py-4">
        {pages.map(({ slug, content }) => {
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
