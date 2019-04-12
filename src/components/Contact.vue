<template>
    <span>
        <octicon :icon="icon" />&nbsp;
        <template v-if="type==='pgp'">PGP Fingerprint <code>{{ content }}</code></template>
        <a
            v-else
            rel="me noopener"
            :href="url"
            :itemprop="itempropType"
        >{{ content }}</a>
    </span>
</template>
<script>
import Octicon from '../components/Octicon.vue';

const ICONS = {
        'email': 'mail',
        'matrix': 'comment-discussion',
        'pgp': 'key',
        'social': 'mention'
    },

    ITEMPROP = {
        'email': 'email',
        'matrix': 'im'
    };

export default {
    name: 'Contact',
    components: {
        Octicon
    },
    props: {
        content: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    computed: {
        url() {
            switch(this.type) {
            case 'email':
                return `mailto:${encodeURI(this.content)}`;
            case 'matrix':
                return `https://matrix.to/#/${encodeURI(this.content)}`;
            default:
                return this.content;
            }
        },
        icon() {
            return ICONS[this.type];
        },
        itempropType() {
            return ITEMPROP[this.type];
        }
    }
};
</script>
<style scoped>
span {
    font-size: 1.2rem;
    line-height: 3rem;
}
</style>
