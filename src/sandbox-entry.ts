import { definePlugin } from "emdash";
import type { PluginContext } from "emdash";
import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url);

const SETTINGS_KEY = "settings:all";

interface ThemeDef {
	id: string;
	label: string;
	dark: string;
	light: string | null;
}

const THEMES: ThemeDef[] = [
	{ id: "github", label: "GitHub", dark: "github-dark", light: "github" },
	{ id: "atom-one", label: "Atom One", dark: "atom-one-dark", light: "atom-one-light" },
	{ id: "vs", label: "VS Code", dark: "vs2015", light: "vs" },
	{ id: "a11y", label: "A11Y", dark: "a11y-dark", light: "a11y-light" },
	{
		id: "stackoverflow",
		label: "Stack Overflow",
		dark: "stackoverflow-dark",
		light: "stackoverflow-light",
	},
	{
		id: "tokyo-night",
		label: "Tokyo Night",
		dark: "tokyo-night-dark",
		light: "tokyo-night-light",
	},
	{ id: "rose-pine", label: "Rose Pine", dark: "rose-pine", light: "rose-pine-dawn" },
	{ id: "panda", label: "Panda", dark: "panda-syntax-dark", light: "panda-syntax-light" },
	{ id: "monokai", label: "Monokai", dark: "monokai", light: null },
	{ id: "dracula", label: "Dracula", dark: "dracula", light: null },
	{ id: "nord", label: "Nord", dark: "nord", light: null },
	{ id: "night-owl", label: "Night Owl", dark: "night-owl", light: null },
];

const DEFAULTS: Record<string, unknown> = {
	theme: "github",
	copyButton: true,
};

let cssCache: Record<string, string> = {};

function getThemeCss(name: string): string {
	if (cssCache[name]) return cssCache[name];
	try {
		const cssPath = require.resolve(`highlight.js/styles/${name}.css`);
		const css = fs.readFileSync(cssPath, "utf-8");
		cssCache[name] = css;
		return css;
	} catch {
		return "";
	}
}

function themeToggleJs(): string {
	return `(()=>{
var l=document.getElementById('hljs-l'),d=document.getElementById('hljs-d');
function u(){
var x=document.documentElement.classList.contains('dark')||(!document.documentElement.classList.contains('light')&&window.matchMedia('(prefers-color-scheme:dark)').matches);
if(l)l.disabled=x;
if(d)d.disabled=!x;
}
u();
var o=new MutationObserver(function(){u()});
o.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
})();`;
}

function copyButtonJs(): string {
	return `(()=>{
const s=document.createElement('style');
s.textContent='.emdash-code{position:relative}.emdash-copy-btn{position:absolute;top:8px;right:8px;padding:4px 8px;font-size:12px;background:#ffffff22;color:#ccc;border:1px solid #ffffff44;border-radius:4px;cursor:pointer;font-family:system-ui,sans-serif;opacity:0;transition:opacity .15s;z-index:1}.emdash-code:hover .emdash-copy-btn,.emdash-copy-btn:focus{opacity:1}.emdash-copy-btn:hover{background:#ffffff44}.emdash-copy-btn.copied{background:#22c55e22;border-color:#22c55e44;color:#22c55e}';
document.head.appendChild(s);
document.querySelectorAll('.emdash-code').forEach(function(el){
const b=document.createElement('button');
b.className='emdash-copy-btn';
b.setAttribute('aria-label','Copy code to clipboard');
b.textContent='Copy';
b.onclick=function(){
const txt=el.querySelector('code')?.textContent||'';
navigator.clipboard.writeText(txt).then(function(){
b.textContent='Copied!';
b.classList.add('copied');
setTimeout(function(){b.textContent='Copy';b.classList.remove('copied')},2000);
}).catch(function(){b.textContent='Failed'});
};
el.appendChild(b);
});
})();`;
}

