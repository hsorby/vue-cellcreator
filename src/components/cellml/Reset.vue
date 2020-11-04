<template>
    <div class="cellml-reset clickable advanced-tooltip-able"
         :style="entityStyle('reset')"
         :class="{'accepts-drop': canAcceptDrop}"
         draggable="true"
         @dragstart="doDragStart(index, $event)"
         @dragend="doDragEnd"
         @dragenter="allowDrop"
         @dragover="allowDrop"
         @dragleave="allowDrop"
         @drop="doDrop"
         @click="onClick">
        <span v-show="hasContent"><font-awesome-icon class="content-colour" icon="plus"/></span>
        <modaldialog v-if="showModal" @close="onClose">
            <component :is="activePanel" :data="panelData"/>
        </modaldialog>
        <infotip v-if="showAdvancedTooltip">
            <div>
                <span>Order: {{ order }}</span>
            </div>
        </infotip>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import ModalDialog from "@/components/utilities/ModalDialog";
    import ResetPanel from "@/components/panels/ResetPanel";
    import AdvancedTooltip from "@/components/utilities/AdvancedTooltip";
    import {advancedTooltipModalEntity} from "@/components/mixins/AdvancedTooltipModalEntity";

    export default {
        name: 'CellMLReset',
        props: ['reset', 'index', 'componentPath', 'modelIndex'],
        mixins: [advancedTooltipModalEntity],
        components: {
            modaldialog: ModalDialog,
            infotip: AdvancedTooltip,
        },
        data: function () {
            return {
                panelData: {},
                activePanel: ResetPanel,
                contentSignal: '',
                canAcceptDrop: false,
            };
        },
        created: function () {
            this.panelData = {
                reset: this.reset,
                model: this.getModel(this.modelIndex),
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getVariableAt: 'models/getVariableAt',
                getModel: 'models/getModel',
            }),
            hasContent() {
                return this.reset.isOrderSet();
            },
            order() {
                return this.hasContent ? this.reset.order() : null;
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
                event.dataTransfer.setData('int/reset-index', index);
                event.dataTransfer.setData('int/model-index', this.modelIndex);
                event.dataTransfer.setData('int/component-index-path', JSON.stringify(this.componentPath));
                event.dataTransfer.setData('text/plain', 'units');
                event.dataTransfer.setData('reset', null);
                this.$store.commit('ui/updateDraggingEntity', true);
                this.$store.commit('ui/setMovingEntity', true);
            },
            allowDrop(event) {
                const isVariable = event.dataTransfer.types.includes('variable');
                if (isVariable) {
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
                    const variableIndex = parseInt(event.dataTransfer.getData('int/variable-index'));
                    const componentIndexPath = JSON.parse(event.dataTransfer.getData('int/component-index-path'));
                    const variable = this.getVariableAt(modelIndex, componentIndexPath, variableIndex);
                    this.reset.setVariable(variable);
                }
            },
        }
    }
</script>

<style scoped="true">
    .cellml-reset {
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