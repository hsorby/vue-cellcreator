<template>
    <div max="100" :style="{ visibility: displayProgress }" :value.prop="uploadPercentage">

    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
            },
            defaultValue: {
                type: String,
                default: '<-- click to edit -->'
            }
        },
        data () {
            return {
                edit: false,
                valueLocal: this.value.length === 0 ? this.defaultValue : this.value
            }
        },
        methods: {
            clearIfDefault() {
                if (this.defaultValue === this.valueLocal) {
                    this.valueLocal = '';
                }
            }
        },
        watch: {
            value: function() {
                this.valueLocal = this.value;
            }
        },
    }
</script>

<style scoped>
</style>
