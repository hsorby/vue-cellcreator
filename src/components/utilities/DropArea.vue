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
                    <!--          <progress max="100" :style="{ visibility: displayProgress }" :value.prop="uploadPercentage"></progress>-->
                </div>
            </div>
        </div>
    </slidingpanel>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SlidingPanel from '@/components/utilities/SlidingPanel';

    export default {
        name: 'DropArea',
        components: {
            slidingpanel: SlidingPanel,
        },
        props: ['full', 'slidable'],
        data() {
            return {
                acceptsDrop: false,
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
                if (this.removingEntityUnderDrag) {
                    let index = event.dataTransfer.getData('int/model-index');
                    this.$store.commit('models/removeModel', index);
                } else {
                    this.$store.commit('models/addModel');
                }
            },
            _handleUnitsDrop(event) {
                const unitsIndex = parseInt(event.dataTransfer.getData('int/units-index'));
                const index = event.dataTransfer.getData('int/model-index');
                const units = event.dataTransfer.getData('object/js');
                console.log('Removing units:');
                console.log(index);
                console.log(unitsIndex);
                console.log(units);
                this.$store.commit('models/removeUnits', {modelIndex: index, unitsIndex: unitsIndex});
            },
            drop(event) {
                if (this.acceptsDrop) {
                    event.preventDefault();
                    event.stopPropagation();
                    let isModel = event.dataTransfer.types.includes('model');
                    let isUnits = event.dataTransfer.types.includes('units');
                    if (isModel) {
                        this._handleModelDrop(event);
                    } else if (isUnits) {
                        this._handleUnitsDrop(event);
                    }
                    this.acceptsDrop = false;
                }
            },
            _standardDragHandler(event) {
                if (event.dataTransfer.effectAllowed === 'copyMove') {
                    this.$store.commit('ui/setMovingEntity', true);
                }
                if (event.target.id === 'GenericDropTarget') {
                    this.acceptsDrop = true;
                    let isModel = event.dataTransfer.types.includes('model');
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
