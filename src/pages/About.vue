<template>
    <Layout>
        <header>
            <h1>About</h1>
        </header>
        <main>
            <section>
                <p>{{ $page.metadata.siteName }} is licensed under the GPLv3 © {{ new Date().getFullYear() }} by {{ fullName }}.</p>
                <p>
                    Built using <a
                        rel="noopener"
                        href="https://gridsome.org/"
                    >Gridsome</a>, hosted at <a
                        rel="noopener"
                        href="https://order.cyon.ch/affiliate/cyon_webhosting_8ff0c2b9-d914-41a4-8737-7521c7f70e87"
                    >cyon</a>
                </p>
            </section>
            <section>
                <h1>Privacy</h1>
                <p>This page does not contain any trackers. The images loaded in the Mastodon and Twitter views are both loaded directly from their respective CDNs, which are typically chaos.social and pic.twitter.com. Their respective privacy policies apply.</p>
                <p>All loads are logged by the hoster on the server and the access logs are processed into anonymous access statistics.</p>
            </section>
        </main>
    </Layout>
</template>

<script>
import Layout from '../layouts/Single.vue';

export default {
    components: {
        Layout
    },
    computed: {
        fullName() {
            return this.$page.metadata.name;
        }
    },
    metaInfo() {
        return {
            title: 'About'
        };
    }
};
</script>

<page-query>
    query About {
        metadata {
            name
            siteName
        }
    }
</page-query>
