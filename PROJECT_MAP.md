# PROJECT MAP

## Stack
- **Platform**: Shopify Online Store 2.0 (OS 2.0) Theme
- **Templating**: Liquid (Shopify Theme Engine)
- **Scripting**: Modern Vanilla JavaScript (Native ES Modules, Web Components, Import Maps)
- **Styling**: Vanilla CSS with CSS Custom Properties Design Tokens (`assets/base.css`)
- **CLI & Tooling**: Shopify CLI v3 (`shopify`), Node.js (test scripts)
- **Target Store**: `2into9.myshopify.com` (configured in `shopify.theme.toml`)

---

## Directory Structure
```
2into9/
├── shopify.theme.toml       # Shopify CLI environment configuration (store = 2into9.myshopify.com)
├── .shopifyignore           # Files ignored by Shopify sync (.agents/, scratch/, .git/, etc.)
├── .gitignore               # Git ignored paths
├── AGENTS.md                # Primary AI agent instructions & mandatory development rules
├── PROJECT_MAP.md           # Compact index and architecture reference (this file)
├── layout/                  # Master theme shells (theme.liquid, password.liquid)
├── templates/               # JSON and Liquid page templates (index, product, collection, cart, pages)
├── sections/                # Full-width customizable page sections with schema settings (90 sections)
├── blocks/                  # Reusable nested theme blocks (_*.liquid, atomic controls) (96 blocks)
├── snippets/                # Liquid partials, components, SVGs, helper tags (108 snippets)
├── assets/                  # CSS (base.css), JS ES modules, SVGs, images (175 assets)
├── config/                  # Theme customizer schema (settings_schema.json) & settings (settings_data.json)
├── locales/                 # i18n translation schemas (en.default.json)
├── scratch/                 # Local test and validation scripts (check_all_json.js, test_atc.js)
└── .agents/                 # Agent intelligence, rules, skills, workflows
    ├── FAST_AGENT.md        # Fast development protocol
    ├── skills/              # Smart development skill
    ├── rules/               # Architecture, development, performance, testing rules
    └── workflows/           # Feature, bug-fix, and UI change workflows
```

---

## Important Files
- `shopify.theme.toml`: Active store configuration
- `layout/theme.liquid`: Master HTML document, head includes, body wrapper
- `snippets/scripts.liquid`: Master ES module import map (`<script type="importmap">`)
- `snippets/stylesheets.liquid`: Global CSS preload and link tags
- `snippets/theme-styles-variables.liquid`: CSS custom properties (colors, typography, spacing)
- `snippets/color-schemes.liquid`: Dynamic scheme classes generator
- `assets/base.css`: Master global styling, utility classes, responsive grid (~98KB)
- `config/settings_data.json`: Store theme settings state
- `config/settings_schema.json`: Theme customizer schema definitions
- `scratch/check_all_json.js`: Instant syntax validator for all project JSON files

---

## Frontend Architecture
- **Layout Shell**: `layout/theme.liquid` renders `<head>`, `<main id="MainContent">`, header-group, and footer-group.
- **Dynamic Templates**: JSON templates in `templates/*.json` define section ordering and block settings.
- **Web Components**: Native Custom Elements registered globally via import map in `snippets/scripts.liquid`.
- **View Transitions**: Handled by `assets/view-transitions.js` with render-blocking tags for seamless page transitions.

---

## Backend Architecture
- **Server**: Shopify Cloud SaaS (serverless, high availability).
- **Execution**: Liquid templates rendered server-side on Shopify Edge CDN.
- **Persistence**: Managed Shopify platform database.

---

## API Architecture
- **Shopify AJAX Cart API**:
  - `POST /cart/add.js`: Add items to cart
  - `POST /cart/change.js`: Change line item quantities
  - `POST /cart/update.js`: Update cart attributes/notes
  - `GET /cart.js`: Retrieve current cart object
- **Section Rendering API**:
  - Dynamic component refresh via `?section_id=...` or `?sections=...` query parameters (handled by `@theme/section-renderer`).
- **Predictive Search API**:
  - `GET /search/suggest.json` and section-based predictive search (`sections/predictive-search.liquid`).
- **Recommendations API**:
  - `GET /recommendations/products.json?product_id=...`

---

## Database
- Managed by Shopify SaaS.
- Accessible in Liquid via global drops: `all_products`, `collections`, `cart`, `shop`, `customer`, `pages`, `articles`.
- Custom fields managed via Shopify Metafields and Metaobjects.

---

## Authentication
- Shopify Customer Accounts (Classic / New Customer Accounts).
- Handled through Shopify Auth endpoints, `snippets/account-actions.liquid`, and `assets/account-login-actions.js`.

---

