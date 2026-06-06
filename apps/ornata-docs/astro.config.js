import { defineConfig } from 'astro/config';
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
                            label: "Getting Started",
                            slug: "guides/getting-started",
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
                            label: "Component Anatomy",
                            slug: "guides/component-anatomy",
                        },
                        {
                            label: "Rendering and Reaction",
                            slug: "guides/rendering-and-reaction",
                        },
                        {
                            label: "Mental Model",
                            slug: "guides/mental-model",
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
    ],
});
