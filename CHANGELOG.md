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
