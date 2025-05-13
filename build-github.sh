#!/bin/bash

# Script to build the project for GitHub Pages

echo "Building for GitHub Pages..."

# 1. Backup original files
echo "Creating backups of original files..."
cp client/src/main.tsx client/src/main.tsx.bak
cp client/src/App.tsx client/src/App.tsx.bak
cp client/src/hooks/useChat.tsx client/src/hooks/useChat.tsx.bak

# 2. Copy GitHub Pages specific files
echo "Replacing files with GitHub Pages versions..."
cp client/src/main.github.tsx client/src/main.tsx
cp client/src/App.github.tsx client/src/App.tsx
cp client/src/hooks/useChat.github.tsx client/src/hooks/useChat.tsx

# 3. Run the build
echo "Running build..."
npm run build

# 4. Add GitHub Pages specific files
echo "Adding GitHub Pages specific files..."

# Create .nojekyll file to prevent Jekyll processing
touch dist/.nojekyll

# Create a 404.html file for SPA routing
cat > dist/404.html << EOF
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
EOF

# 5. Restore original files
echo "Restoring original files..."
mv client/src/main.tsx.bak client/src/main.tsx
mv client/src/App.tsx.bak client/src/App.tsx
mv client/src/hooks/useChat.tsx.bak client/src/hooks/useChat.tsx

echo "Build completed successfully! The 'dist' folder is ready to be deployed to GitHub Pages."

# Instructions for deployment
echo "
NEXT STEPS TO DEPLOY TO GITHUB PAGES:

1. Create a repository on GitHub
2. Initialize and push your local repository:
   git init
   git add .
   git commit -m \"Initial commit\"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main

3. In your GitHub repository settings, enable GitHub Pages:
   - Go to Settings > Pages
   - Set Source to \"Deploy from a branch\"
   - Select branch \"gh-pages\" and folder \"/ (root)\"
   - Click Save

4. For automatic deployment:
   - Push your changes to the main branch
   - The GitHub Actions workflow will build and deploy to gh-pages automatically

Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO/
"