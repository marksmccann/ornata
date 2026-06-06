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
                    label: "Getting Started",
                    items: [{ label: "Introduction", slug: "intro" }],
                },
            ],
        }),
    ],
});
