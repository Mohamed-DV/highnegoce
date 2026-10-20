# High Negoce website

Static one-page site for High Negoce (Casablanca), hosted on Netlify.
Netlify project: **high-negoce** → https://high-negoce.netlify.app

```
src/            source files (edit these)
  index.html    the page, with SEO tags, structured data and FAQ
  404.html      "page not found"
  favicon.*, icon-*.png, apple-touch-icon.png, site.webmanifest   browser/tab icons
  assets/       logo + social share image (og-high-negoce.jpg)
  fonts/        self-hosted Archivo and Martian Mono (OFL licence)
  robots.txt, sitemap.xml
build.mjs       copies src/ → dist/ and fills in the site URL
netlify.toml    build command, publish folder, headers, caching
dist/           ready-to-upload build for https://high-negoce.netlify.app
```

## Deploy

**Fastest (drag and drop):** open https://app.netlify.com/projects/high-negoce/deploys
and drag the `dist` folder onto the page.

**Recommended (automatic deploys from GitHub):** push this folder to a GitHub repo, then in
Netlify: Project configuration → Build & deploy → Link repository. Netlify runs
`node build.mjs` on every push and uses the project's primary URL automatically.

**CLI:**
```bash
npx netlify-cli link --id b861692e-7321-4189-8b05-29711b71745a
npx netlify-cli deploy --build --prod
```

## Custom domain (e.g. highnegoce.ma)

1. Netlify → Domain management → Add a domain. HTTPS is issued automatically.
2. With Git or CLI deploys, the next build switches canonical links, the sitemap and
   social previews to the new domain, and 301-redirects high-negoce.netlify.app to it.
   With drag and drop, rebuild first: `node build.mjs https://www.highnegoce.ma`, then drop `dist`.

## After launch (this is what makes Google show High Negoce)

1. **Google Business Profile** (business.google.com): create or claim "High Negoce",
   category "Grossiste" / "Fournisseur de fournitures de bureau", same address and phone
   as the site, add the website link, photos of the shop and products, opening hours.
   This is what puts the business on Google Maps and in "near me" results.
2. **Google Search Console** (search.google.com/search-console): add the site, verify
   (DNS, or set env var `GOOGLE_SITE_VERIFICATION` in Netlify and redeploy), then submit
   `/sitemap.xml`. Do the same in Bing Webmaster Tools (`BING_SITE_VERIFICATION`).
3. **Same name, address and phone everywhere:** add the website link to the Facebook page,
   LinkedIn page, Telecontact and Charika listings.
4. **Reviews:** ask regular clients to leave Google reviews.

## Before going live, confirm with the client

- Email address and opening hours (not on the site yet)
- The map pin lands on the shop
- Roll widths mentioned in the FAQ (80 mm / 57 mm) match what they sell
# highnegoce
