import { readdirSync } from 'fs';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const rootDir = readdirSync(`${process.cwd()}/src/content`);
  const rootPages = [
    '',
    ...rootDir
      .filter((file: string) => {
        if (file == 'index.mdx') return false;
        if (file.slice(file.length - 3) != 'mdx') return false;
        return true;
      })
      .map((file: string) => {
        return file.substring(0, file.length - 4);
      }),
  ];
  const rootPagesObjects: MetadataRoute.Sitemap = rootPages.map((slug: string) => {
    return {
      url: `https://${process.env.SITE_DOMAIN}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: slug == '' ? 1 : 0.8,
    };
  });

  const blogDir = readdirSync(`${process.cwd()}/src/content/blog`);
  const blogPages = blogDir
    .filter((file: string) => {
      if (file.slice(file.length - 3) != 'mdx') return false;
      return true;
    })
    .map((file: string) => {
      return file.substring(0, file.length - 4);
    });
  const blogPagesObjects: MetadataRoute.Sitemap = blogPages.map((slug: string) => {
    return {
      url: `https://${process.env.SITE_DOMAIN}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [...rootPagesObjects, ...blogPagesObjects];
}
