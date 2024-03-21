import { Bars3 } from '../Icons';
import { IPageNavData } from '../TopBar';
import Link from 'next/link';

interface IProps {
  pages: IPageNavData[];
}

export const MobileNavigation: React.FC<IProps> = (props) => {
  const { pages } = props;

  return (
    <nav className="sm:hidden">
      <button>
        <Bars3 />
      </button>
      <div>
        <ul>
          {pages.map(({ slug, content }) => {
            if (!content?.frontmatter?.showInNav) return null;
            return (
              <li key={slug}>
                <Link href={`/${slug}`}>{(content?.frontmatter?.navLabel as string) || slug}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
