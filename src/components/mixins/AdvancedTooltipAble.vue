<template>
    <div @mouseover="onMouseOver" @mouseleave="onMouseLeave"
         style="position: relative"
         :class="{ 'advanced-tooltip-show': showTooltip}">
        <slot/>
    </div>
</template>

<script>
    export default {
        name: "AdvancedTooltipAble",
        props: ['show'],
        data() {
            return {
                pendingLeave: false,
                showTooltip: false,
                tooltipOn: false,
            }
        },
        watch: {
            show: {
                immediate: true,
                handler(newValue, oldValue) { // watch it
                    this.tooltipOn = newValue;
                    if (oldValue && !newValue) {
                            this.showTooltip = false;
                            console.log("turn tooltip off")
                    }
                    // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                }
            },
        },
        methods: {
            onMouseOver() {
                if (this.tooltipOn && !this.showTooltip) {
                    this.showTooltip = true;
                }
                this.pendingLeave = false;
            },
            onMouseLeave() {
                setTimeout(function() {
                    if (this.pendingLeave) {
                        this.showTooltip = false;
                    }
                }.bind(this), 100);
                this.pendingLeave = true;
            },
        }
    }
</script>

<style scoped>

</style>