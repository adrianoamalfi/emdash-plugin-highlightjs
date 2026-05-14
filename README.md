# emdash-plugin-highlightjs

[![CI](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/actions/workflows/ci.yml/badge.svg)](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/actions/workflows/ci.yml)
[![Security](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/actions/workflows/security.yml/badge.svg)](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/actions/workflows/security.yml)
[![npm version](https://img.shields.io/npm/v/emdash-plugin-highlightjs)](https://www.npmjs.com/package/emdash-plugin-highlightjs)

Syntax highlighting for [EmDash CMS](https://emdashcms.com) using [Highlight.js](https://highlightjs.org/). Features 12 themes, auto dark/light switching, a copy button, and a custom Portable Text code block component.

## Features

- **12 themes** — GitHub, Atom One, VS Code, A11Y, Stack Overflow, Tokyo Night, Rose Pine, Panda, Monokai, Dracula, Nord, Night Owl
- **Auto dark/light** — Themes with both variants switch via `MutationObserver` on `<html>` class
- **Copy button** — Optional floating copy button with "Copied!" feedback
- **Portable Text block** — `Code.astro` component with language detection and filename support
- **Admin settings** — Theme picker and copy button toggle at `/_emdash/admin`
- **CSS caching** — Theme CSS read once and cached in memory
- **Server-side highlighting** — No client JS cost for syntax highlighting

## Prerequisites

- EmDash CMS `^0.12.0`
- Your base layout must include `<EmDashHead />` and `<EmDashBodyEnd />` — the plugin injects theme CSS and copy button scripts via these hooks.
- This plugin uses the **native format** and must be placed in `plugins: []` (not `sandboxed: []`).

## Installation

```bash
npm install emdash-plugin-highlightjs
```

## Usage

Register the plugin in `astro.config.mjs`:

```ts
import { highlightjsPlugin } from "emdash-plugin-highlightjs";
import emdash from "emdash/astro";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [highlightjsPlugin()],  // native format — only works in plugins: []
      // database and storage remain unchanged
    }),
  ],
});
```

Theme CSS and the copy button are injected automatically on all public pages. The `Code.astro` component renders `code` blocks in Portable Text content — make sure `code` is a registered block type in your Portable Text schema configuration.

## How It Works

The plugin injects four fragments via the `page:fragments` hook:

1. **Light CSS** (`<style id="hljs-l">`) in `<head>`
2. **Dark CSS** (`<style id="hljs-d" disabled>`) in `<head>`
3. **Theme toggle script** in `<head>` — `MutationObserver` on `<html>.class`
4. **Copy button script** at `<body:end>`

The `Code.astro` component renders code server-side via `highlight.js` — no client-side highlighting overhead.

## Admin Settings

Navigate to `/_emdash/admin` → **Highlight.js**.

| Field | Default | Description |
|---|---|---|
| Syntax Theme | `github` | Pick from 12 themes |
| Show copy button | `true` | Toggle floating copy button |

## Themes

| Theme | Dark variant | Light variant |
|---|---|---|
| GitHub | `github-dark` | `github` |
| Atom One | `atom-one-dark` | `atom-one-light` |
| VS Code | `vs2015` | `vs` |
| A11Y | `a11y-dark` | `a11y-light` |
| Stack Overflow | `stackoverflow-dark` | `stackoverflow-light` |
| Tokyo Night | `tokyo-night-dark` | `tokyo-night-light` |
| Rose Pine | `rose-pine` | `rose-pine-dawn` |
| Panda | `panda-syntax-dark` | `panda-syntax-light` |
| Monokai | `monokai` | — |
| Dracula | `dracula` | — |
| Nord | `nord` | — |
| Night Owl | `night-owl` | — |

Themes with both variants switch automatically with your site's dark/light mode. Single-variant themes use the dark CSS only.

## Development

```bash
git clone https://github.com/adrianoamalfi/emdash-plugin-highlightjs.git
cd emdash-plugin-highlightjs
npm install
npm run typecheck
npm test
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/). Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release) — pushing `fix:`, `feat:`, or `BREAKING CHANGE:` commits to `main` triggers a release to npm and GitHub.

## License

MIT © Adriano Amalfi
