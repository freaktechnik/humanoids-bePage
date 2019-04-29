<template>
    <div class="layout">
        <slot />
        <global-footer />
    </div>
</template>

<script>
import GlobalFooter from '../components/Footer.vue';

export default {
    components: {
        GlobalFooter
    }
};
</script>

<style scoped>
@import url("../assets/styles.css");

.layout {
    height: 100%;
    display: flex;
    flex-direction: column;
}

@media print {
    .layout {
        height: auto;
        min-height: 100%;
    }
}
</style>
