import { MDXRemoteProps } from 'next-mdx-remote';
import { ImageWithFallback } from '../ImageWithFallback';
import Link from 'next/link';

interface IProps {
  items: {
    slug: string;
    content: MDXRemoteProps;
  }[];
}

export const CardGrid: React.FC<IProps> = (props) => {
  const { items } = props;
  return (
    <div className="mx-auto max-w-md sm:max-w-xl md:max-w-3xl">
      <ul className="flex grid-cols-2 flex-col gap-4 sm:grid md:grid-cols-3">
        {items.map(({ slug, content }) => {
          return (
            <li key={slug}>
              <Link href={`/blog/${slug}`} className="flex flex-col items-center">
                <ImageWithFallback
                  src={`/images/blog-thumbnails/${slug}.png`}
                  alt={(content?.frontmatter?.thumbnailAlt as string) || `${slug} thumbnail`}
                />
                <span className="text-xl">{(content?.frontmatter?.title as string) || 'Untitled'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
