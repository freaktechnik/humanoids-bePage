<template>
    <section>
        <header>
            <!-- eslint-disable vue/singleline-html-element-content-newline -->
            <h1 v-if="!titleUrl">{{ title }}</h1>
            <!-- eslint-enable vue/singleline-html-element-content-newline -->
            <h1 v-else>
                <a
                    :href="titleUrl"
                    target="_blank"
                    rel="me noopener"
                >{{ title }} <octicon
                    icon="link-external"
                    class="click-link"
                /></a>
            </h1>
        </header>
        <div class="scroll-wrapper">
            <ul class="list-content">
                <li
                    v-for="item of data"
                    :key="item.node.id"
                >
                    <template v-if="type === 'timeline'">
                        <h1>
                            <octicon
                                :icon="iconForType(item.node.type)"
                                :label="item.node.type"
                            /><span>{{ item.node.title }}</span>
                        </h1>
                        <p
                            v-for="extra of item.node.extra"
                            :key="extra.title"
                        >
                            <em>{{ extra.title }}</em>
                            <small>{{ extra.content }}</small>
                        </p>
                        <footer>
                            <time-stamp :datetime="item.node.date" /> - <time-stamp
                                v-if="item.node.end"
                                :datetime="item.node.end"
                            /><template v-else>
                                Now
                            </template>
                        </footer>
                    </template>
                    <template v-else-if="type === 'projects'">
                        <h1 v-if="item.node.url">
                            <a :href="item.node.url">{{ item.node.title }}</a>
                        </h1>
                        <h1 v-else>
                            {{ item.node.title }}
                        </h1>
                        <p v-if="item.node.source">
                            <octicon icon="code" />&nbsp;<a :href="item.node.source">Source Code</a>
                        </p>
                        <footer>
                            <octicon :icon="projectTagIcon(item.node.tag)" /> {{ projectTagLabel(item.node.tag) }} · <octicon
                                :icon="contributionIcon(item.node.type)"
                                :label="item.node.type"
                            />
                        </footer>
                    </template>
                    <template v-else-if="type === 'talks'">
                        <h1><a :href="item.node.slides">{{ item.node.title }}</a></h1>
                        <p v-if="item.node.recording">
                            <octicon icon="device-camera-video" />&nbsp;<a :href="item.node.recording">Recording</a><br>
                        </p>
                        <p><octicon icon="calendar" />&nbsp;<a :href="item.node.event.url">{{ item.node.event.title }}</a></p>
                        <footer>
                            <time-stamp :datetime="item.node.event.date" />
                        </footer>
                    </template>
                    <template v-else-if="type === 'blog'">
                        <h1>
                            <a
                                :href="item.node.link"
                                :hreflang="item.node.language.length && item.node.language[0].title.replace('_', '-')"
                                :lang="item.node.language.length && item.node.language[0].title.replace('_', '-')"
                                v-html="item.node.title"
                            />
                        </h1>
                        <figure>
                            <!-- TODO generate placeholder -->
                            <lazy-image
                                :src="item.node.featuredMedia.mediaDetails.sizes.medium.sourceUrl"
                                width="350"
                                sizes="(max-width: 699px) 100vw, 350px"
                                :srcset="srcsetForPost(item)"
                            />
                        </figure>
                        <article
                            v-html="item.node.excerpt"
                            :lang="item.node.language.length && item.node.language[0].title.replace('_', '-')"
                        />
                        <footer>
                            <time-stamp :datetime="item.node.date" />
                        </footer>
                    </template>
                    <template v-else-if="type === 'tracks'">
                        <figure
                            v-for="attachment in item.node.attachments"
                            :key="attachment.preview.src"
                            class="track-album"
                        >
                            <a
                                :href="item.node.path"
                                :hreflang="item.node.language"
                            >
                                <g-image
                                    v-if="attachment.type === 'image'"
                                    :src="attachment.preview"
                                    :alt="attachment.alt"
                                />
                            </a>
                        </figure>
                        <h1>
                            <octicon icon="unmute" />&nbsp;
                            <a
                                :href="item.node.path"
                                :hreflang="item.node.language"
                                :lang="item.node.language"
                            >{{ item.node.title }}</a>
                        </h1>
                        <article :lang="item.node.language">
                            {{ item.node.excerpt }}
                        </article>
                        <footer>
                            <time-stamp :datetime="item.node.date" />
                        </footer>
                    </template>
                    <template v-else>
                        <blockquote
                            v-html="item.node.excerpt"
                            :title="item.node.content"
                            :lang="item.node.language"
                        />
                        <figure
                            v-for="attachment in item.node.attachments"
                            :key="attachment.preview.src"
                        >
                            <g-image
                                v-if="attachment.type === 'image'"
                                :src="attachment.preview"
                                :alt="attachment.alt"
                            />
                        </figure>
                        <footer>
                            <a :href="item.node.path"><time-stamp
                                :datetime="item.node.date"
                                :with-time="true"
                            /></a>
                        </footer>
                    </template>
                </li>
            </ul>
        </div>
    </section>
