export const advancedTooltipModalEntity = {
    data: function() {
        return {
            showModal: false,
            showAdvancedTooltip: true,
        }
    },
    methods: {
        doDragEnd() {
            this.showAdvancedTooltip = true;
            this.$store.commit('ui/updateDraggingEntity', false);
            this.$store.commit('ui/setMovingEntity', false);
        },
        onClick(event) {
            this.showAdvancedTooltip = false;
            event.stopPropagation();
            this.showModal = true;
        },
        onClose() {
            setTimeout(function() {
                this.showAdvancedTooltip = true;
            }.bind(this), 400); // A little bit longer than the close dialog transition
            this.showModal = false;
            this.$store.commit('models/modelChanged', this.modelIndex);
        },
    }
}