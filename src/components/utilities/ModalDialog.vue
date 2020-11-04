<template>
    <transition name="modal">
        <div class="modal-mask modal-dialog-z-index justify-center align-center display-flex"
            draggable="true" @dragstart="doDragStart">
            <div class="modal-wrapper">
                <div class="modal-container" @keydown.esc="$emit('close')" @click="onClick">
                    <div class="modal-close-button" v-if="showCloseButton">
                        <hamburgerbutton :initial-state="true" @activated="$emit('close')"/>
                    </div>

                    <div class="modal-panel">
                        <slot>
                            default panel
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import HamburgerButton from "@/components/utilities/HumburgerButton";

    export default {
        name: 'ModalDialog',
        components: {
            hamburgerbutton: HamburgerButton,
        },
        data() {
            return {
                showCloseButton: true,
            }
        },
        methods: {
            onClick(event) {
                event.stopPropagation();
            },
            doDragStart(event) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }
</script>

<style scoped="true">
    .modal-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s ease;
    }

    .modal-wrapper {
        max-width: fit-content;
    }

    .modal-container {
        /*width: 37%;*/
        margin: 0 auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
        position: relative;
    }

    .modal-close-button {
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .modal-panel {
        margin: 20px 0;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
