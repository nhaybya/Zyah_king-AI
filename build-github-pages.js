// Script to build the project for GitHub Pages
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Building for GitHub Pages...');

// 1. Copy GitHub Pages specific files over their originals
const filesToCopy = [
  {
    source: 'client/src/main.github.tsx',
    target: 'client/src/main.tsx'
  },
  {
    source: 'client/src/App.github.tsx',
    target: 'client/src/App.tsx'
  },
  {
    source: 'client/src/hooks/useChat.github.tsx',
    target: 'client/src/hooks/useChat.tsx'
  }
];

// Create backup of original files
console.log('Creating backups of original files...');
filesToCopy.forEach(file => {
  if (fs.existsSync(file.target)) {
    fs.copyFileSync(file.target, `${file.target}.bak`);
  }
});

// Copy GitHub Pages files
console.log('Replacing files with GitHub Pages versions...');
filesToCopy.forEach(file => {
  fs.copyFileSync(file.source, file.target);
});

try {
  // 2. Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Add GitHub Pages specific files
  console.log('Adding GitHub Pages specific files...');
  
  // Create .nojekyll file to prevent Jekyll processing
  fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
  
  // Create a 404.html file for SPA routing
  const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0;url=/" />
    <title>Redirecting...</title>
    <script>
      window.location.href = window.location.origin + 
        window.location.pathname.split('/').slice(0, -1).join('/') + '/';
    </script>
  </head>
  <body>
    <p>If you are not redirected automatically, click <a href="/">here</a>.</p>
  </body>
</html>
`;
  
  fs.writeFileSync(path.join(__dirname, 'dist', '404.html'), notFoundHtml);
  
  console.log('Build completed successfully! The "dist" folder is ready to be deployed to GitHub Pages.');
  
} finally {
  // 4. Restore original files
  console.log('Restoring original files...');
  filesToCopy.forEach(file => {
    if (fs.existsSync(`${file.target}.bak`)) {
      fs.copyFileSync(`${file.target}.bak`, file.target);
      fs.unlinkSync(`${file.target}.bak`);
    }
  });
}

// Instructions for deployment
console.log(`
NEXT STEPS TO DEPLOY TO GITHUB PAGES:

1. Create a repository on GitHub
2. Initialize and push your local repository:
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main

3. In your GitHub repository settings, enable GitHub Pages:
   - Go to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select branch "gh-pages" and folder "/ (root)"
   - Click Save

4. For automatic deployment:
   - Push your changes to the main branch
   - The GitHub Actions workflow will build and deploy to gh-pages automatically

Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO/
`);