"use strict";
// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const info = require("./src/data/info.json");

module.exports = {
    siteName: info.title,
    siteDescription: "Personal page of Martin Giger. Mainly links to profiles on other pages.",
    siteUrl: "https://humanoids.be",
    plugins: [
        {
            use: '@gridsome/source-wordpress',
            options: {
                baseUrl: 'https://humanoids.be/log',
                typeName: 'Blog'
            }
        },
        {
            use: '@gridsome/plugin-critical',
            options: {
                paths: [ '/' ],
                width: 1300,
                height: 900
            }
        },
        {
            use: '@gridsome/plugin-sitemap',
            options: {
                cacheTime: 600000, // default
                exclude: [],
                output: '/sitemap_index.xml',
                config: {
                    '/about': {
                        changefreq: 'yearly',
                        priority: 0.7
                    },
                    '/archive': {
                        changefreq: 'yearly',
                        priority: 0.3
                    }
                }
            }
        },
        {
            use: 'gridsome-plugin-pwa',
            options: {
                title: 'Martin Giger',
                startUrl: '/',
                display: 'standalone',
                statusBarStyle: 'default',
                manifestPath: 'manifest.json',
                serviceWorkerPath: 'service-worker.js',
                cachedFileTypes: 'js,json,css,html,png,jpg,jpeg,svg,woff,woff2,eot,ttf',
                shortName: 'M. Giger',
                themeColor: '#E5B137',
                backgroundColor: '#000000',
                icon: './src/favicon.png', // must be provided
                msTileImage: './src/favicon.png',
                msTileColor: '#000000'
            }
        }
    ]
};
