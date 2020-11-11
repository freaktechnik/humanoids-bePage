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
    }
};
</script>

<static-query>
    query Info {
        metadata {
            city
            country
            dateOfBirth
            teaser
        }
    }
</static-query>

<style scoped>
.info-teaser {
    font-style: italic;
    font-size: 1.2rem;
}
</style>
