// Script to prepare the project for GitHub Pages deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Building app for GitHub Pages...');

// Build the frontend only
execSync('vite build', { stdio: 'inherit' });

// Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');

// Create a simple 404.html that redirects to index.html
const notFoundHTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0;url=/" />
    <title>Redirecting...</title>
    <script>
      // Also try to use history API for better UX 
      window.location.href = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/';
    </script>
  </head>
  <body>
    <p>If you are not redirected automatically, click <a href="/">here</a>.</p>
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'dist', '404.html'), notFoundHTML);

// Create empty assets folder if it doesn't exist (for static files)
const assetsDir = path.join(__dirname, 'dist', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('Build completed successfully!');
console.log('You can now deploy the "dist" folder to GitHub Pages.');