'use client';
import { useState, useEffect } from 'react';
import { Bars3 } from '../Icons';
import { IPageNavData } from '../TopBar';
import Link from 'next/link';
import classNames from 'classnames';

interface IProps {
  pages: IPageNavData[];
}

export const MobileNavigation: React.FC<IProps> = (props) => {
  const { pages } = props;

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyPress);
    return () => window.removeEventListener('keydown', onKeyPress);
  }, [open]);

  return (
    <nav className="sm:hidden container flex flex-row justify-end p-4">
      <button
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Bars3 />
      </button>

      <div
        className={classNames(
          'fixed inset-0 z-10 p-8 text-white bg-gray-600/90 flex items-center justify-center',
          `${open ? 'block' : 'hidden'}`, // control visibility via `open` attribute (or render conditionally)
        )}
      >
        <div className="bg-black max-w-sm p-10 rounded absolute">
          <button
            className="absolute -top-2 -right-2 flex justify-center rounded-full h-8 w-8 bg-gray-800 cursor-pointer "
            onClick={() => setOpen(false)}
            title="Close Menu"
          >
            <span className="text-2xl leading-7 select-none">&times;</span>
          </button>
          <ul className="flex flex-col gap-8">
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
      </div>
    </nav>
  );
};
