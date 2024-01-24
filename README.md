# Next.js mdx site template

This repository is deployed on Vercel at [next-mdx-site.vercel.app](https://next-mdx-site.vercel.app)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This repo is a template for building simple static Next.js sites. The content is driven by mdx files located in this repository and content editing is supported by custom scripts.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Useful documentation

- [Next.js](https://nextjs.org/docs)
- [devmoji](https://github.com/folke/devmoji)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [tailwindcss](https://tailwindcss.com/docs/installation)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)

## Scripts

This template comes with some scripts setup for content management. These scripts can all be run with `npm run [script name]`.

Scripts are located in the src/scripts directory.

#### `new:page`

The new page script launches an interactive prompt to gather the necessary frontmatter and then generates a new mdx document in the src/content directory.

This script automatically ensures there are no slug conflicts and updates relevant config across all page content files.

#### `new-post`

The new post script launches an interactive prompt to gather the necessary frontmatter and then generates a new mdx document in the src/content/blog directory.

This script automatically ensures there are no slug conflicts.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
