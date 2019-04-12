<template>
    <svg :width="width" :height="height" :viewBox="viewBox" :class="octiconClasses" version="1.1" aria-hidden="true" role="presentation" v-html="octicon.path"/>
</template>

<script>
import Octicons from 'octicons';

export default {
    name: "octicon",
    props: {
        icon: {
            type: String,
            required: true,
            validator(icon) {
                return Octicons.hasOwnProperty(icon);
            }
        }
    },
    data() {
        return {
            fontSize: 16,
            listener: () => this.setFontSize()
        };
    },
    computed: {
        octicon() {
            return Octicons[this.icon];
        },
        width() {
            return (this.octicon.width / this.octicon.height) * this.fontSize;
        },
        height() {
            return this.fontSize;
        },
        viewBox() {
            return `0 0 ${this.octicon.width} ${this.octicon.height}`;
        },
        octiconClasses() {
            return `octicon octicon-${this.icon}`;
        }
    },
    mounted() {
        this.setFontSize();
        window.addEventListener("resize", this.listener, { passive: true });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.listener);
    },
    methods: {
        setFontSize() {
            if(this.$el) {
                this.fontSize = parseFloat(window.getComputedStyle(this.$el, null).getPropertyValue('font-size'));
            }
        }
    }
};
</script>

<style scoped>
.octicon {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;
}
</style>
