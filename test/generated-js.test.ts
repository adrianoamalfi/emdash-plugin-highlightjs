import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const source = readFileSync(resolve(__dirname, "../src/sandbox-entry.ts"), "utf-8");

describe("Theme toggle JS", () => {
  it("contains MutationObserver for theme changes", () => {
    expect(source).toContain("MutationObserver");
    expect(source).toContain("attributeFilter:['class']");
  });

  it("toggles hljs-l and hljs-d based on dark class", () => {
    expect(source).toContain("document.documentElement.classList.contains('dark')");
    expect(source).toContain("l.disabled=x");
    expect(source).toContain("d.disabled=!x");
  });
});

describe("Copy button JS", () => {
  it("adds .emdash-copy-btn to .emdash-code elements", () => {
    expect(source).toContain('.emdash-code');
    expect(source).toContain('.emdash-copy-btn');
  });

  it("copies code text to clipboard", () => {
    expect(source).toContain("navigator.clipboard.writeText");
    expect(source).toContain("el.querySelector('code')?.textContent");
  });

  it("shows 'Copied!' feedback for 2 seconds", () => {
    expect(source).toContain("Copied!");
    expect(source).toContain("setTimeout");
    expect(source).toContain("2000");
  });
});

describe("Constants", () => {
  it("has 12 themes", () => {
    const themes = ["github", "atom-one", "vs", "a11y", "stackoverflow", "tokyo-night", "rose-pine", "panda", "monokai", "dracula", "nord", "night-owl"];
    for (const t of themes) {
      expect(source).toContain(t);
    }
  });

  it("has defaults for theme and copyButton", () => {
    expect(source).toContain('theme: "github"');
    expect(source).toContain("copyButton: true");
  });
});

describe("CSS cache", () => {
  it("caches theme CSS to avoid repeated reads", () => {
    expect(source).toContain("cssCache[name]");
    expect(source).toContain("cssCache[name] = css");
  });
});

describe("Plugin definition", () => {
  it("exports createPlugin with definePlugin", () => {
    expect(source).toContain("createPlugin");
    expect(source).toContain("definePlugin");
  });

  it("declares id and version in descriptor", () => {
    const indexSource = readFileSync(resolve(__dirname, "../src/index.ts"), "utf-8");
    expect(indexSource).toContain('id: "highlightjs"');
    expect(indexSource).toContain('version: "0.1.0"');
  });

  it("has page:fragments hook", () => {
    expect(source).toContain('"page:fragments"');
  });

  it("has plugin:install hook", () => {
    expect(source).toContain('"plugin:install"');
  });

  it("has admin route", () => {
    expect(source).toContain("form_submit");
    expect(source).toContain("copy_button");
  });
});

describe("CSS injection", () => {
  it("injects light/dark CSS via style tags", () => {
    expect(source).toContain('id="hljs-l"');
    expect(source).toContain('id="hljs-d"');
    expect(source).toContain('disabled');
  });
});

describe("Code.astro component", () => {
  const astroPath = resolve(__dirname, "../src/astro/Code.astro");
  const astroSource = readFileSync(astroPath, "utf-8");

  it("uses highlight.js for syntax highlighting", () => {
    expect(astroSource).toContain("hljs.highlight");
    expect(astroSource).toContain("hljs.highlightAuto");
  });

  it("handles missing language gracefully", () => {
    expect(astroSource).toContain("highlightAuto");
    expect(astroSource).toContain("ignoreIllegals");
  });

  it("escapes HTML when highlighting fails", () => {
    expect(astroSource).toContain("replace(/&/g");
    expect(astroSource).toContain("replace(/</g");
    expect(astroSource).toContain("replace(/>/g");
  });

  it("renders code in a pre/code block", () => {
    expect(astroSource).toContain(".emdash-code");
    expect(astroSource).toContain("<code");
  });

  it("supports filename display", () => {
    expect(astroSource).toContain("filename");
    expect(astroSource).toContain("emdash-code-filename");
  });
});
