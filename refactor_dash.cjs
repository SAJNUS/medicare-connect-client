const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 1. Run git restore to get the layout back to original
const { execSync } = require('child_process');
execSync('git restore src/pages/Dashboard/**/*.jsx');
console.log("Restored original layouts.");

// 2. Re-apply the active tab styles to ALL dashboards
walkDir('src/pages/Dashboard', (file) => {
  if (!file.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Rule 3: Standardize filter tabs
  content = content.replace(/\? "bg-primary text-white shadow-md shadow-primary\/20"/g, '? "bg-gray-900 text-white shadow-md shadow-gray-900/20"');
  content = content.replace(/\? 'bg-primary text-white'/g, "? 'bg-gray-900 text-white'");
  content = content.replace(/\? "bg-primary text-white"/g, '? "bg-gray-900 text-white"');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Updated active state in", file);
  }
});
