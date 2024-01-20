const fs = require('fs');

function loadTemplate() {
  let template;
  try {
    template = fs.readFileSync(`${process.cwd()}/src/templates/page.hbs`);
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

const template = loadTemplate();
console.log(template);
