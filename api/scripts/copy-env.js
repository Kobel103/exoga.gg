const fs = require('fs');
const path = require('path');

// Create dist/env directory if it doesn't exist
const distEnvDir = path.join(__dirname, '..', 'dist', 'env');
if (!fs.existsSync(distEnvDir)) {
  fs.mkdirSync(distEnvDir, { recursive: true });
}

// Source directory
const srcEnvDir = path.join(__dirname, '..', 'src', 'env');

// Read all files from src/env
const files = fs.readdirSync(srcEnvDir);

// Copy each file
files.forEach((file) => {
  const srcFile = path.join(srcEnvDir, file);
  const destFile = path.join(distEnvDir, file);

  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file} to dist/env/`);
  }
});

console.log('Environment files copied successfully!');
