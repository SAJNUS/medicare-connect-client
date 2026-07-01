const fs = require('fs');

function restoreFile(filePath) {
  const headContent = require('child_process').execSync('git show HEAD:' + filePath).toString();
  const corrupted = fs.readFileSync(filePath, 'utf8');

  // I will just git checkout the file, and then manually apply the 5 lines of changes!
}
