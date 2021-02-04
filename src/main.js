// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from './layouts/Default.vue';
import beSvg from './assets/be.svg';
import beImg from './favicon.png';

export default function(Vue, {
    head
}) {
    // Set default layout as a global component
    Vue.component('Layout', DefaultLayout);

    head.htmlAttrs = { lang: 'en' };

    //TODO
    head.link.push({
        rel: 'icon',
        href: beSvg,
        sizes: 'any',
        type: 'image/svg'
    });

    head.meta.push(
        {
            name: 'msapplication-TileImage',
            content: beImg
        },
        {
            name: 'msapplication-TileColor',
            content: '#000000'
        },
        {
            name: 'theme-color',
            content: '#2A2A2A'
        }
    );
}
