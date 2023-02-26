<template>
    <div>
        <!-- eslint-disable vue/singleline-html-element-content-newline -->
        <p class="info-teaser">{{ $static.metadata.teaser }}</p>
        <!-- eslint-enable vue/singleline-html-element-content-newline -->
        <p><octicon icon="home" /> Living in {{ $static.metadata.city }}, {{ $static.metadata.country }}</p>
        <p>
            <octicon icon="gift" /> Birthday: <time-stamp
                itemprop="birthDate"
                :datetime="$static.metadata.dateOfBirth"
            />
        </p>
        <p><a href="https://pronoun.is/{{ pronounString }}">{{ expandedPronouns }}</a></p>
    </div>
</template>

<script>
import Octicon from './Octicon.vue';
import TimeStamp from './TimeStamp.vue';

export default {
    name: 'Info',
    components: {
        Octicon,
        TimeStamp
    },
    computed: {
        pronounString() {
            return this.$static.metadata.pronouns.join("/");
        },
        expandedPronouns() {
            if(this.$static.metadata.pronouns.length) {
                return this.pronounString;
            }
            const [ pronoun ] = this.$static.metadata.pronouns;
            switch(pronoun) {
            case "he":
            case "him":
                return "he/him";
            case "she":
            case "her":
                return "she/her";
            case "they":
            case "them":
                return "they/them";
            default:
                return pronoun;
            }
        }
    }
};
</script>

<static-query lang="graphql">
    query Info {
        metadata {
            city
            country
            dateOfBirth
            teaser
            pronouns
        }
    }
</static-query>

<style scoped>
.info-teaser {
    font-style: italic;
    font-size: 1.2rem;
}
</style>
