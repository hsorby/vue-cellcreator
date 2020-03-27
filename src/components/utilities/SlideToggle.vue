<script>
    export default {
        name: 'SlideToggle',

        props: {
            open: Boolean,
            duration: {
                type: Number,
                default: 300,
            },
            tag: {
                type: String,
                default: 'div',
            },
        },

        data() {
            return {
                scrollHeight: 0,
                scrollWidth: 0,
                doneOpenTransition: false,
                innerOpen: this.open,
            }
        },

        mounted() {
            // window.addEventListener('resize', this.getSize); // re-calc height on resize window
            this.getSize()
        },

        updated() {
            // this.getSize() // re-calc for dynamic change content
        },

        destroyed() {
            // window.removeEventListener('resize', this.getSize)
        },

        watch: {
            open(bool) {
                if (!bool) {
                    this.getSize();
                    this.doneOpenTransition = false;
                    this.$nextTick().then(() => {
                        this.innerOpen = false;
                    })
                } else {
                    this.innerOpen = true;
                }
            }
        },

        computed: {
            style() {
                if (this.innerOpen && this.doneOpenTransition) return null;

                const heightSize = this.innerOpen ? this.scrollHeight : 0;
                const widthSize = this.innerOpen ? this.scrollWidth : 0;

                return {
                    overflow: 'hidden',
                    transitionProperty: 'width, height',
                    height: `${heightSize}px`,
                    width: `${widthSize}px`,
                    transitionDuration: `${this.duration}ms`,
                }
            },
        },

        methods: {
            getSize() {
                const {container} = this.$refs;
                this.scrollHeight = container.scrollHeight;
                this.scrollWidth = container.scrollWidth;
            },

            handleTransition() {
                if (this.innerOpen) {
                    this.doneOpenTransition = true;
                }
            }
        },

        render(h) {
            return h(
                this.tag, {
                    style: this.style,
                    ref: 'container',
                    on: {
                        transitionend: this.handleTransition,
                    }
                },
                this.$slots.default
            )
        },
    }
</script>
