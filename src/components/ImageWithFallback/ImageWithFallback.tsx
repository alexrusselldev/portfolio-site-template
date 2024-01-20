'use client';

import { useState } from 'react';
import Image from 'next/image';

interface IBlogCardImageProps {
  src: string;
  alt: string;
}

const BlogCardImage: React.FC<IBlogCardImageProps> = (props) => {
  const { src, alt } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      alt={alt}
      width={600}
      height={400}
      src={imgSrc}
      onError={() => {
        setImgSrc('https://placehold.co/400x400.webp');
      }}
    />
  );
};

export default BlogCardImage;
