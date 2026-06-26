# Mesio — Brand Guidelines

Visual identity for Mesio, a modern SaaS platform for restaurants.

---

## 1. Brand Concept

### The Nexus Mark

The Mesio symbol is an abstract geometric mark — not food, not a menu — representing a **technology platform** that connects restaurants to their digital presence.

| Element | Meaning |
|---|---|
| **Two pillars** | Connection, community, stable foundation |
| **Golden arch** | Platform bridge, flow, shared experience, hospitality |
| **Center node** | Digital focal point, growth, experience hub |

The mark reads as an abstract "M" at a glance while remaining unique and scalable.

---

## 2. Logo Variants

All vector sources live in [`svg/`](svg/).

| File | Use case |
|---|---|
| `icon-default.svg` | Icon on light backgrounds |
| `icon-light.svg` | Icon on dark backgrounds (#18181B) |
| `icon-monochrome-dark.svg` | Print, embossing, single-color dark |
| `icon-monochrome-white.svg` | Reversed print, dark surfaces |
| `logo-horizontal-default.svg` | Primary lockup — headers, marketing |
| `logo-horizontal-light.svg` | Dark UI, hero sections |
| `logo-vertical-default.svg` | App splash, stacked layouts |
| `logo-vertical-light.svg` | Dark stacked layouts |

Raster exports (transparent PNG) are in [`png/`](png/), generated via `npm run export:brand`.

---

## 3. Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Primary** | `#F4B400` | Accent, arch, node, CTAs, highlights |
| **Secondary** | `#18181B` | Text, pillars, dark backgrounds |
| **Background** | `#FFFFFF` | Light surfaces |
| **Neutral** | `#F4F4F5` | Cards, subtle backgrounds |
| **Success** | `#22C55E` | Positive states |

### Color rules

- Default lockup: **dark pillars + gold accent** on white/transparent
- Never place gold text on white (contrast failure)
- On photography: use monochrome-white with clear space
- App icon: mark centered on `#18181B` square with 18% padding

---

## 4. Typography

| Role | Typeface | Weight |
|---|---|---|
| **Primary** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | 500–700 |
| **Fallback** | Inter, system-ui, sans-serif | 400–600 |

### Wordmark settings

- Weight: **600 (Semibold)**
- Letter-spacing: **-0.02em** (tracking-tight)
- Case: **Mesio** — capitalize only the M

### Hierarchy example

```
Display:  Plus Jakarta Sans 600, 48–64px
Heading:  Plus Jakarta Sans 600, 24–32px
Body:     Plus Jakarta Sans 400, 14–16px
Caption:  Plus Jakarta Sans 500, 12px
```

---

## 5. Spacing & Clear Space

Minimum clear space around the mark = **25% of the mark height** on all sides.

```
        ┌─────────────────┐
        │    clearance    │
        │  ┌───┐          │
        │  │ M │  mark    │
        │  └───┘          │
        │    clearance    │
        └─────────────────┘
```

### Logo spacing (horizontal lockup)

- Gap between mark and wordmark: **equal to mark width × 0.35**
- Vertical alignment: optical center (mark sits 1px lower than cap height)

---

## 6. Minimum Sizes

| Asset | Min size | Notes |
|---|---|---|
| Icon only | **16×16 px** | Favicon; arch must remain visible |
| Horizontal logo | **80 px width** | Below this, use icon only |
| Vertical logo | **64 px height** | Below this, use icon only |
| App icon | **32×32 px** | iOS/Android minimum |

---

## 7. Usage Examples

### Do

- Use official SVG/PNG from this folder
- Maintain clear space
- Use `icon-light` on dark backgrounds
- Use horizontal lockup in navbars and emails
- Use vertical lockup for splash screens

### Don't

- Rotate, skew, or stretch the mark
- Change pillar or accent colors outside the palette
- Add shadows, gradients, or 3D effects to the logo
- Place the logo over busy photography without a backdrop
- Use food imagery inside or overlapping the mark
- Recreate the mark with utensils, QR codes, or mascots

---

## 8. File Inventory

### SVG (source of truth)

`svg/icon-*.svg`, `svg/logo-*.svg`

### PNG (generated)

`png/icon-default-{16,32,64,128,180,512}.png`

`png/logo-horizontal-default-{320,640,1280}.png`

`png/app-icon-512.png`

### App integration

| Path | Purpose |
|---|---|
| `src/components/brand/mesio-mark.tsx` | React SVG mark |
| `src/components/brand/logo.tsx` | Logo component |
| `src/app/icon.png` | Favicon (32px) |
| `src/app/apple-icon.png` | Apple touch icon (180px) |
| `public/logo.png` | Static public logo |

Regenerate all PNGs:

```bash
npm run export:brand
```

---

## 9. Brand Personality

Modern · Premium · Minimalist · Friendly · Innovative · Elegant · Trustworthy · Digital-first · Timeless

Mesio should feel comparable in polish to Stripe, Linear, Notion, and Vercel — a premium technology partner for restaurants, not a commodity menu tool.
