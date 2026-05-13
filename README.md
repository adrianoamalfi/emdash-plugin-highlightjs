# emdash-plugin-highlightjs

Syntax highlighting for [EmDash CMS](https://emdashcms.com) using [Highlight.js](https://highlightjs.org/). Features 12 themes, automatic dark/light mode switching, a configurable copy button, and a custom code block component for Portable Text.

## Features

- **12 themes** — GitHub, Atom One, VS Code, A11Y, Stack Overflow, Tokyo Night, Rose Pine, Panda, Monokai, Dracula, Nord, Night Owl
- **Auto dark/light** — Themes with both variants switch via `MutationObserver` on `<html>` class
- **Copy button** — Optional floating copy button on code blocks with "Copied!" feedback
- **Admin settings** — Theme picker and copy button toggle at `/_emdash/admin`
- **Portable Text block** — `Code.astro` component renders highlighted code with language detection and filename support
- **CSS caching** — Theme CSS is read once and cached in memory
- **No client JS for highlighting** — Highlighting happens server-side in the Astro component

## How It Works

The plugin uses the `page:fragments` hook to inject theme CSS and a small theme-toggle script into every public page:

1. **Light CSS** (`<style id="hljs-l">` in `<head>`) — Active when the site is in light mode
2. **Dark CSS** (`<style id="hljs-d" disabled>` in `<head>`) — Active when the site is in dark mode
3. **Theme toggle script** (`<script>` in `<head>`) — Observes `<html>` class changes to swap which stylesheet is enabled
4. **Copy button script** (`<script>` at `<body:end>`) — Adds copy buttons to `.emdash-code` blocks

The `Code.astro` component renders code server-side using `highlight.js`, so there's no client-side highlighting cost.

## Installation

```bash
npm install github:adrianoamalfi/emdash-plugin-highlightjs
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "emdash-plugin-highlightjs": "github:adrianoamalfi/emdash-plugin-highlightjs"
  }
}
```

### From a local path (development)

```bash
npm install ./path/to/emdash-plugin-highlightjs
```

## Usage

Register the plugin in your `astro.config.mjs`:

```ts
import node from "@astrojs/node";
import react from "@astrojs/react";
import { highlightjsPlugin } from "emdash-plugin-highlightjs";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    emdash({
      database: sqlite({ url: "file:./data.db" }),
      storage: local({ directory: "./uploads", baseUrl: "/_emdash/api/media/file" }),
      plugins: [highlightjsPlugin()],
    }),
  ],
});
```

The syntax highlighting CSS and copy button are injected automatically on all public pages. The `Code.astro` component is used automatically for `code` blocks in Portable Text content.

## Admin Settings

Navigate to `/_emdash/admin` and open **Highlight.js** in the sidebar.

| Field | Default | Description |
|---|---|---|
| Syntax Theme | `github` | Pick from 12 themes |
| Show copy button | `true` | Toggle the floating copy button on code blocks |

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
| Monokai | `monokai` | *(none)* |
| Dracula | `dracula` | *(none)* |
| Nord | `nord` | *(none)* |
| Night Owl | `night-owl` | *(none)* |

Themes with both variants switch automatically based on the site's dark/light mode. Themes without a light variant use the dark CSS exclusively.

## Dark/Light Mode Detection

The plugin injects a `MutationObserver` that watches the `class` attribute on `<html>`. When your site toggles between `.dark` and `.light` classes (or the OS preference changes via `prefers-color-scheme`), the observer enables the corresponding theme stylesheet and disables the other.

This integrates with any theme system that uses `.dark`/`.light` classes on `<html>` — including the default EmDash blog template.

## Copy Button

When enabled, the plugin adds a small "Copy" button to the top-right corner of every `.emdash-code` block. On click, it copies the code text to the clipboard and shows "Copied!" feedback for 2 seconds.

The button appears on hover and is keyboard-focusable for accessibility.

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

| Type | Release | Example |
|---|---|---|
| `fix` | Patch | `fix: copy button not showing on mobile` |
| `feat` | Minor | `feat: add new dracula theme variant` |
| `BREAKING CHANGE` | Major | `feat: switch to shiki\n\nBREAKING CHANGE: drop highlight.js support` |
| `chore`, `docs`, etc. | No release | `docs: fix README typo` |

## Development

```bash
git clone https://github.com/adrianoamalfi/emdash-plugin-highlightjs.git
cd emdash-plugin-highlightjs
npm install
```

### Scripts

```bash
npm run typecheck    # Run TypeScript type checking
npm test             # Run test suite (vitest)
npm run test:watch   # Run tests in watch mode
```

### Tests

Tests validate the generated JavaScript, plugin structure, and Code.astro component without requiring EmDash to be installed.

```bash
npm test
```

### Project Structure

```
emdash-plugin-highlightjs/
├── src/
│   ├── index.ts            # Plugin descriptor (entrypoint, capabilities, admin pages)
│   ├── sandbox-entry.ts    # Hook handlers, settings, theme injection
│   └── astro/
│       ├── index.ts        # Block components export (code → Code.astro)
│       └── Code.astro      # Portable Text code block with highlight.js
├── test/
│   ├── plugin.test.ts      # Plugin structure tests
│   └── generated-js.test.ts # JS generation, theme toggle, copy button tests
├── .github/
│   ├── dependabot.yml      # Weekly npm updates
│   └── workflows/
│       ├── ci.yml          # Type check + tests + package validation
│       └── release.yml     # semantic-release on push to main
├── CHANGELOG.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── LICENSE
└── .gitignore
```

## CI

Pull requests and pushes to `main` run:

- **Type checking** — `tsc --noEmit`
- **Tests** — `vitest run` (12+ tests)
- **Package validation** — Verifies `package.json` structure

## Versioning

This project follows [Semantic Versioning](https://semver.org/). Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release) on every push to `main` with `fix:`, `feat:`, or `BREAKING CHANGE` commits.

## License

MIT © Adriano Amalfi
