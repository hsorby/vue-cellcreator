<template>
<!--    :style="menuWidth"-->
    <div class="position-rel min-width-40">
        <transition name="panel">
            <div v-if="isOpen">
                <slot></slot>
            </div>
        </transition>
        <hamburgerbutton :initial-state=true v-if="slidable" @activated="toggleMenu" class="button-settings" :style="buttonLocation"/>
    </div>
</template>

<script>
    import styles from '@/assets/sass/variables.scss'
    import HamburgerButton from "@/components/utilities/HumburgerButton";

    export default {
        name: 'slidingpanel',
        props: {
            width: {
                type: Number,
                required: false,
                default: 250
            },
            format: {
                type: String,
                required: false,
                default: 'overlay',
                validator: (value) => ['push', 'full', 'overlay'].indexOf(value) > -1
            },
            direction: {
                type: String,
                required: false,
                default: 'left',
                validator: (value) => ['left', 'right'].indexOf(value) > -1
            },
            opacity: {
                type: Number,
                required: false,
                default: 0
            },
            slidable: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        components: {
            hamburgerbutton: HamburgerButton,
        },
        data () {
            return {
                styles: styles,
                widthDef: {'width': this.width},
            }
        },
        computed: {
            menuWidth: {
                get() {
                    return this.slidable ? this.widthDef : {}
                },
                set(value) {
                    this.widthDef = value;
                }
            },
            menuDirection () {
                return this.direction === 'right'
                    ? { 'right': 0 }
                    : { 'left': 0 }
            },
            buttonLocation () {
                return this.direction === 'right'
                    ? { 'right': '0px' }
                    : { 'left': '0px' }
            },
            iconDirection () {
                return { 'float': this.direction }
            },
            isOpen() {
                if (Object.prototype.hasOwnProperty.call(this.menuWidth, 'width')) {
                    return this.menuWidth.width !== 0;
                }
                return true;
            },
            app () {
                return this.$parent;
            }
        },
        methods: {
            openMenu () {
                const width = `${this.width}px`;
                // const marginDirection = `margin-${this.direction}`;
                this.menuWidth = {
                    'width': this.format === 'full' ? '100%' : width
                };
                if (this.app && this.format === 'push') {
                    // console.log(this.app);
                    // console.log(this.app.style);
                    // this.app.$el.style[marginDirection] = width;
                    // this.app.$el.style.transition = `width 5s`
                }
            },
            closeMenu () {
                this.menuWidth = { 'width': 0 };
                if (this.app) {
                    // this.app.$el.style.marginLeft = '0';
                    // this.app.$el.style.marginRight = '0'
                }
            },
            toggleMenu () {
                if (this.menuWidth.width === 0) {
                    this.openMenu()
                } else {
                    this.closeMenu()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .button-settings {
        position: absolute;
        top: 0;
    }

    .panel-enter,
    .panel-leave-to {
        transform: translateX(100%);
    }

    .panel-leave,
    .panel-enter-to {
        transform: translateX(0);
    }

    .panel-enter-active,
    .panel-leave-active {
        transition: all 2.3s ease-in-out;
    }
</style>
