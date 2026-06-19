import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import starlightThemeNord from 'starlight-theme-nord';

export default defineConfig({
    site: "https://marksmccann.github.io",
    base: "/ornata",
    integrations: [
        starlight({
            title: "Ornata",
            description:
                "A progressive enhancement framework for HTML-first applications",
            favicon: "/favicon.ico",
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/marksmccann/ornata",
                },
            ],
            plugins: [starlightThemeNord()],
            components: {
                Head: "./src/components/Head.astro",
                SiteTitle: "./src/components/SiteTitle.astro",
            },
            customCss: ["/src/styles/home.css"],
            sidebar: [
                {
                    label: "Introduction",
                    items: [
                        { label: "Overview", slug: "" },
                        { label: "Why Ornata?", slug: "why-ornata" },
                        { label: "Mental Model", slug: "mental-model" },
                    ],
                },
                {
                    label: "Guides",
                    items: [
                        {
                            label: "First Steps",
                            items: [
                                {
                                    label: "Getting Started",
                                    slug: "guides/getting-started",
                                },
                                {
                                    label: "Your First Component",
                                    slug: "guides/your-first-component",
                                },
                                {
                                    label: "Page Bootstrap",
                                    slug: "guides/page-bootstrap",
                                },
                            ],
                        },
                        {
                            label: "Component Model",
                            items: [
                                {
                                    label: "Component Anatomy",
                                    slug: "guides/component-anatomy",
                                },
                                {
                                    label: "State",
                                    slug: "guides/state",
                                },
                                {
                                    label: "State Update Flow",
                                    slug: "guides/update-flow",
                                },
                                {
                                    label: "Computed",
                                    slug: "guides/computed",
                                },
                                {
                                    label: "Watchers",
                                    slug: "guides/watchers",
                                },
                                {
                                    label: "State Listeners",
                                    slug: "guides/state-listeners",
                                },
                                {
                                    label: "Methods",
                                    slug: "guides/methods",
                                },
                                {
                                    label: "Lifecycle",
                                    slug: "guides/lifecycle",
                                },
                                {
                                    label: "Data",
                                    slug: "guides/data",
                                },
                                {
                                    label: "Elements",
                                    slug: "guides/elements",
                                },
                                {
                                    label: "Render Options",
                                    slug: "guides/render-options",
                                },
                            ],
                        },
                        {
                            label: "Integration",
                            items: [
                                {
                                    label: "Instances and Mounting",
                                    slug: "guides/instances-and-mounting",
                                },
                                {
                                    label: "Safeguards",
                                    slug: "guides/safeguards",
                                },
                                {
                                    label: "TypeScript",
                                    slug: "guides/typescript",
                                },
                                {
                                    label: "Browser Global",
                                    slug: "guides/browser-global",
                                },
                                {
                                    label: "Testing with Vitest",
                                    slug: "guides/testing-with-vitest",
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "API Reference",
                    items: [
                        { label: "API Overview", slug: "api" },
                        {
                            label: "defineComponent",
                            slug: "api/define-component",
                        },
                        {
                            label: "mountAll",
                            slug: "api/mount-all",
                        },
                        { label: "isComponent", slug: "api/is-component" },
                        {
                            label: "Component Instance",
                            slug: "api/component-instance",
                        },
                    ],
                },
                {
                    label: "Examples",
                    items: [
                        { label: "Counter", slug: "examples/counter" },
                        {
                            label: "Markup Augmentation",
                            slug: "examples/markup-augmentation",
                        },
                        {
                            label: "HTML State",
                            slug: "examples/html-state",
                        },
                        {
                            label: "Watchers and Listeners",
                            slug: "examples/watchers-and-listeners",
                        },
                        {
                            label: "Component Methods",
                            slug: "examples/component-methods",
                        },
                        {
                            label: "List Rendering",
                            slug: "examples/list-rendering",
                        },
                        {
                            label: "Persistent Data",
                            slug: "examples/persistent-data",
                        },
                        {
                            label: "Element Safeguards",
                            slug: "examples/element-safeguards",
                        },
                        { label: "Live Filter", slug: "examples/live-filter" },
                    ],
                },
                {
                    label: "Tutorials",
                    items: [
                        {
                            label: "Build a Disclosure",
                            slug: "tutorials/build-a-disclosure",
                        },
                    ],
                },
            ],
        }),
        mdx(),
    ],
});
