<template>
    <footer>
        <nav class="nav">
            <!-- eslint-disable vue/multiline-html-element-content-newline, vue/singleline-html-element-content-newline -->
            <g-link
                to="/"
                rel="home"
            >{{ $static.metadata.siteName }}</g-link>
            <g-link to="/about">About</g-link>
            <g-link
                to="/archive"
                rel="archives"
            >Archive</g-link>
            <!-- eslint-enable vue/multiline-html-element-content-newline, vue/singleline-html-element-content-newline -->
            <a
                rel="noopener source"
                href="https://github.com/freaktechnik/humanoids-bePage"
            >Source</a>
        </nav>
        <g-image
            src="../assets/aha.png"
            alt="/|H|\"
            height="30"
            width="60"
            v-if="!noWatermark"
        />
    </footer>
</template>

<script>
export default {
    name: 'MainFooter',
    props: {
        noWatermark: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<static-query>
    query {
        metadata {
            siteName
        }
    }
</static-query>

<style scoped>
footer {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    padding: var(--column-gutter);
    box-sizing: border-box;
    align-items: baseline;
}

footer nav a {
    margin-right: 0.5em;
}
</style>
