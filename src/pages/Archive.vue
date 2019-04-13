<template>
    <Layout>
        <header>
            <h1>Archive</h1>
        </header>
        <nav role="main">
            <ul class="archive">
                <li
                    v-for="edge in $page.archive.edges"
                    :key="edge.node.id"
                >
                    <a
                        rel="noopener external"
                        :href="$page.metaData.siteUrl + edge.node.path"
                        :title="edge.node.title"
                    >{{ edge.node.excerpt }}</a>
                </li>
            </ul>
        </nav>
    </Layout>
</template>

<script>
import Layout from '../layouts/Single.vue';

export default {
    components: {
        Layout
    },
    metaInfo() {
        const META_NAME = `${this.$page.metaData.name.given} ${this.$page.metaData.name.family}`;
        return {
            title: 'Archive',
            meta: [ {
                name: 'author',
                content: META_NAME
            } ]
        };
    }
};
</script>

<page-query>
query Archive {
    metaData {
        name {
            given
            family
        },
        siteUrl
    }

    archive: allArchive(order: ASC, sortBy: "version") {
        edges {
            node {
                id
                title
                excerpt
                path
            }
        }
    }
}
</page-query>

<style scoped>
.archive {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: center;
}

.archive li {
    padding: 0;
    margin: 0;
}

.archive a {
    display: block;
    padding: 0.5em;
}
</style>
