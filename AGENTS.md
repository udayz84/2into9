# AGENTS.md — 2into9 Project Architecture & Agent Instructions

This is the primary operating manual and instruction reference for all AI agents and developers working in this workspace.

---

## 1. Project Purpose
**2into9** is a custom, high-performance e-commerce storefront for an apparel and lifestyle brand. It is built on Shopify Online Store 2.0 (OS 2.0) architecture using modular Theme Blocks, Section Rendering, Native Web Components, and Vanilla CSS.

---

## 2. Technology Stack
- **Platform & Engine**: Shopify Online Store 2.0 (Liquid templating engine)
- **Frontend Core**: Vanilla JavaScript (Modern ES Modules via `<script type="importmap">`, Native Custom Elements / Web Components)
- **Styling**: Vanilla CSS with CSS Custom Properties (Design System tokens), `assets/base.css`
- **View Transitions**: Native Browser View Transitions API (`assets/view-transitions.js`)
- **Backend / APIs**: Shopify Cloud SaaS, Shopify AJAX Cart API, Shopify Section Rendering API, Predictive Search API
- **Build / Tooling**: Native ES Modules (no webpack/vite bundler needed), Shopify CLI v3 (`shopify theme dev`, `shopify theme check`), Node.js (test/validation scripts)
- **Store Endpoint**: `2into9.myshopify.com` (configured in `shopify.theme.toml`)

---

## 3. Architecture Overview
- **Layouts (`layout/`)**: Master HTML shells (`theme.liquid`, `password.liquid`) providing global `<head>`, import maps, CSS variables, header-group, `#MainContent`, footer-group, modals.
- **Templates (`templates/`)**: JSON templates defining sections and block hierarchies for every route (`index.json`, `product.json`, `collection*.json`, `cart.json`, `page*.json`).
- **Sections (`sections/`)**: Dynamic, customizable full-width page sections (`header.liquid`, `hero.liquid`, `product-hero.liquid`, `best-sellers-carousel.liquid`, `customer-reviews.liquid`, etc.) supporting schema settings and nested blocks.
- **Blocks (`blocks/`)**: Modular, atomic theme blocks (`_*.liquid` and named blocks like `buy-buttons.liquid`, `variant-picker.liquid`, `accordion.liquid`, `price.liquid`, `image.liquid`, `text.liquid`).
- **Snippets (`snippets/`)**: Reusable UI partials, icons, and configuration inclusions (`snippets/product-card.liquid`, `snippets/button.liquid`, `snippets/scripts.liquid`, `snippets/theme-styles-variables.liquid`, `snippets/color-schemes.liquid`).
- **Assets (`assets/`)**: Global CSS (`base.css`), Web Component ES modules mapped in `snippets/scripts.liquid`, SVGs, and images.
- **Config (`config/`)**: Theme customizer schema (`settings_schema.json`) and store configuration presets/values (`settings_data.json`).
- **Locales (`locales/`)**: Internationalization schema strings (`en.default.json`).

---

## 4. Key Directories & Files

| Directory / File | Purpose |
| :--- | :--- |
| `shopify.theme.toml` | Target Shopify store configuration (`2into9.myshopify.com`) |
| `layout/theme.liquid` | Root master layout, head scripts, header/footer groups |
| `templates/index.json` | Homepage structure and section definitions |
| `templates/product.json` | Product details page template |
| `templates/cart.json` | Shopping cart template |
| `templates/collection.json` | Collection catalog template |
| `sections/` | Full-width dynamic sections with JSON schemas |
| `blocks/` | Atomic nested blocks for sections |
| `snippets/scripts.liquid` | ES module `<script type="importmap">` definitions and preloads |
| `snippets/theme-styles-variables.liquid` | Core design tokens (colors, spacing, fonts, typography) |
| `snippets/color-schemes.liquid` | Dynamic theme color schemes generator |
| `assets/base.css` | Primary global stylesheet and layout utilities |
| `assets/*.js` | ES modules & Custom Elements (`component.js`, `product-form.js`, `cart-drawer.js`, `utilities.js`, `events.js`) |
| `config/settings_data.json` | Active theme settings & global customizer values |
| `scratch/check_all_json.js` | Fast automated JSON syntax & schema validator |

---

## 5. Coding & Conventions
- **Liquid Templating**:
  - Use `{% render 'snippet-name', param: value %}` for snippets (do NOT use deprecated `include`).
  - Keep sections and blocks modular. Schema definitions must be valid JSON in `{% schema %}{% endschema %}`.
  - Escape user-provided strings with `| escape`.
  - Use Shopify asset filters: `{{ 'base.css' | asset_url | stylesheet_tag }}`.
- **JavaScript & Web Components**:
  - Prefer native Web Components (`class ComponentName extends HTMLElement`) extending `@theme/component`.
  - Register new modules in `snippets/scripts.liquid` under the `<script type="importmap">` if imported across files.
  - Use `@theme/events` for pub/sub decoupled event handling.
  - Never add external heavyweight libraries (e.g. jQuery, lodash) when vanilla browser APIs suffice.
- **Styling**:
  - Use CSS custom properties defined in `snippets/theme-styles-variables.liquid`.
  - Prefix component styles or scope them inside their respective section/block wrapper.
  - Do NOT modify `assets/base.css` for section-isolated one-off tweaks; keep component styles cohesive.

---

## 6. Commands Reference

### Local Development
```powershell
# Start local development server connected to 2into9.myshopify.com
shopify theme dev --store 2into9.myshopify.com
```

### Validation & Linting
```powershell
# Fast JSON syntax check for templates, sections, config, locales
node scratch/check_all_json.js

# Shopify Theme Check (Liquid linter and syntax validator)
shopify theme check --fail-level error
```

---

## 7. Mandatory Agent Rules

### CONTEXT EFFICIENCY
- Do not recursively scan the entire repository for every task.
- Use targeted search.
- Read only the files necessary for the current task.
- Do not reread files that were already inspected unless:
  - their contents may have changed
  - additional context is genuinely required
  - the task requires deeper investigation
- Do not repeatedly rediscover the project architecture.
- Use this `AGENTS.md` and `PROJECT_MAP.md` as the primary architecture reference.

### CODE MODIFICATION
- Prefer modifying existing code over creating duplicate implementations.
- Reuse:
  - existing components
  - existing utilities
  - existing hooks
  - existing services
  - existing API patterns
  - existing styles
  - existing state management
- Do not introduce new architecture unless necessary.
- Do not rewrite working code unnecessarily.

### SCOPE CONTROL
- Only modify files required for the requested task.
- Do not modify unrelated files.
- Do not perform unnecessary refactoring.
- Do not change dependencies unless required.

### DEBUGGING
When something fails:
1. Reproduce the problem.
2. Locate the root cause.
3. Inspect only relevant code.
4. Fix the root cause.
5. Validate the fix.
6. Check for regression.
- Do not randomly rewrite large sections.

### VALIDATION
After making changes:
- Run `node scratch/check_all_json.js` if modifying JSON templates or schemas.
- Run `shopify theme check --fail-level error` when modifying Liquid files.
- Verify the requested functionality.
- Never claim that something works without validation.

### SPEED
Prioritize:
**Targeted Search → Relevant Files → Minimal Change → Validation**

Avoid:
**Full Repository Scan → Repeated Reading → Unnecessary Refactoring → Long Planning → Unnecessary Tool Calls**
