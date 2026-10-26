# GitStore website

The marketing website for [GitStore](https://github.com/gitstore-dev/GitStore), an open-source, Git-backed commerce catalog platform.

**Website:** [gitstore.dev](https://gitstore.dev)

Built with TypeScript, Vite, and Tailwind CSS. The site includes a light/dark/system theme menu and a WebGPU catalog illustration, with a static SVG fallback when WebGPU is unavailable. Animation respects reduced-motion preferences and can be paused.

## Local development

Use Node.js 20 or later and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

Set `VITE_FORMSPREE_FORM_ID` in `.env.local` to the Formspree form ID for early-access signups. Without it, the page still renders, but signup submissions will not work. Vite embeds this public form identifier in the client bundle; never put private credentials in `VITE_` variables.

## Build and check

```sh
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

`npm run build` type-checks the source and writes the production site to `dist/`. Use `npm run preview` to inspect that build locally.

The browser tests cover signup states using intercepted requests, theme preferences and keyboard navigation, mobile layout, and the catalog illustration. The WebGPU rendering test requires both a GPU adapter and a presentable WebGPU canvas; environments without them exercise the static fallback instead. No real signup is sent by the tests.

## Project layout

- `index.html`: page content, metadata, and initial theme selection.
- `src/styles.css`: layout and light/dark color tokens.
- `src/theme.ts`: accessible theme menu and saved preferences.
- `src/catalog-scene.ts` and `src/catalog.wgsl`: WebGPU scene and shader.
- `src/main.ts`: signup behavior and workflow illustration controls.
- `public/branding/`: approved logo and social-preview assets.
- `public/og-image.png`: website link-preview image.
- `tests/e2e/`: Playwright browser checks.

Brand name: **GitStore**. Domain names and URLs remain lowercase. Logo SVGs have matching geometry and separate colors for light and dark backgrounds. Compressed GitHub social previews are available in `public/branding/` in PNG and JPG formats at 1280 × 640 pixels.

## Publishing with GitHub Pages

Changes to `main` trigger [Deploy to GitHub Pages](https://github.com/gitstore-dev/gitstore.dev/actions/workflows/deploy.yml). Repository rules require a pull request and the merge queue.

The workflow installs dependencies, builds the site with `VITE_FORMSPREE_FORM_ID` from the `github-pages` environment, runs the browser checks, uploads `dist/`, and deploys through GitHub Pages. The build uses the official Playwright container; keep its version aligned with the Playwright version in `package-lock.json`.

The production environment is `github-pages`. `public/CNAME` configures `gitstore.dev`, and Vite uses `/` as its base path. Keep HTTPS enabled in the repository's Pages settings.

The workflow can also be dispatched manually. Only runs on `main` may execute the deployment job.

A repository's GitHub social-preview image is a separate setting from website metadata. Update it through GitHub **Settings → General → Social preview** using one of the compressed `github-social-*` images. See [GitHub's instructions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).
