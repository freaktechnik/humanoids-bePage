<template>
    <Layout>
        <header
            class="main-header"
            itemscope
            itemtype="http://schema.org/Person"
        >
            <div class="sub-header grow">
                <button
                    type="button"
                    id="menu"
                    @click="toggleMenu"
                >
                    <octicon icon="three-bars" />
                </button>
                <g-image
                    :alt="'Photo of ' + fullName"
                    src="~/assets/avatar.jpg"
                />
                <section class="grow">
                    <!-- eslint-disable vue/singleline-html-element-content-newline -->
                    <h1 itemprop="name">{{ fullName }}</h1>
                    <!-- eslint-enable vue/singleline-html-element-content-newline -->
                    <info class="big-only" />
                </section>
            </div>
            <info
                class="small-only grow"
                v-if="page === 'info'"
            />
            <section
                class="shadow"
                v-if="page === 'info'"
            >
                <ul>
                    <li
                        v-for="contact in $page.contact.edges"
                        :key="contact.node.id"
                    >
                        <contact
                            :content="contact.node.content"
                            :type="contact.node.title"
                            :url="contact.node.url"
                        />
                    </li>
                </ul>
            </section>
        </header>
        <main
            class="timelines listbox"
            v-if="page === 'info'"
        >
            <list-box
                v-for="(info, type) in timelinePages"
                :key="type"
                :type="type"
                :title="info.title"
                :title-url="info.link"
                :class="info.class"
                :data="$page[info.data].edges"
            />
        </main>
        <main
            class="listbox"
            v-else
        >
            <list-box
                :type="page"
                :title="pageInfo.title"
                :title-url="pageInfo.link"
                :class="pageInfo.class"
                :data="$page[pageInfo.data].edges"
            />
        </main>
        <transition name="slide">
            <div
                v-if="showMenu"
                role="menu"
                class="page-menu"
            >
                <div class="grow">
                    <button
                        @click="toggleMenu"
                        class="hide-button"
                    >
                        <octicon icon="triangle-left" />
                    </button>
                    <nav>
                        <ul>
                            <li
                                v-for="(info, name) in pages"
                                :key="name"
                                :class="{ current: name === page }"
                            >
                                <button @click="showPage(name)">
                                    {{ info.title }}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <main-footer no-watermark />
            </div>
        </transition>
    </Layout>
</template>

<script>
import ListBox from '../components/ListBox.vue';
import Contact from '../components/Contact.vue';
import Octicon from '../components/Octicon.vue';
import MainFooter from '../components/Footer.vue';
import Info from '../components/Info.vue';
import beImage from '../favicon.png';
import avatarImage from '../assets/avatar.jpg';
import resumeLocation from '../data/resume.json';

//TODO make menu a dropdown instead

