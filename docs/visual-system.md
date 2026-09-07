# ELEVEN visual system audit

## Existing frontend

- Vinext 1.0.0-beta.5, React 19, Next-compatible App Router and Cloudflare Worker build. npm lockfile preserved.
- Seven routes: /, /work, /services, /products, /about, /insights, /contact. No separate service-detail, case-study or legal routes existed. Shared content and interactive components live in app/site.tsx; page wrappers own route metadata.
- app/layout.tsx loads app/globals.css. All public presentation uses handwritten CSS. Tailwind 4 is configured as a PostCSS plugin, but the public frontend does not import Tailwind or the unused components/ui library. There is no Tailwind config or separate active theme.
- Previous tokens: black #0b0b0b / #171717, cream #f3f0e9 / #f8f6f1, bronze #9a7b55, muted #85817a, black/white alpha borders. Component rules contained additional warm grays, black and white literals.
- Previous font loading: next/font/google Geist and Playfair Display. Body 16px; hero 54–124px; major headings 42–92px; metadata mostly 8–11px. Weights 400/500/700; italic serif emphasis; tightly tracked uppercase controls.
- Shared primitives: Header, Footer, Title, PageHero, CTA, WorkFeature, ProductVisual, Architecture, CapabilityIndex and draggable Diagram. Buttons use .button, .pale and .nav-cta; text links use .text-link.
- Layouts use CSS grid and flex, fluid gutters, 850px and 540px breakpoints. Original public components were predominantly square; diagram and product imagery used offset/drop shadows, and the diagram had a decorative gradient grid.
- Interactions: sticky header, mobile menu and body scroll lock, service accordions, pointer/keyboard diagram movement, native form validation and local confirmation state. Contact explicitly states that no submission service is connected. No backend/API calls or analytics were found in the public source.

## Refactor

- Canonical palette values exist once in app/globals.css. Semantic tokens cover canvas, foreground, surfaces, primary/secondary/contextual controls, muted copy, borders, focus, radii, spacing, typography and motion.
- Instrument Sans variable WOFF2 (400–700) is bundled via next/font/local with swap and preload, avoiding Vinext's external Google Fonts fallback. Font license is app/fonts/OFL.txt.
- Existing content, links, images, route metadata and interactions are retained. The 404 uses the shared header/footer.
- White canvas, orange hero diagram/statement/CTA, navy capabilities/architecture/footer, blue product section. Work gets a large uncropped image, insights use editorial two-column rows, inner heroes pair large headings with a separately aligned introduction.
- Orange always pairs with navy copy. Small text on light surfaces uses navy or blue; orange numbering is placed on navy or used as a field behind navy numbers. Muted colors are derived from canonical values.
- Borders and spacing replace elevation. Buttons use 4px radii; text controls are 14–16px and body copy 17–20px. No decorative gradients, glows or scroll-linked reveals. Reduced-motion settings disable animation and smooth scrolling.

## Scope boundaries

Product screenshots, logo artwork, favicon and existing social image are retained as supplied assets. Unused UI library selectors targeting third-party chart defaults (#ccc/#fff) are not legacy brand colors and are untouched. No test suite was configured in package.json or found in the source.

## Validation — 7 September 2026

- `npm run lint`, `npx tsc --noEmit`, and the production build pass. No test runner/suite exists.
- Production browser layout checks cover all seven routes plus a missing route at 1440, 1024, 768, 390 and 320px widths. A 320px service-title overflow was corrected with a narrow-screen type adjustment.
- Desktop and mobile screenshots inspected for all routes; shared work imagery, mobile navigation, expanded capabilities and form selection/focus states also inspected.
- Computed text/ancestor-background contrast checked across all routes and the expanded capability/confirmation states. No failures; lowest measured ratio 5.65:1. This checks live HTML text, not text embedded in preserved image assets.
- Checked mobile menu open/close and route navigation, service accordion expansion, keyboard diagram movement, required form validation, checkbox/radio selection and local enquiry confirmation.
- Production returns 200 for public routes, 404 for a missing route, and serves the font with a local preload and no Google Fonts stylesheet. No broken images observed.
- Legacy palette/font-import and gradient searches are clear in active public source. Cached previous fonts were removed; production includes only Instrument Sans.
- Reduced-motion CSS disables transitions, reveal animation and smooth scrolling. Border/focus tokens are shared across controls; selected navigation also exposes aria-current.
- Vinext emits informational route-classification/plugin-timing notices. The dev runtime stalled after a restart; browser QA was completed against the production Worker server.
