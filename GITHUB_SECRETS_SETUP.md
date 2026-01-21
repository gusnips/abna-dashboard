# GitHub Secrets Setup Guide

Before deploying to GitHub Pages, you need to configure three repository secrets.

## Quick Setup Steps

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

## Required Secrets

### 1. VITE_GOOGLE_SHEETS_API_KEY
**Name:** `VITE_GOOGLE_SHEETS_API_KEY`  
**Value:** Your Google Sheets API key from Google Cloud Console  
**Example:** `AIzaSyC...` (your actual API key)

**How to get this:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable Google Sheets API
- Create credentials → API Key
- Restrict the key to Google Sheets API only
- Add HTTP referrer restriction: `https://YOUR-USERNAME.github.io/*`

---

### 2. VITE_GOOGLE_SHEETS_SPREADSHEET_ID
**Name:** `VITE_GOOGLE_SHEETS_SPREADSHEET_ID`  
**Value:** `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`

**How to get this:**
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Copy the `SPREADSHEET_ID` part
- For this project, use: `1X_NnjQTEWJ8Se9Anm5CvD5BIGdjKo5BadYEqnxPnLKY`

---

### 3. VITE_GOOGLE_SHEETS_RANGE
**Name:** `VITE_GOOGLE_SHEETS_RANGE`  
**Value:** `Sheet1!A:Z`

**What this means:**
- `Sheet1` = the name of the sheet tab
- `A:Z` = columns A through Z (all rows)
- Adjust if your sheet has a different name or you need different columns

---

## Verification Checklist

After adding all three secrets:

- [ ] `VITE_GOOGLE_SHEETS_API_KEY` is set
- [ ] `VITE_GOOGLE_SHEETS_SPREADSHEET_ID` is set
- [ ] `VITE_GOOGLE_SHEETS_RANGE` is set
- [ ] Google Sheet is set to "Anyone with the link can view"
- [ ] API key has HTTP referrer restrictions configured
- [ ] GitHub Pages is enabled (Settings → Pages → Source: GitHub Actions)

## Testing

After setting up secrets, push to main branch:

```bash
git add .
git commit -m "Configure deployment"
git push origin main
```

Then check:
1. **Actions** tab - workflow should run successfully
2. Visit `https://YOUR-USERNAME.github.io/abna-campaign-dashboard/`
3. Data should load from Google Sheets

## Troubleshooting

**Build fails with "API key not found"**
- Check that secret names are exactly as shown above (case-sensitive)
- Verify secrets are in the correct repository

**Data doesn't load on deployed site**
- Check browser console for errors
- Verify spreadsheet is publicly accessible
- Check API key restrictions in Google Cloud Console

**404 error on deployed site**
- Verify GitHub Pages is enabled
- Check that `base` in `vite.config.ts` matches your repo name
- Wait a few minutes for DNS propagation

## Need Help?

See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.