export default {
    components: {
        ListBox,
        Contact,
        Octicon,
        MainFooter,
        Info
    },
    data() {
        const listener = (event) => this.resetPage(event);
        return {
            page: 'info',
            showMenu: false,
            listener,
            query: null
        };
    },
    computed: {
        pages() {
            const mastodon = this.$page.profiles.edges.find((p) => p.node.network === 'Mastodon').node,
                funkwhale = this.$page.profiles.edges.find((p) => p.node.network === 'Funkwhale').node;
            return {
                info: {
                    title: 'Info'
                },
                timeline: {
                    title: 'Timeline',
                    data: 'timeline',
                    class: 'timeline'
                },
                projects: {
                    title: 'Projects',
                    data: 'projects',
                    link: this.$page.profiles.edges.find((p) => p.node.network === 'GitHub').node.url
                },
                talks: {
                    title: 'Talks',
                    data: 'talks'
                },
                blog: {
                    title: 'Blog',
                    data: 'blogPosts',
                    link: '/log',
                    class: 'posts'
                },
                mastodon: {
                    title: mastodon.username,
                    data: 'toots',
                    link: mastodon.url
                },
                tracks: {
                    title: funkwhale.username,
                    data: 'tracks',
                    link: funkwhale.url
                }
            };
        },
        fullName() {
            return this.$page.metadata.name;
        },
        timelinePages() {
            const copy = Object.assign({}, this.pages);
            delete copy.info;
            return copy;
        },
        pageInfo() {
            return this.pages[this.page];
        }
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        showPage(name) {
            this.page = name;
            this.showMenu = false;
        },
        resetPage(event) {
            if(event.matches && this.page !== 'info') {
                this.page = 'info';
            }
        }
    },
    metaInfo() {
        const JSON_LD = {
            "@context": "http://schema.org",
            "@type": "WebSite",
            name: this.fullName,
            alternateName: this.$page.metadata.siteName,
            url: this.$page.metadata.siteUrl,
            isFamilyFriendly: true,
            image: this.$page.metadata.siteUrl + beImage,
            about: {
                "@type": "Person",
                name: this.fullName,
                email: `mailto:${this.$page.contact.edges.find((c) => c.node.title === 'email').node.content}`,
                image: this.$page.metadata.siteUrl + avatarImage,
                url: this.$page.metadata.siteUrl,
                sameAs: this.$page.profiles.edges.map((p) => p.node.url)
            }
        };
        return {
            title: this.fullName,
            meta: [
                {
                    name: 'author',
                    content: this.fullName
                },
                {
                    property: 'og:title',
                    content: this.fullName
                },
                {
                    property: 'og:type',
                    content: 'profile'
                },
                {
                    property: 'og:url',
                    content: this.$page.metadata.siteUrl
                },
                {
                    property: 'og:locale',
                    content: 'en_US'
                },
                {
                    property: 'og:image',
                    content: avatarImage
                },
                {
                    property: 'og:image:width',
                    content: 512
                },
                {
                    property: 'og:image:height',
                    content: 512
                },
                {
                    name: 'twitter:image',
                    content: avatarImage
                },
                {
                    name: 'profile:first_name',
                    content: this.$page.metadata.name.split(' ').shift()
                },
                {
                    name: 'profile:last_name',
                    content: this.$page.metadata.name.split(' ').pop()
                },
                {
                    name: 'profile:username',
                    content: 'freaktechnik'
                },
                {
                    name: 'profile:gender',
                    content: 'male'
                }
            ],
            link: [
                {
                    rel: 'shortlink',
                    href: 'https://hbsl.ch'
                },
                {
                    rel: 'canonical',
                    href: this.$page.metadata.siteUrl
                },
                {
                    rel: 'alternate',
                    type: 'application/json',
                    href: `${this.$page.metadata.siteUrl}${resumeLocation}`
                }
            ],
            script: [ {
                innerHTML: JSON.stringify(JSON_LD), // eslint-disable-line xss/no-mixed-html
                type: 'application/ld+json'
            } ]
        };
    },
    mounted() {
        this.pages.info.title = this.fullName;
        this.pages.blog.link = this.$page.metadata.siteUrl + this.pages.blog.link;
        this.query = window.matchMedia('(min-width: 700px) and (min-height: 500px)');
        this.query.addListener(this.listener);
    },
    beforeDestroy() {
        this.query.removeListener(this.listener);
    }
};
</script>

<page-query lang="graphql">
    query {
        metadata {
            name
            siteUrl
            siteName
        }
        contact: allContactMethod(order: ASC, sortBy: "title") {
            edges {
                node {
                    title
                    content
                    id
                    url
                }
            }
        }
        projects: allProject(order: ASC, sortBy: "id") {
            edges {
                node {
                    title
                    source
                    url
                    type
                    tag
                    id
                }
            }
        }
        talks: allTalk(order: DESC, sortBy: "date") {
            edges {
                node {
                    title
                    slides
                    recording
                    event {
                        url
                        title
                        date
                    }
                    id
                }
            }
        }
        blogPosts: allBlogPost(perPage: 10, sortBy: "date") {
            edges {
                node {
                    title
                    excerpt
                    date
                    link
                    featuredMedia {
                        mediaDetails {
                            sizes {
                                medium {
                                    sourceUrl
                                    width
                                }
                                mediumLarge {
                                    sourceUrl
                                    width
                                }
                                large {
                                    sourceUrl
                                    width
                                }
                                full {
                                    sourceUrl
                                    width
                                }
                            }
                        }
                    }
                    id
                }
            }
        }
        timeline: allTimelineEvent(sortBy: "end", order: DESC) {
            edges {
                node {
                    title
                    date
                    end
                    hasEnded
                    type
                    extra {
                        title
                        content
                    }
                    id
                }
            }
        }
        toots: allToot(perPage: 20) {
            edges {
                node {
                    excerpt
                    content
                    id
                    date
                    path
                    attachments {
                        type
                        preview
                        alt
                        height
                        width
                    }
                    language
                }
            }
        }
        tracks: allTrack(perPage: 20, sortBy: "date", order: DESC) {
            edges {
                node {
                    excerpt
                    id
                    title
                    date
                    path
                    attachments {
                        type
                        preview
                        alt
                    }
                    language
                }
            }
        }
        profiles: allProfile(order: ASC, sortBy: "network") {
            edges {
                node {
                    network
                    username
                    url
                }
            }
        }
    }
</page-query>

<style>
:root {
    --column-width: 100%;
}

.grow {
    flex-grow: 1;
}

.main-header {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    --header-padding: 0.5rem;
    --header-width: 4rem;
    background-color: var(--dark);
    color: var(--light);
}

