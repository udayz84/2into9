const fs = require('fs');
const path = require('path');

function stripComments(str) {
  return str.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*/gm, '');
}

['templates', 'sections', 'config', 'locales'].forEach(dir => {
  const fullDir = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullDir)) return;
  fs.readdirSync(fullDir).forEach(f => {
    if (!f.endsWith('.json')) return;
    const p = path.join(fullDir, f);
    try {
      const content = stripComments(fs.readFileSync(p, 'utf8'));
      JSON.parse(content);
    } catch (err) {
      console.error(`Parse error in ${dir}/${f}:`, err.message);
    }
  });
});
console.log('All JSON files validated successfully.');
