<template>
    <div class="cellml-model" :style="entityStyle('model')"
         :class="{'accepts-drop': acceptsDrop}"
         :modified="changed"
         draggable="true"
         @dragstart="dragModel(index, $event)"
         @dragend="dragModelEnd"
         @dragenter="doDragEnter"
         @drop="doDrop"
         @dragover="doDragOver"
         @dragleave="doDragLeave">
        <div class="display-flex entity-menus-container" :style="size">
            <clicktoedit v-model="name" class="self-aligned-start" default-value="set model name here"></clicktoedit>
            <slidingmenu class="menu" tag="div" direction="right" v-bind:size="size" v-on:update:size="size = $event">
                <div>
                <ul class="entity-menu">
                    <li class="clickable" @click="printClicked">Print</li>
                </ul>
                </div>
            </slidingmenu>
        </div>
        <div class="display-flex units-container" v-for="(units, unitsIndex) in getUnits(index)" :key="unitsIndex">
            <cellmlunits :units="units" :index="unitsIndex" :modelIndex="index"/>
        </div>
        <modaldialog v-if="showModal" @close="showModal = false">
            <component :is="activePanel" :data="panelData"/>
        </modaldialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import ClickToEdit from "@/components/utilities/ClickToEdit";
    import SlidingMenu from "@/components/utilities/SlidingMenu";
    import ModalDialog from "@/components/utilities/ModalDialog";
    import PrintPanel from "@/components/panels/PrintPanel";
    import Units from "@/components/cellml/Units";
    // import {isNegative} from "@/js/utilities";

    export default {
        name: 'CellMLModel',
        props: ['model', 'index'],
        components: {
            clicktoedit: ClickToEdit,
            slidingmenu: SlidingMenu,
            modaldialog: ModalDialog,
            printpanel: PrintPanel,
            cellmlunits: Units,
        },
        data: function () {
            return {
                size: {height: 'auto'},
                expanded: true,
                barStyle: {
                    backgroundColor: 'red'
                },
                showModal: false,
                activePanel: false,
                panelData: {},
                canAcceptDrop: false,
                status: false,
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getUnits: 'models/getUnits',
                changeNotification: 'models/changed',
                getModelStatus: 'models/getStatus',
            }),
            name: {
                get() {
                    return this.model.name();
                },
                set(value) {
                    this.model.setName(value);
                },
            },
            acceptsDrop() {
                return this.canAcceptDrop;
            },
            changed() {
                // This is all just a ruse.  We only want to listen to changes
                // in this.changeNotification so we make it do some dummy work
                // to trigger the actual update that we want.
                let changeOccurred = false;
                if (this.changeNotification) {
                    changeOccurred = false;
                }
                // Get model status will tell us which model has actually changed.
                return this.getModelStatus(this.index) || changeOccurred;
            },
        },
        methods: {
            printClicked() {
                const printer = new this.$libcellml.Printer();
                const printedModel = printer.printModel(this.model);
                this.panelData = {
                    name: this.model.name(),
                    printedModel: printedModel
                };

                this.activePanel = PrintPanel;
                this.showModal = true;
            },
            _dropUnits(event) {
                const index = event.dataTransfer.getData('int/units-index');
                if (event.dataTransfer.effectAllowed === 'copy' && index !== '') {
                    // Copying existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const payload = {sourceModel: sourceIndex, targetModel: this.index, unitsToClone: parseInt(index)};
                    this.$store.commit('models/addClonedUnits', payload);
                } else if (index !== '') {
                    // Moving existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    if (sourceIndex !== this.index) {
                        const payload = {sourceModel: sourceIndex, targetModel: this.index, unitsIndex: parseInt(index)};
                        this.$store.commit('models/moveUnits', payload);
                    }
                } else if (index === '') {
                    // Adding new
                    this.$store.commit('models/addNewUnits', this.index);
                }
                console.log('units count: ' + this.model.unitsCount());
            },
            doDrop(event) {
                this.canAcceptDrop = false;
                let isUnits = event.dataTransfer.types.includes('units');
                if (isUnits) {
                    this._dropUnits(event);
                }
            },
            _standardDragHandler(event) {
                let isUnits = event.dataTransfer.types.includes('units');
                if (isUnits) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.type === 'dragenter') {
                        this.canAcceptDrop = true;
                    } else if (event.type === 'dragleave') {
                        this.canAcceptDrop = false;
                    }
                }
            },
            doDragOver(event) {
                this._standardDragHandler(event);
            },
            doDragEnter(event) {
                this._standardDragHandler(event);
            },
            doDragLeave(event) {
                this._standardDragHandler(event);
            },
            dragModel(index, event) {
                event.dataTransfer.effectAllowed = 'copyMove';
                event.dataTransfer.setData('int/model-index', index);
                event.dataTransfer.setData('text/plain', 'model');
                event.dataTransfer.setData('model', null);
                this.$store.commit('ui/updateDraggingEntity', true);
                this.$store.commit('ui/setMovingEntity', true);
            },
            dragModelEnd() {
                this.$store.commit('ui/updateDraggingEntity', false);
                this.$store.commit('ui/setMovingEntity', false);
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .cellml-model {
        border-radius: 7px;
        /*margin-right: 3px;*/
        min-height: 150px;
    }

    .menu {
        background-color: #318c61;
    }

</style>
