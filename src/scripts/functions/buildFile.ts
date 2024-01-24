import matter from 'gray-matter';

export function buildFile(frontMatter: Record<string, any>, properties: string[]) {
  const filteredFrontmatter: Record<string, any> = {};
  for (const property of properties) {
    if (frontMatter?.[property]) filteredFrontmatter[property] = frontMatter[property];
  }

  const file = matter.stringify(`# ${frontMatter.title}`, filteredFrontmatter);
  return file;
}
