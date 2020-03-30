<template>
    <div class="cellml-variable clickable" :style="entityStyle('variable')"
         :tooltip="name"
         :class="{'accepts-drop': canAcceptDrop}"
         draggable="true"
         @dragstart="dragStart(index, $event)"
         @dragend="dragEnd"
         @dragenter="allowDrop"
         @dragover="allowDrop"
         @dragleave="allowDrop"
         @drop="doDrop"
         @click="onClick">
         <modaldialog v-if="showModal" @close="onClose">
             <component :is="activePanel" :data="panelData"/>
         </modaldialog>
         <span v-show="hasContent"><font-awesome-icon class="content-colour" icon="plus"/></span>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import ModalDialog from "@/components/utilities/ModalDialog";
    import VariablePanel from "@/components/panels/VariablePanel";

    export default {
        name: 'CellMLVariable',
        props: ['variable', 'index', 'componentPath', 'modelIndex'],
        components: {
            modaldialog: ModalDialog,
        },
        data: function() {
            return {
                showModal: false,
                panelData: {},
                activePanel: VariablePanel,
                contentSignal: '',
                canAcceptDrop: false,
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getUnitsAt: 'models/getUnitsAt'
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
            dragStart(index, event) {
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
            dragEnd() {
                this.$store.commit('ui/updateDraggingEntity', false);
                this.$store.commit('ui/setMovingEntity', false);
            },
            onClick(event) {
                event.stopPropagation();
                this.panelData = {
                    variable: this.variable,
                };
                this.showModal = true;
            },
            onClose() {
                this.showModal = false;
                this.$store.commit('models/modelChanged', this.modelIndex);
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