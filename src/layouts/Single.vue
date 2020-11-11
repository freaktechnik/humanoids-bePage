<template>
    <div class="outer">
        <div class="single">
            <slot />
        </div>
        <global-footer />
    </div>
</template>

<script>
import GlobalFooter from '../components/Footer.vue';

export default {
    components: {
        GlobalFooter
    },
    metaInfo() {
        const META_NAME = this.$static.metadata.name;
        return {
            meta: [ {
                name: 'author',
                content: META_NAME
            } ],
            link: [ {
                rel: 'canonical',
                href: this.$static.metadata.siteUrl + this.$route.path
            } ]
        };
    }
};
</script>

<static-query>
    query Layout {
        metadata {
            siteUrl
            name
        }
    }
</static-query>

<style scoped>
@import url("../assets/styles.css");

.outer {
    display: flex;
    min-height: 100%;
    justify-content: space-between;
    flex-direction: column;
}

.single {
    max-width: 800px;
    padding: var(--column-gutter);
    margin: var(--column-gutter) auto;
    border-top: 1px solid var(--accent);
    border-bottom: 1px solid var(--accent);

}

.single a {
    transition: 0.16s color;
}

.single a:hover {
    color: var(--accent);
    --webkit-text-decoration-color: var(--accent);
    text-decoration-color: var(--accent);
}

.single h1,
.single h2 {
    margin: 0;
}

.single p {
    margin: 0 0 0.3em;
}
</style>
