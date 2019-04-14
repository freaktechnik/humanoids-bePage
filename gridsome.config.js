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
        }
    ]
};
