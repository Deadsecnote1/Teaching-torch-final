# Setup New GitHub Repository and GitHub Pages

## Step 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: Choose a name (e.g., `teaching-torch` or `tt-react-new`)
3. Description: "Free Educational Resources for Sri Lankan Students - Built with React.js"
4. Set to **Public** (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Update Homepage URL

After creating the repo, update the homepage in `package.json`:
- Replace `https://deadsecnote1.github.io/TT-react` with your new repo URL
- Format: `https://YOUR_USERNAME.github.io/REPO_NAME`

## Step 3: Connect to New Repository

Run these commands (replace YOUR_USERNAME and REPO_NAME):

```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to new repository
git push -u origin master
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

## Step 5: Deploy to GitHub Pages

Run this command to deploy:

```bash
npm run deploy
```

This will:
- Build your React app
- Create/update the `gh-pages` branch
- Deploy to GitHub Pages

## Step 6: Access Your Site

Your site will be available at:
`https://YOUR_USERNAME.github.io/REPO_NAME/`

**Note:** It may take a few minutes (up to 10 minutes) for GitHub Pages to update.

