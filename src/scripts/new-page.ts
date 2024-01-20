const fs = require('fs');

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

const template = loadTemplate(`${process.cwd()}/src/templates/page.hbs`);
const existingPages = getExistingSlugs(`${process.cwd()}/src/content`);
console.log(existingPages);
