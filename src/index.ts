import type { PluginDescriptor } from "emdash";

export function highlightjsPlugin(): PluginDescriptor {
	return {
		id: "highlightjs",
		version: "1.0.0",
		format: "native",
		entrypoint: "emdash-plugin-highlightjs/sandbox",
		componentsEntry: "emdash-plugin-highlightjs/astro",
		options: {},
		capabilities: ["hooks.page-fragments:register"],
		adminPages: [{ path: "/settings", label: "Highlight.js", icon: "code" }],
	};
}
