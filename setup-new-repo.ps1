# Automated Setup Script for teachingTorch_updated
# Run this AFTER creating the repository on GitHub

Write-Host "`n=== Setting up teachingTorch_updated repository ===" -ForegroundColor Green
Write-Host ""

# Check if repository exists
Write-Host "Checking repository connection..." -ForegroundColor Yellow
$testConnection = git ls-remote https://github.com/Deadsecnote1/teachingTorch_updated.git 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Repository not found!" -ForegroundColor Red
    Write-Host "`nPlease create the repository first:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Repository name: teachingTorch_updated" -ForegroundColor Cyan
    Write-Host "3. Make it PUBLIC" -ForegroundColor Cyan
    Write-Host "4. DO NOT initialize with README" -ForegroundColor Cyan
    Write-Host "5. Click 'Create repository'" -ForegroundColor Cyan
    Write-Host "`nThen run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Repository found!" -ForegroundColor Green
Write-Host ""

# Push code
Write-Host "Pushing code to repository..." -ForegroundColor Yellow
git push -u origin master

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push code" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
Write-Host ""

# Deploy to GitHub Pages
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== ✅ SETUP COMPLETE! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Your site will be available at:" -ForegroundColor Cyan
Write-Host "https://deadsecnote1.github.io/teachingTorch_updated" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: It may take 5-10 minutes for GitHub Pages to activate." -ForegroundColor Yellow
Write-Host "Go to: https://github.com/Deadsecnote1/teachingTorch_updated/settings/pages" -ForegroundColor Cyan
Write-Host "to verify GitHub Pages is enabled (should show gh-pages branch)" -ForegroundColor Yellow
Write-Host ""

