import prompts, { PromptObject } from 'prompts';

export async function populateFrontmatter(config: PromptObject[]) {
  return await prompts(config);
}