## State Management
- **Event Bus**: Pub/sub custom event system in `assets/events.js` (`@theme/events`).
- **Cart State**: Synchronized via cart drawer (`assets/cart-drawer.js`, `assets/component-cart-items.js`) and Cart API.
- **Variant State**: Variant picker component (`assets/variant-picker.js`) updates URLs and triggers section re-rendering.
- **Filter/Search State**: URL search params manipulated by `assets/facets.js`.

---

## Styling
- **Architecture**: Vanilla CSS driven by CSS Custom Properties (Variables).
- **Global Stylesheet**: `assets/base.css` (~98KB) provides reset, typography, layout, grid, and base styles.
- **Design Tokens**: Defined in `snippets/theme-styles-variables.liquid` and `snippets/color-schemes.liquid`.
- **Component Styles**: Co-located inside Liquid files with `<style>` blocks or dedicated asset CSS files (e.g. `assets/overflow-list.css`).

---

## Components

### Major Sections (`sections/`)
- **Navigation & Shell**: `header.liquid`, `header-announcements.liquid`, `footer.liquid`, `custom-footer.liquid`
- **Hero & Promotions**: `hero.liquid`, `product-hero.liquid`, `custom-hero.liquid`, `scrolling-banner.liquid`, `marquee.liquid`
- **Catalog & Showcases**: `best-sellers-carousel.liquid`, `collection-showcase.liquid`, `main-collection.liquid`, `collection-list.liquid`
- **Product Experience**: `product-information.liquid`, `product-colour-builder.liquid`, `product-accordion.liquid`, `product-hotspots.liquid`
- **Social & Proof**: `customer-reviews.liquid`, `testimonials.liquid`, `reels-video.liquid`, `d-lock-reviews.liquid`

### Major Blocks (`blocks/`)
- **Product Details**: `buy-buttons.liquid`, `variant-picker.liquid`, `price.liquid`, `quantity.liquid`, `swatches.liquid`, `product-title.liquid`, `product-description.liquid`
- **UI Structure**: `heading.liquid`, `text.liquid`, `image.liquid`, `accordion.liquid`, `button.liquid`, `spacer.liquid`, `divider.liquid`

### Major Snippets (`snippets/`)
- **Primitives**: `button.liquid`, `product-card.liquid`, `quantity-selector.liquid`, `checkbox.liquid`, `icon.liquid`, `swatch.liquid`
- **Overlays & Modals**: `search-modal.liquid`, `quick-add-modal.liquid`, `cart-drawer.liquid`, `cart-products.liquid`, `cart-summary.liquid`

---

## Common Utilities & Import Map Modules
All registered in `snippets/scripts.liquid` via `<script type="importmap">`:
- `@theme/component` → `assets/component.js` (Base custom element class)
- `@theme/events` → `assets/events.js` (Decoupled pub/sub event bus)
- `@theme/utilities` → `assets/utilities.js` (DOM helpers, focus trap, debounce, header calculations)
- `@theme/section-renderer` → `assets/section-renderer.js` (Shopify Section Rendering API runner)
- `@theme/morph` → `assets/morph.js` (DOM diffing and fast morphing engine)
- `@theme/product-form` → `assets/product-form.js` (Form submission & AJAX add-to-cart)
- `@theme/variant-picker` → `assets/variant-picker.js` (Variant selection & option switching)
- `@theme/sticky-add-to-cart` → `assets/sticky-add-to-cart.js` (Sticky purchase bar)
- `@theme/fly-to-cart` → `assets/fly-to-cart.js` (Add-to-cart animation)
- `@theme/comparison-slider` → `assets/comparison-slider.js` (Before/after slider)
- `@theme/dialog` → `assets/dialog.js` (Accessible modal dialogs)
- `@theme/scrolling` → `assets/scrolling.js` (Scroll listeners & sticky positioning)

---

## Development Commands
```powershell
# Start local development server (proxies to 2into9.myshopify.com)
shopify theme dev --store 2into9.myshopify.com

# Start on custom port if 9292 is busy
shopify theme dev --store 2into9.myshopify.com -- --port 9560
```

---

## Build Commands
- **None**: This project runs on native browser ES modules and vanilla CSS. There is no build/transpilation step required.

---

## Test Commands
```powershell
# 1. Instant JSON integrity test (templates, sections, config, locales)
node scratch/check_all_json.js

# 2. Shopify Theme Check (validates Liquid syntax, missing objects, schemas)
shopify theme check --fail-level error
```

---

## Important Conventions
1. **Targeted Inspection**: Inspect only files relevant to the task (e.g., target section or block).
2. **Reuse First**: Check `blocks/`, `snippets/`, and `assets/` before authoring new UI or JavaScript logic.
3. **No Redundant Bundlers**: Keep assets vanilla; do not introduce npm bundlers or tailwind unless explicitly requested.
4. **Validation Required**: Always validate modified JSON with `node scratch/check_all_json.js` and run theme check before completing tasks.
