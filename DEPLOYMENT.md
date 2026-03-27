# Deployment Guide

## Current Status

The site is deployed to GitHub Pages and accessible at:
- 🔗 https://gitstore-dev.github.io/gitstore.dev/

## Setting Up Custom Domain (gitstore.dev)

To make the site accessible at `https://gitstore.dev`, follow these steps:

### Step 1: Configure DNS

Add a CNAME record in your DNS provider (where you registered gitstore.dev):

```
Type: CNAME
Name: @ (or gitstore.dev)
Value: gitstore-dev.github.io
TTL: 3600 (or default)
```

**Alternative (for apex domain)**: If your DNS provider doesn't support CNAME for apex domains, use A records:

```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### Step 2: Configure GitHub Pages

1. Go to repository settings:
   👉 https://github.com/gitstore-dev/gitstore.dev/settings/pages

2. Under "Custom domain":
   - Enter: `gitstore.dev`
   - Click **Save**

3. Wait for DNS check to complete (may take a few minutes to 24 hours)

4. Once DNS check passes:
   - ✅ Check "Enforce HTTPS"
   - GitHub will automatically provision SSL certificate

### Step 3: Update Vite Configuration (Already Done!)

The `vite.config.ts` is already configured to use `base: '/'` which works for custom domains.

**Note**: The `CNAME` file in `public/` directory already contains `gitstore.dev`, which tells GitHub Pages to use this custom domain.

### Step 4: Redeploy

After DNS is configured and GitHub Pages custom domain is set:

```bash
# Trigger a new deployment (optional, or wait for next commit)
git commit --allow-empty -m "chore: trigger deployment for custom domain"
git push origin main
```

### Step 5: Verify

After DNS propagates (up to 48 hours, usually much faster):

1. Visit https://gitstore.dev
2. Verify SSL certificate is valid (🔒 in browser)
3. Check that CSS/JS loads correctly
4. Test email signup form

---

## Deployment URLs

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** (Custom Domain) | https://gitstore.dev | ⏳ Pending DNS setup |
| **Production** (GitHub Pages) | https://gitstore-dev.github.io/gitstore.dev/ | ✅ Live |
| **Local Development** | http://localhost:5173 | - |

---

## Troubleshooting

### CSS Not Loading on GitHub Pages Subdirectory

If using the subdirectory URL and CSS isn't loading, update `vite.config.ts`:

```typescript
base: '/gitstore.dev/',  // For subdirectory
```

Then rebuild and redeploy.

### Custom Domain Not Working

1. **Check DNS Propagation**:
   ```bash
   dig gitstore.dev
   nslookup gitstore.dev
   ```

2. **Verify CNAME file exists**:
   - Check `public/CNAME` contains `gitstore.dev`
   - Verify it's in the deployed `dist/` folder

3. **Check GitHub Pages Settings**:
   - Ensure custom domain is set to `gitstore.dev`
   - DNS check should show ✅

4. **Wait for SSL Certificate**:
   - After DNS propagates, GitHub auto-provisions SSL
   - This can take 10-60 minutes

### Formspree Not Working

The email signup form requires Formspree configuration:

1. Create form at https://formspree.io
2. Get your form ID
3. Add to GitHub repository secrets:
   - Name: `VITE_FORMSPREE_FORM_ID`
   - Value: `your_form_id`
4. Redeploy

---

## GitHub Actions Workflow

Automatic deployment is configured in `.github/workflows/deploy.yml`:

- **Trigger**: Push to `main` branch
- **Build**: `npm ci && npm run build`
- **Deploy**: Uploads `dist/` to GitHub Pages
- **Duration**: ~2-3 minutes

---

## DNS Propagation Timeline

| Step | Expected Time |
|------|---------------|
| DNS record created | Immediate |
| DNS propagation starts | 5-15 minutes |
| Partial propagation | 1-4 hours |
| Full global propagation | 24-48 hours |
| SSL certificate provisioned | 10-60 minutes after DNS |

---

## Post-Deployment Checklist

Once custom domain is live:

- [ ] Visit https://gitstore.dev
- [ ] Verify HTTPS (SSL certificate valid)
- [ ] Check all CSS/JS loads correctly
- [ ] Test email signup form (after Formspree setup)
- [ ] Test GitHub link works
- [ ] Verify mobile responsive design
- [ ] Check Open Graph preview (share on social media)
- [ ] Update any external links to use `gitstore.dev`

---

## Rolling Back

If issues occur with custom domain:

1. Remove custom domain from GitHub Pages settings
2. Site will revert to `gitstore-dev.github.io/gitstore.dev`
3. Update `vite.config.ts` base path if needed
4. Redeploy

---

## Support

For DNS issues, contact your domain registrar support.
For GitHub Pages issues, see: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
