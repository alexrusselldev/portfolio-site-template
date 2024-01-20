'use client';

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';

export const MDXRemoteWrapper: React.FC<MDXRemoteProps> = (props) => {
  return (
    <div className="container prose px-10 dark:prose-invert sm:px-5 md:px-0">
      <MDXRemote {...props} />
    </div>
  );
};
