<template>
    <div class="cellml-variable clickable" :style="entityStyle('variable')"
         :tooltip="name"
         draggable="true"
         @dragstart="dragStart(index, $event)"
         @dragend="dragEnd"
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
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
            }),
            hasContent() {
                return this.variable.name().length > 0;
            },
            name() {
                return this.hasContent ? this.variable.name() : null;
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
            onClick() {
                this.panelData = {
                    variable: this.variable,
                };
                this.showModal = true;
            },
            onClose() {
                this.showModal = false;
                this.$store.commit('models/modelChanged', this.modelIndex);
            }
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