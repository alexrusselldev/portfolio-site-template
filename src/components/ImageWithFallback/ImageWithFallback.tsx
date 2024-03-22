'use client';

import { useState } from 'react';
import Image from 'next/image';

interface IProps {
  src: string;
  alt: string;
}

export const ImageWithFallback: React.FC<IProps> = (props) => {
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
