<template>
    <slidingpanel
            format="full"
            :slidable="slidable"
            class="sliding-panel"
            :class="{'width-100-height-100': full}"
    >
        <div id="GenericDropTarget" :class="{'accepts-drop': acceptsDrop}"
             @drop="drop"
             @dragover="allowDrop"
             @dragenter="allowDrop"
             @dragleave="allowDrop">
            <div class="ignore-mouse align-center justify-center display-flex">
                <div class="background-image-settings align-end justify-center display-flex"
                     :style="{backgroundImage: 'url(' + backgroundImage + ')'}">
                    <span v-if="removingEntityUnderDrag">Remove.</span>
                    <span v-else>Drop CellML files or Model entity here.</span>
                </div>
            </div>
        </div>
        <modaldialog v-if="showModal" @close="showModal = false">
            <component :is="activePanel" :data="panelData"/>
        </modaldialog>
    </slidingpanel>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SlidingPanel from '@/components/utilities/SlidingPanel';
    import ModalDialog from "@/components/utilities/ModalDialog";
    import LoadFilePanel from "@/components/panels/LoadFilePanel";

    export default {
        name: 'DropArea',
        components: {
            slidingpanel: SlidingPanel,
            modaldialog: ModalDialog,
        },
        props: ['full', 'slidable'],
        data() {
            return {
                acceptsDrop: false,
                showModal: false,
                activePanel: LoadFilePanel,
                panelData: {},
            };
        },
        computed: {
            ...mapGetters({
                entityUnderDrag: 'ui/draggingEntity',
                movingEntity: 'ui/movingEntity',
            }),
            backgroundImage() {
                return this.removingEntityUnderDrag ? require('@/assets/trashcan.svg') : require('@/assets/drag-target.svg');
            },
            removingEntityUnderDrag() {
                return this.entityUnderDrag && this.movingEntity;
            },
        },
        methods: {
            _handleModelDrop(event) {
                let index = event.dataTransfer.getData('int/model-index');
                if (this.removingEntityUnderDrag) {
                    this.$store.commit('models/removeModel', index);
                } else {
                    this.$store.commit('models/addModel', index);
                }
            },
            _handleUnitsDrop(event) {
                const unitsIndex = parseInt(event.dataTransfer.getData('int/units-index'));
                const index = event.dataTransfer.getData('int/model-index');
                this.$store.commit('models/removeUnits', {modelIndex: index, unitsIndex: unitsIndex});
            },
            _handleVariableDrop(event) {
                const variableIndex = parseInt(event.dataTransfer.getData('int/variable-index'));
                const componentIndexPath = JSON.parse(event.dataTransfer.getData('int/component-index-path'));
                const index = event.dataTransfer.getData('int/model-index');
                this.$store.commit('models/removeVariable', {sourceModel: index, sourcePath: componentIndexPath, index: variableIndex});
            },
            _handleComponentDrop(event) {
                const componentIndexPath = JSON.parse(event.dataTransfer.getData('int/component-index-path'));
                const index = event.dataTransfer.getData('int/model-index');
                this.$store.commit('models/removeComponent', {sourceModel: index, sourcePath: componentIndexPath});
            },
            _handleFilesDrop(files) {
                this.panelData = {
                    files: files,
                };
                this.showModal = true;
            },
            drop(event) {
                let droppedFiles = event.dataTransfer.files;
                if (droppedFiles.length > 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._handleFilesDrop(droppedFiles);
                }
                if (this.acceptsDrop) {
                    event.preventDefault();
                    event.stopPropagation();
                    let isModel = event.dataTransfer.types.includes('model');
                    let isUnits = event.dataTransfer.types.includes('units');
                    let isComponent = event.dataTransfer.types.includes('component');
                    let isVariable = event.dataTransfer.types.includes('variable');
                    if (isModel) {
                        this._handleModelDrop(event);
                    } else if (isUnits) {
                        this._handleUnitsDrop(event);
                    } else if (isComponent) {
                        this._handleComponentDrop(event);
                    } else if (isVariable) {
                        this._handleVariableDrop(event);
                    }
                    this.acceptsDrop = false;
                }
            },
            _standardDragHandler(event) {
                if (event.dataTransfer.effectAllowed === 'copyMove') {
                    this.$store.commit('ui/setMovingEntity', true);
                }
                if (event.target.id === 'GenericDropTarget') {
                    let isModel = event.dataTransfer.types.includes('model');
                    if (event.dataTransfer.effectAllowed === 'copy' && !isModel) {
                        return;
                    }
                    this.acceptsDrop = true;
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.dataTransfer.effectAllowed === 'copy' && isModel) {
                        this.$store.commit('ui/setMovingEntity', false);
                    }
                }
            },
            allowDrop(event) {
                this._standardDragHandler(event);
            },
        },
    }
</script>

<style scoped="true">
    .sliding-panel {
        margin-left: auto;
    }

    .background-image-settings {
        background-repeat: no-repeat;
        background-position: center;
        background-size: 200px 300px;
        min-height: 200px;
        min-width: 300px;
    }

</style>