async function getSettings(ctx: PluginContext): Promise<Record<string, unknown>> {
	const stored = await ctx.kv.get<Record<string, unknown>>(SETTINGS_KEY);
	return { ...DEFAULTS, ...(stored || {}) };
}

function clearCache(): void {
	cssCache = {};
}

export function createPlugin() {
	return definePlugin({
		id: "highlightjs",
		version: "1.0.0",
		capabilities: ["hooks.page-fragments:register"],
		hooks: {
			"plugin:install": async (_event: unknown, ctx: PluginContext) => {
				await ctx.kv.set(SETTINGS_KEY, { ...DEFAULTS });
			},

			"page:fragments": async (_event: unknown, ctx: PluginContext) => {
				const settings = await getSettings(ctx);
				const fragments: Array<{
					kind: string;
					placement: string;
					html?: string;
					code?: string;
				}> = [];

				const themeId = settings.theme as string;
				const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];

				if (theme.dark && theme.light) {
					const darkCss = getThemeCss(theme.dark);
					const lightCss = getThemeCss(theme.light);
					if (lightCss) {
						fragments.push({
							kind: "html",
							placement: "head",
							html: `<style id="hljs-l">${lightCss}</style>`,
						});
					}
					if (darkCss) {
						fragments.push({
							kind: "html",
							placement: "head",
							html: `<style id="hljs-d" disabled>${darkCss}</style>`,
						});
					}
					if (lightCss || darkCss) {
						fragments.push({
							kind: "inline-script",
							placement: "head",
							code: themeToggleJs(),
						});
					}
				} else {
					const variant = theme.dark || theme.light;
					if (variant) {
						const css = getThemeCss(variant);
						if (css) {
							fragments.push({
								kind: "html",
								placement: "head",
								html: `<style>${css}</style>`,
							});
						}
					}
				}

				if (settings.copyButton) {
					fragments.push({
						kind: "inline-script",
						placement: "body:end",
						code: copyButtonJs(),
					});
				}

				return fragments;
			},
		},

		routes: {
			admin: {
			handler: async (routeCtx: { input: Record<string, unknown>; request: Request }, ctx: PluginContext) => {
				const interaction = routeCtx.input as Record<string, any>;

				if (interaction.type === "page_load") {
					return { blocks: buildForm(await getSettings(ctx)) };
				}

				if (interaction.type === "form_submit" && interaction.action_id === "save") {
					try {
						const values = interaction.values ?? {};
						const s: Record<string, unknown> = {};
						if (values.theme !== undefined) {
							if (!THEMES.some(t => t.id === values.theme)) {
								throw new Error("Invalid theme selected.");
							}
							s.theme = values.theme;
						}
						if (values.copy_button !== undefined) s.copyButton = values.copy_button;
						await ctx.kv.set(SETTINGS_KEY, { ...DEFAULTS, ...s });
						clearCache();
						return {
							blocks: [
								{ type: "banner", title: "Settings saved.", variant: "default" },
								...buildForm(await getSettings(ctx)),
							],
						};
					} catch {
						return {
							blocks: [
								{ type: "banner", title: "Failed to save settings.", variant: "error" },
								...buildForm(await getSettings(ctx)),
							],
						};
					}
				}

				return { blocks: [{ type: "header", text: "Highlight.js Settings" }] };
			},
			},
		},
	} as any);
}

export default createPlugin;

function buildForm(s: Record<string, unknown>) {
	return [
		{ type: "header", text: "Highlight.js Settings" },
		{ type: "context", text: "Themes with both dark and light variants follow your site's theme automatically." },
		{
			type: "form",
			block_id: "settings",
			fields: [
				{
					type: "select",
					action_id: "theme",
					label: "Syntax Theme",
					initial_value: s.theme,
					options: THEMES.map((t) => ({ value: t.id, label: t.label })),
				},
				{
					type: "toggle",
					action_id: "copy_button",
					label: "Show copy button on code blocks",
					initial_value: s.copyButton,
				},
			],
			submit: { label: "Save", action_id: "save" },
		},
	];
}
