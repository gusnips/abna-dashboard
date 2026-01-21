# Deployment Guide

This guide walks through deploying the ABNA Campaign Dashboard to GitHub Pages.

## Prerequisites

- Repository hosted on GitHub
- GitHub Pages enabled in repository settings
- Google Sheets API key with appropriate restrictions

## Initial Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", set **Source** to "GitHub Actions"
4. Save the settings

### 2. Configure Repository Secrets

The following environment variables must be stored as repository secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each of the following:

#### Required Secrets:

**VITE_GOOGLE_SHEETS_API_KEY**
- Your Google Sheets API key
- Example: `AIzaSyC...`

**VITE_GOOGLE_SHEETS_SPREADSHEET_ID**
- The ID of your Google Sheets spreadsheet
- Default: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`
- Example: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`

**VITE_GOOGLE_SHEETS_RANGE**
- The range of cells to fetch from the spreadsheet
- Default: `Sheet1!A:Z`
- Example: `Sheet1!A:Z` or use the sheet GID format

3. Click **Add secret** for each one

### 3. Configure Google Cloud Console

Ensure your API key has the following restrictions:

1. **API restrictions**: Restrict to Google Sheets API only
2. **Application restrictions**: Add HTTP referrer:
   - `https://YOUR-USERNAME.github.io/abna-campaign-dashboard/*`
   - Replace `YOUR-USERNAME` with your GitHub username or organization name
3. Enable quota monitoring and alerts

### 4. Verify Spreadsheet Configuration

Ensure the Google Sheets spreadsheet is properly configured:

- **Sharing**: "Anyone with the link can view"
- **Spreadsheet ID**: Should match the `VITE_GOOGLE_SHEETS_SPREADSHEET_ID` secret
- **Default**: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`
- **Sheet Range**: Should match the `VITE_GOOGLE_SHEETS_RANGE` secret (e.g., `Sheet1!A:Z`)

## Deployment Process

### Automatic Deployment

The application automatically deploys when you push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Actions workflow will:
1. Check out the code
2. Set up Bun
3. Install dependencies
4. Build the application
5. Deploy to GitHub Pages

### Manual Deployment

You can also trigger a deployment manually:

1. Go to **Actions** tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

## Local Testing

Before deploying, test the production build locally:

```bash
# Build for production
bun run build

# Preview the production build
bun run preview
```

The preview server will start at `http://localhost:4173` (or another port if 4173 is in use).

## Verification

After deployment completes:

1. Check the **Actions** tab for workflow status
2. Visit your deployed site: `https://YOUR-USERNAME.github.io/abna-campaign-dashboard/`
3. Verify:
   - Data loads from Google Sheets
   - All filters work correctly
   - Charts render properly
   - Mobile responsive layout works
   - No console errors

## Troubleshooting

### Build Fails

- Check the Actions log for specific error messages
- Ensure all dependencies are listed in `package.json`
- Verify TypeScript compilation passes locally: `bun run build`

### API Key Issues

- Verify all three secrets are configured:
  - `VITE_GOOGLE_SHEETS_API_KEY`
  - `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`
  - `VITE_GOOGLE_SHEETS_RANGE`
- Check API key restrictions in Google Cloud Console
- Ensure the spreadsheet is publicly accessible

### 404 Errors on Deployed Site

- Verify the `base` path in `vite.config.ts` matches your repository name
- Check that GitHub Pages is enabled and set to "GitHub Actions"
- Ensure the workflow completed successfully

### Data Not Loading

- Check browser console for API errors
- Verify all three environment variables are set correctly:
  - API key has correct permissions
  - Spreadsheet ID matches your Google Sheet
  - Range covers all necessary columns (e.g., `Sheet1!A:Z`)
- Ensure spreadsheet is publicly accessible
- Check API quota limits in Google Cloud Console

## Configuration Files

Key files for deployment:

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vite.config.ts` - Vite configuration with base path
- `.env.example` - Environment variable template
- `package.json` - Build scripts and dependencies

## Updating the Deployment

To update the deployed application:

1. Make your changes locally
2. Test with `bun run dev`
3. Run tests: `bun run test:run`
4. Build locally: `bun run build`
5. Commit and push to `main` branch
6. GitHub Actions will automatically deploy the update

## Rollback

To rollback to a previous version:

1. Go to **Actions** tab
2. Find the successful deployment you want to rollback to
3. Click **Re-run all jobs**

Alternatively, revert the commit and push:

```bash
git revert <commit-hash>
git push origin main
```

## Monitoring

Monitor your deployment:

- **GitHub Actions**: Check workflow runs in the Actions tab
- **Google Cloud Console**: Monitor API usage and quotas
- **Browser Console**: Check for runtime errors on the deployed site

## Support

For issues with:
- **GitHub Pages**: Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- **Google Sheets API**: Check [Google Sheets API documentation](https://developers.google.com/sheets/api)
- **Vite**: Check [Vite documentation](https://vitejs.dev/)
