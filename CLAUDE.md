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

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
