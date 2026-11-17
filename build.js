// Copies the site into dist/ (for GitHub Actions deployments that publish dist/). No dependencies.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const FILES = ['index.html', 'experiment.js', 'style.css', 'tailwind.css', '.nojekyll', 'vendor'];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      copyRecursive(path.join(src, entry.name), path.join(dest, entry.name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

for (const f of FILES) {
  const src = path.join(ROOT, f);
  const dest = path.join(DIST, f);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
  }
}

console.log('Готово: dist/');
