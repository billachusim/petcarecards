# Pet Care Card — launch readiness checklist

Work through this before publishing to a real audience. Items marked **owner action**
cannot be completed from inside the app.

## 1. Payments (Paddle)

- [ ] **Owner action:** complete Paddle verification in the Payments tab. Live checkout stays
      disabled until the readiness check, business verification and Paddle approval all pass.
- [ ] **Owner action:** Paddle requires public Terms, Refund and Privacy pages before approval.
      Replace the placeholders (see item 2) first.
- [ ] Confirm the live price is the one-time $4.99 lifetime unlock (product `pet_care_card_lifetime`,
      price `lifetime_unlock`) and that no subscription plan exists.
- [ ] Point the live webhook at `/api/public/payments/webhook` and confirm the live signing secret is
      set; the endpoint must return 400 for unsigned requests (it does today).
- [ ] Run a sandbox purchase end to end with card `4242 4242 4242 4242`: checkout → webhook →
      entitlement verified → premium features unlock → Restore Purchase works on a second browser.
- [ ] Repeat one real live purchase after approval and refund it, to confirm live keys and refund
      handling.

## 2. Legal and policy content

- [ ] **Owner action:** replace the placeholder text in `/privacy` and `/terms` with reviewed copy.
- [ ] **Owner action:** add a refund policy with a stated window (14–90 days is typical for Paddle)
      and a merchant-of-record disclosure naming Paddle as the seller.
- [ ] Add a real support contact address to both pages (currently a placeholder line).
- [ ] Keep the non-medical disclaimer visible on medication surfaces and medication content.

## 3. Domain, branding and social

- [ ] **Owner action:** connect a custom domain (Project Settings → Domains), then set
      `VITE_SITE_URL` to that origin so canonical URLs, sitemap and JSON-LD match.
- [ ] Update `public/robots.txt` and `public/sitemap.xml` with the final domain.
- [ ] Replace the default `public/favicon.ico` with real branding.
- [ ] Add a 1200×630 social share image and reference it as `og:image` / `twitter:image` on the
      home page and guide pages (intentionally omitted while no real asset exists).

## 4. SEO and AI search

- [x] Unique title, description, canonical, Open Graph and Twitter metadata on every public page.
- [x] `robots.txt` disallowing private app routes; `noindex, nofollow` on `/care/*`, `/pets/*`,
      `/settings`, `/reminders`, `/premium`, `/onboarding`.
- [x] `sitemap.xml` covering home, guides hub, all guides, privacy and terms.
- [x] `llms.txt` describing the product, public pages, pricing, intended use and limits.
- [x] JSON-LD: SoftwareApplication + Organization on the landing page, Article on each guide, and
      FAQPage only where FAQs are actually rendered.
- [ ] After the domain is live, submit the sitemap in Google Search Console and Bing Webmaster Tools.
- [ ] Re-verify the guide `dateModified` values whenever content is edited.

## 5. Privacy of shared content

- [x] Care cards are stored per-device; the QR code encodes only a `/care/:id` URL, never pet data.
- [x] Shareable and private routes are excluded from crawling and carry `noindex`.
- [ ] Confirm before launch that no future change makes `/care/:id` publicly resolvable without the
      owner's explicit action, and re-check the sharing defaults if a hosted backend is added.

## 6. Analytics and consent

- [ ] No analytics or tracking is installed today. If any is added, add a consent banner where
      required and update `/privacy` in the same change.

## 7. Final build checks

- [ ] `bunx tsgo --noEmit` is clean and the production build succeeds.
- [ ] Every public route loads directly on refresh: `/`, `/guides`, each `/guides/<slug>`, `/privacy`,
      `/terms`.
- [ ] Test a full flow on a phone: onboarding → add pet → care card → share → QR → print.
- [ ] Confirm reminders explain the browser-notification limitation before permission is requested.
