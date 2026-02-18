# CLAUDE.md

## Project Overview
Vue 3 application using Vite as the build tool.

## Sass Guidelines

Use the modern Sass module system. Avoid deprecated global functions that will be removed in Dart Sass 3.0.0.

### Color Functions
Instead of deprecated global functions like `darken()`, `lighten()`, `saturate()`, etc., use the `sass:color` module:

```scss
@use "sass:color";

// Instead of: darken($color, 15%)
color.adjust($color, $lightness: -15%)

// Instead of: lighten($color, 15%)
color.adjust($color, $lightness: 15%)
```

### Nesting
Nest SCSS selectors to mirror the DOM hierarchy of the component template.

## Button Styles
Global button styles are defined in `src/App.vue` using the `sqmgrButton` mixin. Always use the existing global button classes rather than writing custom button styles in components:
- Default `<button>` — green primary button (`$primary`)
- `button.destructive` — red button (`$red`)
- `button.secondary` — outlined primary button
- `button.sm` — smaller variant
- `button.lg` — larger variant

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
