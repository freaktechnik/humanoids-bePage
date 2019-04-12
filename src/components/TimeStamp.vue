<template>
    <time :datetime="datetime">{{ formattedDate }}</time>
</template>
<script>
export default {
    name: 'TimeStamp',
    props: {
        withTime: {
            type: Boolean,
            default: false
        },
        datetime: {
            type: String,
            required: true
        }
    },
    computed: {
        formattedDate() {
            const inst = new Date(this.datetime);
            if(!this.withTime) {
                return inst.toLocaleDateString();
            }
            return inst.toLocaleString();
        }
    }
};
</script>
