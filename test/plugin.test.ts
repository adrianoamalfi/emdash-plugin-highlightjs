import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Plugin structure", () => {
  const indexPath = resolve(__dirname, "../src/index.ts");
  const source = readFileSync(indexPath, "utf-8");

  it("exports a function named highlightjsPlugin", () => {
    expect(source).toMatch(/export\s+function\s+highlightjsPlugin/);
  });

  it("has correct plugin id", () => {
    expect(source).toContain('id: "highlightjs"');
  });

  it("uses native format", () => {
    expect(source).toContain('format: "native"');
  });

  it("uses bare specifier entrypoint", () => {
    expect(source).toContain('"emdash-plugin-highlightjs/sandbox"');
  });

  it("has componentsEntry", () => {
    expect(source).toContain('"emdash-plugin-highlightjs/astro"');
  });

  it("declares page-fragments capability", () => {
    expect(source).toContain("hooks.page-fragments:register");
  });

  it("declares admin settings page", () => {
    expect(source).toContain("/settings");
    expect(source).toContain("code");
  });
});
