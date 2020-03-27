<template>
    <div class="menu-container">
        <hamburgerbutton @activated="toggleMenu"/>
        <slidetoggle :open="isOpen" :tag="tag" :duration="500">
<!--        <transition name="expand"  @before-enter="beforeEnter">-->
<!--            <div v-show="isOpen" class="menu-panel">-->
                <slot></slot>
<!--            </div>-->
        </slidetoggle>
<!--        </transition>-->
    </div>
</template>

<script>
    import HamburgerButton from "@/components/utilities/HumburgerButton";
    import SlideToggle from "@/components/utilities/SlideToggle";

    export default {
        name: 'slidingmenu',
        components: {
            hamburgerbutton: HamburgerButton,
            slidetoggle: SlideToggle,
        },
        props: {
            size: {
                type: Object,
            },
            tag: String,
        },
        data () {
            return {
                open: false,
            }
        },
        computed: {
            isOpen() {
                return this.open;
            },
        },
        mounted () {
        },
        methods: {
            toggleMenu () {
                this.open = !this.open;
            },
            beforeEnter (element) {
                requestAnimationFrame(() => {
                    let clone = this.$el.cloneNode(true);

                    clone.style.width = this.$el.style.width;
                    clone.style.visibility = "hidden";
                    clone.style.removeProperty("display");

                    // get clone height
                    element.parentNode.appendChild(clone);
                    let h = clone.clientHeight;
                    clone.remove();

                    this.size.height = `${h}px`;
                    this.$emit('update:size', this.size);
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .menu-container {
        margin: 5px 5px;
        /*background-color: grey;*/
        border-radius: 7px;
    }
    .menu-panel {
        margin-left: 7px;
        margin-top: 3px;
        background-color: black;
        color:white;
    }
    .menu-panel ul {
        margin-top: 0;
        padding-top: 20px;
    }


    .panel-enter,
    .panel-leave-to {
        transform: rotate(180deg);
    }
    .panel-leave,
    .panel-enter-to {
        transform: rotate(-180deg);
    }
    .panel-enter-active,
    .panel-leave-active {
        transition: all 12.3s ease-in-out;
    }

    .expand-enter, .expand-leave-to {
        transform: scale(1, 0);
        transform-origin: top right;
    }
    .expand-leave, .expand-enter-to {
        transform: scale(1, 1);
        transform-origin: bottom left;
    }
    .expand-enter-active, .expand-leave-active {
        transition: all 2s ease-in-out;
    }

</style>
