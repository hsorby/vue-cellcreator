<template>
    <div class="advanced-tooltip-content"
         :class="[type, {'advanced-tooltip-manual-mode': manual}, manual && show ? 'show-tooltip' : '']" ref="tipContent" :style="contentStyle">
        <img :src="imagePath" alt="Tooltip Type Image" height="24" width="24" />
        <div class="advanced-tooltip-content-container">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdvancedTooltip",
        props: {
            bottomMargin: {
                type: Number,
                default: 5,
            },
            type: {
                type: String,
                default: 'info',
            },
            manual: {
                type: Boolean,
                default: false,
            },
            show: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                bottom: 0,
            }
        },
        computed: {
            imagePath() {
                if (this.type === 'info') {
                    return require('@/assets/info.png');
                }
                if (this.type === 'error') {
                    return require('@/assets/critical.png');
                }
                return require('@/assets/help.png');
            },
            contentStyle: function(){
                return {
                    bottom: '-' + (this.bottom + this.bottomMargin) + 'px',
                }
            },
        },
        mounted() {
            this.setBottom();
        },
        methods: {
            setBottom() {
                this.bottom = this.$refs.tipContent.clientHeight;
            },
        },
    }
</script>

<style scoped>
    .advanced-tooltip-content-container {
        margin-left: 13px;
        margin-right: 3px;
        white-space: nowrap;
    }

    .advanced-tooltip-content {
        left: 0;
    }

    .advanced-tooltip-content {
        margin-left: 999em;
        transition: margin-left 1s;
        display: flex;
        position: absolute;
        border-radius: 5px 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1); -webkit-box-shadow: 5px 5px rgba(0, 0, 0, 0.1); -moz-box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
        font-family: Calibri, Tahoma, Geneva, sans-serif;
        /*left: 1em; top: 2em;*/
    }
    .advanced-tooltip-able:hover > .advanced-tooltip-content:not(.advanced-tooltip-manual-mode) {
        margin-left: 0;
        transition: margin-left 1s;
        /*display: flex;*/
        /*opacity: 1;*/
        /*width: 250px;*/
    }

    .advanced-tooltip-able > .advanced-tooltip-manual-mode.show-tooltip {
        margin-left: 0;
        transition: margin-left 1s;
    }

    .advanced-tooltip-content img {
        border: 0;
        margin: -3px 0 0 -11px;
        /*opacity: 1;*/
        /*float: left;*/
        position: absolute;
    }
    /*.info-tip:hover .info-tip-content em {*/
    /*    font-family: Candara, Tahoma, Geneva, sans-serif; font-size: 1.2em; font-weight: bold;*/
    /*    display: block;*/
    /*    padding: 0.2em 0 0.6em 0;*/
    /*}*/

    .classic { padding: 0.8em 1em; }
    .custom { padding: 0.5em 0.8em 0.8em 2em; }
    /** html a:hover { background: transparent; }*/
    .info {
        background: #9FDAEE;
        border: 1px solid #2BB0D7;
    }
    .error {
        background: #FFCCAA;
        border: 1px solid #FF3334;
    }
    .help {
        background: #9FDAEE;
        border: 1px solid #2BB0D7;
    }
</style>
