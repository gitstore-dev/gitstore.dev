# Quickstart: GitStore.dev Landing Page

**Feature**: 001-coming-soon-landing-page
**Last Updated**: 2026-03-27

---

## Prerequisites

- **Node.js**: 20.x or later
- **npm**: 10.x or later
- **Git**: For version control
- **Text Editor**: VS Code, Cursor, or any editor with TypeScript support

---

## Initial Setup

### 1. Clone Repository (if not already done)

```bash
git clone https://github.com/gitstore-dev/gitstore.dev.git gitstore-dev
cd gitstore-dev
```

### 2. Switch to Feature Branch

```bash
git checkout 001-coming-soon-landing-page
```

### 3. Install Dependencies

```bash
npm install
```

**Expected Dependencies** (will be installed):
- `vite` - Build tool and dev server
- `typescript` - TypeScript compiler
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` - PostCSS plugin for vendor prefixes
- `postcss` - CSS processor

**Dev Dependencies**:
- `vitest` - Unit testing framework (optional)
- `@playwright/test` - End-to-end testing (optional)
- `prettier` - Code formatter

---

## Development Workflow

### Start Dev Server

```bash
npm run dev
```

**Output**:
```
  VITE v5.x.x  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open `http://localhost:5173/` in your browser. Changes auto-refresh via hot module replacement.

### Build for Production

```bash
npm run build
```

**Output**: Generates optimized files in `dist/` directory.

**Expected Bundle Size**: <100KB total (target)

### Preview Production Build

```bash
npm run preview
```

Opens production build locally at `http://localhost:4173/`

---

## Project Structure

```
/
├── index.html              # Entry point (single page)
├── src/
│   ├── main.ts             # Application logic, form handler
│   ├── styles.css          # TailwindCSS imports
│   └── lib/
│       ├── validation.ts   # Email validation utility
│       └── honeypot.ts     # Honeypot spam detection
├── public/
│   ├── favicon.ico         # Site favicon
│   ├── og-image.png        # Open Graph preview image
│   └── CNAME               # Custom domain for GitHub Pages
├── tests/
│   ├── form.test.ts        # Unit tests (Vitest)
│   └── e2e/
│       └── signup.spec.ts  # End-to-end tests (Playwright)
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

---

## Configuration

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Root domain for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Single bundle for simplicity
      },
    },
  },
});
```

### TailwindCSS (`tailwind.config.ts`)

```typescript
export default {
  content: [
    './index.html',
    './src/**/*.{ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#dbeafe',
        },
        // ... (see design.md for full palette)
      },
    },
  },
  plugins: [],
};
```

### Environment Variables

Create `.env` file in project root:

```bash
# Formspree Form ID (replace with actual ID after setup)
VITE_FORMSPREE_FORM_ID=mabcdefg
```

**Access in Code**:
```typescript
const formId = import.meta.env.VITE_FORMSPREE_FORM_ID;
```

---

## Formspree Setup

### 1. Create Formspree Account

1. Go to https://formspree.io
2. Sign up (free tier sufficient for MVP)

### 2. Create Form

1. Click "New Form"
2. Name: "GitStore.dev Early Adopters"
3. Notification email: `YOUR_EMAIL@example.com`
4. Copy form ID (e.g., `mabcdefg`)

### 3. Configure Form

1. Enable "Prevent spam" (honeypot enabled by default)
2. Disable "reCAPTCHA" (we use custom honeypot)
3. Set custom thank-you page (optional, not used for AJAX)

### 4. Update Environment Variable

Replace `mabcdefg` in `.env` with your actual form ID:

```bash
VITE_FORMSPREE_FORM_ID=YOUR_ACTUAL_FORM_ID
```

---

## Testing

### Run Unit Tests

```bash
npm run test
```

**Runs**: Vitest tests for email validation logic

**Example Test** (`tests/form.test.ts`):
```typescript
import { validateEmail } from '../src/lib/validation';

test('Valid email passes', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

test('Invalid email fails', () => {
  expect(validateEmail('notanemail')).toBe(false);
});
```

### Run End-to-End Tests

```bash
npm run test:e2e
```

**Runs**: Playwright tests for form submission flow

