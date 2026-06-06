import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: "https://marksmccann.github.io",
    base: "/ornata",
    integrations: [
        starlight({
            title: "Ornata",
            description:
                "A progressive enhancement framework for server-rendered websites",
            sidebar: [
                {
                    label: "Introduction",
                    items: [
                        { label: "Overview", slug: "" },
                        { label: "Why Ornata", slug: "why-ornata" },
                    ],
                },
                {
                    label: "Guides",
                    items: [
                        {
                            label: "Essentials",
                            items: [
                                {
                                    label: "Getting Started",
                                    slug: "guides/getting-started",
                                },
                                {
                                    label: "Mental Model",
                                    slug: "guides/mental-model",
                                },
                                {
                                    label: "Your First Component",
                                    slug: "guides/your-first-component",
                                },
                                {
                                    label: "Initializing From HTML",
                                    slug: "guides/initializing-from-html",
                                },
                                {
                                    label: "Page Bootstrap",
                                    slug: "guides/page-bootstrap",
                                },
                            ],
                        },
                        {
                            label: "Core Concepts",
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
                                    label: "Computed",
                                    slug: "guides/computed",
                                },
                                {
                                    label: "Methods",
                                    slug: "guides/methods",
                                },
                                {
                                    label: "Data",
                                    slug: "guides/data",
                                },
                                {
                                    label: "Safe DOM References",
                                    slug: "guides/safe-dom-references",
                                },
                                {
                                    label: "Render Options",
                                    slug: "guides/render-options",
                                },
                                {
                                    label: "Lifecycle",
                                    slug: "guides/lifecycle",
                                },
                            ],
                        },
                        {
                            label: "Reactivity",
                            items: [
                                {
                                    label: "Rendering and Reaction",
                                    slug: "guides/rendering-and-reaction",
                                },
                                {
                                    label: "Watchers",
                                    slug: "guides/watchers",
                                },
                                {
                                    label: "State Listeners",
                                    slug: "guides/state-listeners",
                                },
                            ],
                        },
                        {
                            label: "Reference Patterns",
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
                            label: "createInitializer",
                            slug: "api/create-initializer",
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
                        { label: "Disclosure", slug: "examples/disclosure" },
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
