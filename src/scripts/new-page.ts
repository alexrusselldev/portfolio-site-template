const fs = require('fs');
const promptSync = require('prompt-sync')();

function loadTemplate(path: string) {
  let template;
  try {
    template = fs.readFileSync(path);
  } catch (e: any) {
    if (e?.code == 'ENOENT') {
      console.log('Page template file missing.');
      process.exit(1);
    }

    console.log('Encountered an unknown error loading the template file.');
    process.exit(1);
  }

  return template;
}

function getExistingSlugs(path: string): string[] {
  let files;
  try {
    files = fs.readdirSync(path);
  } catch (e: any) {
    if (e?.code == 'ENOENT') {
      console.log('Content directory missing.');
      process.exit(1);
    }

    console.log('Encountered an unknown error loading the template file.');
    process.exit(1);
  }
  const returnValue = files
    .filter((file: string) => {
      if (file == 'index.mdx') return false;
      if (file.slice(file.length - 3) != 'mdx') return false;
      return true;
    })
    .map((file: string) => {
      return file.substring(0, file.length - 4);
    });

  return returnValue;
}

function populateFrontmatter() {
  const frontMatter: Record<string, any> = {
    slug: 'Enter a slug for this page',
    title: 'Enter a title for this page',
    description: 'Enter a description for this page.',
    showInNav: 'Would you like this page to be shown in the navbar?',
    navLabel: 'Enter a label to be shown on the navbar.',
    navOrder: 'Where would you like to place this page in the navbar?',
  };

  for (const [key, value] of Object.entries(frontMatter)) {
    const promptText = value;
    let valid = false;

    while (!valid) {
      const entry = promptSync(promptText);

      if (entry) {
        frontMatter[key] = String(entry);
        valid = true;
      }
    }
  }
}

const template = loadTemplate(`${process.cwd()}/src/templates/page.hbs`);
const existingPages = getExistingSlugs(`${process.cwd()}/src/content`);
console.log(existingPages);
