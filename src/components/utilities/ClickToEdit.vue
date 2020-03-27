<template>
    <label :tooltip="tooltip">
        <input ref="input"
               v-bind:value="value"
               v-on:input="$emit('input', $event.target.value)"
               :placeholder="defaultValue"
               :style="[ fitContent ? {width: fittedWidth + 'ch'} : '' ]"
               class="nice-input"
               @keydown="keydown"
               @keyup="keyup"
               draggable="true" @dragstart="preventDragging($event)">
    </label>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
                default: '',
            },
            defaultValue: {
                type: String,
                default: '<-- click to edit -->',
            },
            fitContent: {
                type: Boolean,
                default: false,
            },
            tooltip: {
                type: String,
                default: null,
            }
        },
        data() {
            return {
                enterKeyActive: false,
            }
        },
        computed: {
            fittedWidth() {
                let width = this.value.length + 2;
                if (this.value.length === 0) {
                    width = this.defaultValue.length + 2;
                    if (this.defaultValue.length === 0) {
                        width = 17;
                    }
                }
                return width;
            },
        },
        methods: {
            keydown(event) {
                if (event.isComposing || event.keyCode === 229) {
                    return;
                }

                if (event.key === "Enter") {
                    this.enterKeyActive = true;
                }
            },
            keyup(event) {
                if (event.isComposing || event.keyCode === 229) {
                    return;
                }
                if (event.key === "Enter") {
                    this.enterKeyActive = false;
                    this.$refs.input.blur();
                }
            },
            preventDragging(event) {
                event.preventDefault();
                event.stopPropagation();
            },
        }
    }
</script>

<style scoped>
    .nice-input {
        background-color: white;
        margin: 5px;
        border-radius: 7px;
        outline: none;
        min-width: 15px;
        padding: 0 5px 0 5px;
    }

    .nice-input:focus {
        box-shadow: 1px 1px 1px 1px #888888, -1px 1px 1px 1px #888888, 1px -1px 1px 1px #888888, -1px -1px 1px 1px #888888;
    }

    [tooltip] {
        position: relative;
    }

    [tooltip]:hover::before {
        content: attr(tooltip);
        position: absolute;
        bottom: -26px;
        display: inline-block;
        padding: 3px 6px;
        border-radius: 2px;
        background: #000;
        color: #fff;
        font-size: 12px;
        font-family: sans-serif;
        white-space: nowrap;
    }

    [tooltip]:hover::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 8px;
        display: inline-block;
        color: #fff;
        border: 8px solid transparent;
        border-bottom: 8px solid #000;
    }
</style>
