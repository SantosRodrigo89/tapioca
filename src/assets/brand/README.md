# Mesio Brand Assets

Identidade visual completa em [`BRAND-GUIDELINES.md`](BRAND-GUIDELINES.md).

## Estrutura

```
svg/          # Vetores (fonte da verdade)
png/          # Raster transparente (gerado)
BRAND-GUIDELINES.md
```

## Regenerar PNGs e favicons

```bash
npm run export:brand
```

Isso gera favicon (`src/app/icon.png`), Apple touch icon (`src/app/apple-icon.png`) e todos os tamanhos em `png/`.

## Componentes React

- `src/components/brand/mesio-mark.tsx` — símbolo SVG
- `src/components/brand/logo.tsx` — lockup completo
