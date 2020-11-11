<template>
    <svg
        :width="width"
        :height="height"
        :viewBox="viewBox"
        :class="octiconClasses"
        version="1.1"
        :aria-hidden="ariaHidden"
        :aria-label="label"
        role="presentation"
        v-html="octicon.path"
    />
</template>

<script>
import Octicons from '@primer/octicons';

const ONE_ICON = 1,
    FIRST = 0;

export default {
    name: "Octicon",
    props: {
        icon: {
            type: String,
            required: true,
            validator(icon) {
                return Octicons.hasOwnProperty(icon);
            }
        },
        label: {
            type: String,
            required: false,
            default: ''
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
            return Octicons[this.icon].heights[this.octiconHeight];
        },
        octiconHeight() {
            const iconInfo = Octicons[this.icon];
            if(iconInfo.heights[this.fontSize]) {
                return this.fontSize;
            }
            const availableHeights = Object.keys(iconInfo.heights);
            if(availableHeights.length === ONE_ICON) {
                return availableHeights[FIRST];
            }
            let bestSize = Number.MAX_SAFE_INTEGER;
            for(const height of Object.keys(iconInfo.heights)) {
                const heightNumber = Number.parseInt(height, 10);
                if(heightNumber >= this.fontSize && heightNumber < bestSize) {
                    bestSize = heightNumber;
                }
            }
            if(bestSize >= Number.MAX_SAFE_INTEGER) {
                return Math.max(...availableHeights.map((height) => Number.parseInt(height, 10)));
            }
            return bestSize;
        },
        width() {
            return (this.octicon.width / this.octiconHeight) * this.fontSize;
        },
        height() {
            return this.fontSize;
        },
        viewBox() {
            return this.octicon.options.viewBox;
        },
        octiconClasses() {
            return this.octicon.options.class;
        },
        ariaHidden() {
            return (!this.label).toString();
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
