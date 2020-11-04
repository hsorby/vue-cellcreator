<template>
    <div class="cellml-units clickable advanced-tooltip-able"
         :style="entityStyle('units')"
         draggable="true"
         @dragstart="doDragStart(index, $event)"
         @dragend="doDragEnd"
         @click="onClick">
        <span v-show="hasContent"><font-awesome-icon class="content-colour" icon="plus"/></span>
        <infotip v-if="showAdvancedTooltip">
            <div>
                <span>Name: {{ name }}</span>
            </div>
        </infotip>
        <modaldialog v-if="showModal" @close="onClose">
            <component :is="activePanel" :data="panelData"/>
        </modaldialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import UnitsPanel from "@/components/panels/UnitsPanel";
    import ModalDialog from "@/components/utilities/ModalDialog";
    import AdvancedTooltip from "@/components/utilities/AdvancedTooltip";
    import {advancedTooltipModalEntity} from "@/components/mixins/AdvancedTooltipModalEntity";

    export default {
        name: 'CellMLUnits',
        props: ['units', 'index', 'modelIndex'],
        mixins: [advancedTooltipModalEntity],
        components: {
            modaldialog: ModalDialog,
            infotip: AdvancedTooltip,
        },
        data: function () {
            return {
                panelData: {
                    units: this.units,
                },
                activePanel: UnitsPanel,
                contentSignal: '',
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
            }),
            hasContent() {
                return this.units.name().length > 0;
            },
            name() {
                return this.hasContent ? this.units.name() : null;
            },
        },
        methods: {
            doDragStart(index, event) {
                this.showAdvancedTooltip = false;
                event.stopPropagation();
                event.dataTransfer.effectAllowed = 'copyMove';
                event.dataTransfer.setData('int/units-index', index);
                event.dataTransfer.setData('int/model-index', this.modelIndex);
                event.dataTransfer.setData('text/plain', 'units');
                event.dataTransfer.setData('units', null);
                this.$store.commit('ui/updateDraggingEntity', true);
                this.$store.commit('ui/setMovingEntity', true);
            },
        }
    }
</script>

<style scoped="true">
    .cellml-units {
        min-height: 30px;
        min-width: 30px;
        margin: 5px;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .24), 0 0 0 rgba(0, 0, 0, .16);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content-colour {
        color: grey;
    }
</style>