.sub-header {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#menu {
    color: var(--light);
    height: var(--header-width);
    width: var(--header-width);
    padding: 0;
    border: none;
    background: transparent;
    font-size: 1.5rem;
}

#menu:active,
#menu:hover {
    background-color: var(--medium);
}

#menu .octicon {
    vertical-align: middle;
}

.main-header section {
    padding-right: var(--column-gutter);
    padding-top: var(--header-padding);
}

.main-header img {
    --image-size: calc(var(--header-width) - 2 * var(--header-padding));
    width: var(--image-size);
    height: var(--image-size);
    box-sizing: border-box;
    margin: var(--header-padding);
    margin-bottom: calc(var(--header-padding) / 2);
    margin-right: calc(var(--header-padding) + var(--column-gutter));
    border-radius: var(--header-width);
    border: 1px solid var(--shadow);
}

.main-header h1 {
    font-size: 2em;
    margin: 0;
    padding: 0;
    line-height: 1em;

    text-decoration: underline;
    text-decoration-color: var(--accent);
}

.big-only {
    display: none;
}

.small-only {
    padding: 0 var(--column-gutter);
}

.main-header ul {
    margin: 0;
    padding: 0;
    padding-left: var(--column-gutter);
    list-style-type: none;
}

.main-header .shadow {
    background-color: #222;
    color: var(--light);
    border-top: 1px solid var(--shadow);
}

.main-header .shadow a {
    color: var(--accent);
    text-decoration: none;
}

.main-header .shadow a:hover {
    text-decoration: underline;
}

.page-menu {
    background-color: var(--light);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 75vw;
    box-shadow: 0 0 5px var(--shadow);
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.page-menu .hide-button {
    float: right;
}

.page-menu ul,
.page-menu li {
    padding: 0;
    margin: 0;
    list-style-type: none;
}

.page-menu ul button {
    width: 100%;
    text-align: left;
    display: block;
}

.page-menu button {
    background: none;
    border: none;
    font-size: 1rem;
    padding: 0.75em var(--column-gutter);
    text-decoration: underline;
    -webkit-text-decoration-color: var(--accent);
    text-decoration-color: var(--accent);
}

.page-menu ul .current button,
.page-menu button:active {
    background-color: var(--dark);
    color: var(--light);
}

.slide-enter-active,
.slide-leave-active {
    transition: left 0.3s;
}

.slide-enter,
.slide-leave-to {
    left: -70vw;
}

.timelines {
    display: none;
}

.listbox header {
    background-color: var(--dark);
    color: var(--light);
    box-shadow: 0 0 5px var(--shadow);
}

.timelines section {
    width: var(--column-width);
    flex-shrink: 0;
    flex-grow: 1;
    height: 100%;
}

/* fix link color in v-html, since those aren't scoped */
.list-content a {
    color: currentColor;
}

.list-content p {
    padding: 0;
    margin: 0 0 0.3em;
}

.posts p {
    text-align: justify;
    hyphens: auto;
}

/* TODO tall phones landscape */

@media (min-width: 700px) and (min-height: 500px), print { /* 2 / column-width */
    :root {
        --column-width: 360px;
    }

    #menu,
    .small-only {
        display: none;
    }

    .big-only {
        display: initial;
    }

    .main-header {
        flex-direction: row;
    }

    .sub-header {
        flex-direction: row;
        align-items: flex-start;
    }

    .main-header h1 {
        font-size: 3em;
    }

    .main-header .shadow {
        border-left: 1px solid var(--shadow);
        border-bottom: 1px solid var(--shadow);
    }

    .timelines {
        display: flex;
        overflow-y: hidden;
        overflow-x: auto;
        flex-shrink: 1;
        flex-direction: row;
        /* This causes underflow on blink, because it doesn't understand safe yet. */
        /* justify-content: safe center; */
        justify-content: stretch;
        scroll-snap-type: x proximity;
    }

    .list-content {
        scroll-snap-align: start;
    }

    @media (pointer: fine) {
        .timelines {
            scrollbar-width: thin;
        }
    }
}

@media (min-width: 950px) and (min-height: 500px) {
    .main-header {
        --header-padding: 4rem;
        --header-width: var(--column-width);
    }
}

@media print {
    :root {
        --column-width: calc(50vw - 2rem);
    }

    .timelines {
        flex-wrap: wrap;
        min-height: 300px;
        height: auto;
        overflow: auto;
    }

    .timelines section {
        height: auto;
        max-height: 80vh;
    }

    .timeline {
        min-height: 300px;
        page-break-inside: avoid;
        page-break-after: auto;
    }

    .main-header .shadow {
        border-top: none;
        border-bottom: none;
        background: var(--light);
        color: var(--dark);
    }

    .main-header {
        --header-padding: 2vw;
        --header-width: 30vw;
        color: var(--dark);
        background: var(--light);
    }
}
</style>
