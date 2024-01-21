import Handlebars from 'handlebars';

export function buildFile(template: string, frontMatter: Record<string, any>) {
  const builder = Handlebars.compile(template);
  return builder(frontMatter);
}
