import matter from 'gray-matter';

export function buildFile(frontmatter: Record<string, any>, properties: string[]) {
  const filteredFrontmatter: Record<string, any> = {};
  for (const property of properties) {
    if (frontmatter?.[property]) filteredFrontmatter[property] = frontmatter[property];
  }

  const file = matter.stringify(`# ${frontmatter.title}`, filteredFrontmatter);
  return file;
}
