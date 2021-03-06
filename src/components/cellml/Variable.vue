<template>
    <div class="cellml-variable clickable advanced-tooltip-able" :style="entityStyle('variable')"
         :class="{'accepts-drop': canAcceptDrop}"
         draggable="true"
         @dragstart="doDragStart(index, $event)"
         @dragend="doDragEnd"
         @dragenter="allowDrop"
         @dragover="allowDrop"
         @dragleave="allowDrop"
         @drop="doDrop"
         @click="onClick">
        <modaldialog v-if="showModal" @close="onClose">
            <component :is="activePanel" :data="panelData"/>
        </modaldialog>
        <span v-show="hasContent"><font-awesome-icon class="content-colour" icon="plus"/></span>
        <infotip v-if="showAdvancedTooltip">
            <div>
                <span>Name: {{ name }}</span>
            </div>
        </infotip>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import ModalDialog from "@/components/utilities/ModalDialog";
    import VariablePanel from "@/components/panels/VariablePanel";
    import AdvancedTooltip from "@/components/utilities/AdvancedTooltip";
    import {advancedTooltipModalEntity} from "@/components/mixins/AdvancedTooltipModalEntity";

    export default {
        name: 'CellMLVariable',
        props: ['variable', 'index', 'componentPath', 'modelIndex'],
        mixins: [advancedTooltipModalEntity],
        components: {
            modaldialog: ModalDialog,
            infotip: AdvancedTooltip,
        },
        data: function () {
            return {
                panelData: {},
                activePanel: VariablePanel,
                contentSignal: '',
                canAcceptDrop: false,
            };
        },
        created: function() {
            this.panelData = {
                variable: this.variable,
                model: this.getModel(this.modelIndex),
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getUnitsAt: 'models/getUnitsAt',
                getModel: 'models/getModel',
            }),
            hasContent() {
                return this.variable.name().length > 0;
            },
            name() {
                return this.hasContent ? this.variable.name() : null;
            },
            acceptsDrop() {
                return this.canAcceptDrop;
            },
        },
        methods: {
            doDragStart(index, event) {
                this.showAdvancedTooltip = false;
                event.stopPropagation();
                event.dataTransfer.effectAllowed = 'copyMove';
                event.dataTransfer.setData('int/variable-index', index);
                event.dataTransfer.setData('int/model-index', this.modelIndex);
                event.dataTransfer.setData('int/component-index-path', JSON.stringify(this.componentPath));
                event.dataTransfer.setData('text/plain', 'units');
                event.dataTransfer.setData('variable', null);
                this.$store.commit('ui/updateDraggingEntity', true);
                this.$store.commit('ui/setMovingEntity', true);
            },
            allowDrop(event) {
                const isUnits = event.dataTransfer.types.includes('units');
                if (isUnits) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.type === 'dragenter' || event.type === 'dragover') {
                        this.canAcceptDrop = true;
                    } else if (event.type === 'dragleave') {
                        this.canAcceptDrop = false;
                    }
                }
            },
            doDrop(event) {
                if (this.canAcceptDrop) {
                    this.canAcceptDrop = false;
                    event.preventDefault();
                    event.stopPropagation();
                    const modelIndex = event.dataTransfer.getData('int/model-index');
                    const unitsIndex = parseInt(event.dataTransfer.getData('int/units-index'));
                    const units = this.getUnitsAt(modelIndex, unitsIndex);
                    this.variable.setUnitsByUnits(units);
                }
            },
        }
    }
</script>

<style scoped="true">
    .cellml-variable {
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