**Example Test** (`tests/e2e/signup.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test('Email signup success', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**Note**: E2E tests require dev server running (`npm run dev`)

---

## Common Tasks

### Add New Color

1. Edit `tailwind.config.ts`:
   ```typescript
   colors: {
     accent: '#8b5cf6',  // Purple accent
   }
   ```

2. Use in HTML:
   ```html
   <div class="text-accent">Accented text</div>
   ```

### Update Form Endpoint

1. Edit `src/main.ts`:
   ```typescript
   const formEndpoint = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`;
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

### Test Form Submission Locally

1. Start dev server: `npm run dev`
2. Open browser console: F12
3. Fill form and submit
4. Check Network tab for POST request
5. Verify response in Formspree dashboard

---

## Deployment

### Automatic Deployment (GitHub Actions)

**Trigger**: Merge to `main` branch

**Process**:
1. Push commits to `main`
2. GitHub Actions runs workflow (`.github/workflows/deploy.yml`)
3. Installs dependencies: `npm ci`
4. Builds production bundle: `npm run build`
5. Deploys `dist/` to GitHub Pages
6. Site live at `https://gitstore-dev.github.io`

**Expected Duration**: 2-3 minutes from push to live

### Manual Deployment (Emergency)

```bash
# Build production bundle
npm run build

# Force push to gh-pages branch (not recommended)
git subtree push --prefix dist origin gh-pages
```

**Note**: Prefer automatic deployment via GitHub Actions

---

## Custom Domain Setup (gitstore.dev)

### 1. Add CNAME File

Create `public/CNAME` with content:
```
gitstore.dev
```

### 2. Configure DNS

Add DNS records:
```
Type: CNAME
Name: @
Value: gitstore-dev.github.io
TTL: 3600
```

### 3. Enable in GitHub

1. Go to repository settings > Pages
2. Custom domain: `gitstore.dev`
3. Check "Enforce HTTPS"
4. Wait 24-48 hours for DNS propagation

---

## Troubleshooting

### Issue: `npm install` Fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Issue: Dev Server Port Already in Use

**Solution**:
```bash
# Use different port
npm run dev -- --port 3000
```

---

### Issue: Form Submission Returns 404

**Possible Causes**:
1. Formspree form ID not configured in `.env`
2. Incorrect form ID (typo)
3. Formspree service down

**Solution**:
1. Verify `.env` file exists and has correct ID
2. Restart dev server after editing `.env`
3. Check Formspree status at https://status.formspree.io

---

### Issue: TailwindCSS Styles Not Applying

**Solution**:
1. Verify `tailwind.config.ts` includes correct content paths
2. Check `src/styles.css` imports Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server

---

### Issue: TypeScript Errors

**Solution**:
```bash
# Check for errors
npm run typecheck

# If errors persist, clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

---

## Performance Checklist

Before deploying to production:

- [ ] Run Lighthouse audit (target: 90+ score)
- [ ] Verify bundle size < 100KB (`npm run build` output)
- [ ] Test page load < 3 seconds on 3G network (Chrome DevTools throttling)
- [ ] Verify responsive design on mobile (375px width)
- [ ] Test form submission success/error states
- [ ] Validate Open Graph image displays correctly (test with https://www.opengraph.xyz)

---

## Next Steps

After local development complete:

1. **Create Pull Request**: Merge `001-coming-soon-landing-page` into `main`
2. **Code Review**: Ensure form logic correct, design fidelity matches `design.md`
3. **Merge to Main**: Triggers automatic deployment
4. **Verify Production**: Test form submission on live site
5. **Monitor Signups**: Check Formspree dashboard for incoming emails

---

## Resources

- **Vite Documentation**: https://vitejs.dev/guide/
- **TailwindCSS Documentation**: https://tailwindcss.com/docs
- **Formspree Documentation**: https://help.formspree.io
- **Google Stitch**: https://stitch.withgoogle.com
- **GitHub Pages**: https://docs.github.com/en/pages

---

## Support

- **Feature Spec**: [spec.md](spec.md)
- **Design System**: [design.md](design.md)
- **API Contract**: [contracts/form-api.md](contracts/form-api.md)
- **Research**: [research.md](research.md)