</template>
<script>
import Octicon from '../components/Octicon.vue';
import TimeStamp from '../components/TimeStamp.vue';
import LazyImage from 'v-lazy-image/v2/v-lazy-image.es.js';

const TYPE_ICONS = {
        'EDUCATION': 'book',
        'WORK': 'briefcase',
        'CIVIL_SERVICE': 'tools'
    },
    CONTRIBUTE_ICONS = {
        'CREATING': 'person',
        'CONTRIBUTING': 'people'
    },
    PROJECT_TAG_ICONS = {
        'WEBSITE': 'globe',
        'BROWSER_EXTENSION': 'browser',
        'TWITCH_EXTENSION': 'device-camera-video',
        'SERVICE': 'server',
        'LIBRARY': 'package',
        'CLI': 'terminal'
    },
    PROJECT_TAG_LABELS = {
        'WEBSITE': 'Website',
        'BROWSER_EXTENSION': 'Browser extension',
        'TWITCH_EXTENSION': 'Twitch extension',
        'SERVICE': 'Service',
        'LIBRARY': 'Library',
        'CLI': 'Command line applet'
    };

export default {
    name: 'ListBox',
    components: {
        Octicon,
        TimeStamp,
        LazyImage
    },
    props: {
        title: {
            type: String,
            required: true
        },
        titleUrl: {
            type: String,
            default: ''
        },
        data: {
            type: Array,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    methods: {
        iconForType(type) {
            return TYPE_ICONS[type];
        },
        contributionIcon(type) {
            return CONTRIBUTE_ICONS[type];
        },
        projectTagIcon(type) {
            return PROJECT_TAG_ICONS[type];
        },
        projectTagLabel(type) {
            return PROJECT_TAG_LABELS[type];
        },
        srcsetForPost(item) {
            const { sizes } = item.node.featuredMedia.mediaDetails;
            return Object.values(sizes).filter((image) => image)
                .map((image) => `${image.sourceUrl} ${image.width}w`)
                .join(', ');
        }
    }
};
</script>

<style scoped>
section {
    --footer-color: var(--medium);
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

header h1 {
    padding: 0 var(--column-gutter);
    font-weight: normal;
    font-size: 1.3rem;
}

header a {
    color: currentColor;
    text-decoration: none;
}

.click-link {
    color: var(--accent);
    vertical-align: middle;
}

.scroll-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 1;
    scrollbar-width: thin;
}

ul {
    list-style-type: none;
    padding: 0 var(--column-gutter);
    margin: 0;
}

.timeline {
    --inset: 1.7rem;
}

.timeline .list-content h1 {
    position: relative;
    padding-left: var(--inset);
}

.timeline .list-content h1 .octicon {
    position: absolute;
    left: 0;
    top: 0.3em;
}

.timeline .list-content li:not(:first-child) {
    border-top: none;
}

p {
    padding: 0;
    margin: 0 0 0.3em;
}

.timeline li p,
.timeline li footer {
    padding-left: var(--inset);
}

em {
    font-style: italic;
    margin-right: 0.2em;
}

small {
    font-size: 0.8em;
}

a,
a:link,
a:visited {
    color: currentColor;
}

.list-content li {
    padding: var(--column-gutter) 0;
    clear: both;
}

.list-content li h1 {
    font-size: 1.3em;
    padding: 0;
    margin: 0;
}

.list-content li .octicon {
    vertical-align: middle;
}

.list-content li:not(:first-child) {
    border-top: 1px solid var(--footer-color);
}

.list-content figure {
    margin: 0 auto;
    padding: 0;
    text-align: center;
}

.list-content li img {
    max-width: 100%;
    height: auto;
}

.list-content .track-album {
    float: right;
    margin-left: 1em;
}

.list-content .track-album img {
    height: 80px;
    width: 80px;
}

footer {
    color: var(--footer-color);
    font-size: 0.8em;
}

blockquote {
    margin: 0;
    padding: 0;
    text-align: justify;
    hyphens: auto;
}

footer a {
    color: var(--footer-color);
    text-decoration: none;
}

footer a:hover {
    text-decoration: underline;
}
</style>
