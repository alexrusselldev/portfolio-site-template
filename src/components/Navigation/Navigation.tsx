import Link from 'next/link';
import { IPageNavData } from '../TopBar';

interface IProps {
  pages: IPageNavData[];
}

export const Navigation: React.FC<IProps> = async (props) => {
  const { pages } = props;

  return (
    <nav role="navigation">
      <ul className="container flex flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:gap-4">
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
