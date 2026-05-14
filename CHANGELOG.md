# 1.0.0 (2026-05-14)


### Bug Fixes

* remove cache:npm from CI - no lockfile in plugin ([67de5c8](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/commit/67de5c8bcd8b4a49aafa21b9534db8440bba9763))
* resolve TypeScript errors in CI (Astro module declaration, fragment type) ([630d15a](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/commit/630d15a8a226f77df73e4a6e03d53b260c163a6a))
* use npm install instead of npm ci in CI (no lockfile) ([d1276c7](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/commit/d1276c7614a3c74ac791a179fbe9ba52cb05bd4a))
* use npx -p typescript tsc --noEmit in CI ([fe25fb7](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/commit/fe25fb7620b61c605d6543d3fa43ba3ecaf62e42))


### Features

* initial release - syntax highlighting plugin for EmDash CMS ([1ba582c](https://github.com/adrianoamalfi/emdash-plugin-highlightjs/commit/1ba582c53204515b37e24e234504ff477991d316))

# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release)
using [Conventional Commits](https://www.conventionalcommits.org/).

## [1.0.0] — 2026-05-13

### Added

- Syntax highlighting via Highlight.js with 12 themes (GitHub, Atom One, VS Code, A11Y, Stack Overflow, Tokyo Night, Rose Pine, Panda, Monokai, Dracula, Nord, Night Owl).
- Automatic dark/light mode switching using `MutationObserver` on `<html>` class.
- Configurable copy button on code blocks.
- Admin settings panel at `/_emdash/admin` for theme selection and copy button toggle.
- Portable Text custom block component (`Code.astro`) with `highlight.js` rendering, auto-language detection, and filename support.
