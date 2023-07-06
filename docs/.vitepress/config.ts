import { defineConfig } from 'vitepress'

const KONG_SVG = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Kong API Gateway and Service Connectivity Platform</title><path fill-rule="evenodd" clip-rule="evenodd" d="m16.28 36.66 1-1.3h7.45l3.88 4.96-.7 1.68h-9.6l.24-1.68-2.27-3.66Z" fill="#169FCC"/><path fill-rule="evenodd" clip-rule="evenodd" d="m18.55 19.75 3.6-6.21h4.19L45.1 35.35 43.65 42H35.6l.5-1.87-17.55-20.38Z" fill="#14B59A"/><path fill-rule="evenodd" clip-rule="evenodd" d="m22.92 12.36 1.72-3.19L29.8 5l8.85 6.94-1.15 1.17 1.54 2.13v2.28l-4.4 3.6-7.4-8.76h-4.32Z" fill="#1BC263"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.25 26.23h2.33l6.1-5.1 8.08 9.4-2.28 3.41h-7.46l-5.15 6.55L9.7 42H3v-8.03l6.25-7.74Z" fill="#16BDCC"/></svg>'

export default defineConfig({
  base: '/',
  lang: 'en-US',
  title: 'Kong Icons',
  description: 'Kong Icon Library',
  head: [
    ['meta', { name: 'theme-color', content: '#1456cb' }],
    ['meta', { name: 'msapplication-TileColor', content: '#1456cb' }],
    ['meta', { name: 'application-name', content: 'Kong Icon Library' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Kong Icon Library' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // Inter font-family
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', crossorigin: 'true' }],
    // Algolia Search
    // ['link', { rel: 'preconnect', href: 'https://6MM6JXMAAD-dsn.algolia.net', crossorigin: 'true' }],
  ],
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  appearance: false, // Disable dark mode (If enabled, we'd first need to update Kongponent CSS to handle accordingly)
  themeConfig: {
    sidebar: {
      // Icons sidebar
      '/icons/': [
        {
          text: 'Icons',
          collapsed: false,
          items: [
            { text: 'Test', link: '/icons/test' },
          ]
        },
      ],
      // Guide Sidebar
      '/guide/': [
        {
          text: 'Guide',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Usage', link: '/guide/usage' },
          ]
        },
        {
          text: 'Styles',
          collapsed: false,
          items: [
            { text: 'Theming', link: '/guide/styles/theming' },
          ]
        },
        {
          text: 'Contributing',
          collapsed: false,
          items: [
            { text: 'Setup', link: '/guide/contributing' },
            { text: 'Adding Icons to KIcon', link: '/guide/adding-icons-to-kicon' },
          ]
        },
      ],
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Components', link: '/components/alert', activeMatch: '/components/' },
      {
        text: `v8.x`,
        items: [
          {
            text: 'v7.x',
            link: 'https://legacy.kongponents.konghq.com',
          },
        ],
      },
    ],
    logo: '/img/kong-logomark.png',
    siteTitle: 'Kong Icon Library',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kong/icons' },
      { link: 'https://konghq.com', icon: { svg: KONG_SVG } },
    ],
    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2023-present <a href="https://konghq.com" target="_blank">Kong, Inc.</a>'
    },
    editLink: {
      pattern: 'https://github.com/Kong/icons/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    outline: [2, 3],
    // algolia: {
    //   appId: '63M5R2GSFP',
    //   apiKey: 'ff2ad6c629df9c094a93a92a500added',
    //   indexName: 'kongponents-konghq'
    // },
  },
})
