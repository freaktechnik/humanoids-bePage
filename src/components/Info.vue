<template>
    <div>
        <!-- eslint-disable vue/singleline-html-element-content-newline -->
        <p class="info-teaser">Web developer, Euphonium player, travels by train</p>
        <!-- eslint-enable vue/singleline-html-element-content-newline -->
        <p><octicon icon="home" /> Living in {{ $static.metaData.city }}, {{ $static.metaData.country }}</p>
        <p>
            <octicon icon="gift" /> Birthday: <time-stamp
                itemprop="birthDate"
                :datetime="$static.metaData.dateOfBirth"
            />
        </p>
    </div>
</template>

<script>
import Octicon from './Octicon.vue';
import TimeStamp from './TimeStamp.vue';

export default {
    name: 'info',
    components: {
        Octicon,
        TimeStamp
    }
};
</script>

<static-query>
query Info {
    metaData {
        city
        country
        dateOfBirth
    }
}
</static-query>

<style scoped>
.info-teaser {
    font-style: italic;
    font-size: 1.2rem;
}
</style>
