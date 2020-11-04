<template>
    <div class="cellml-model" :style="entityStyle('model')"
         :class="{'accepts-drop': acceptsDrop}"
         :modified="changed"
         draggable="true"
         @dragstart="doDragStart(index, $event)"
         @dragend="doDragEnd"
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
                        <li class="clickable" @click="validateClicked">Validate</li>
                    </ul>
                </div>
            </slidingmenu>
        </div>
        <div class="model-children display-flex">
            <div class="units-children">
                <div class="units-container" v-for="(units, unitsIndex) in getUnits(index)"
                     :key="'units_' + unitsIndex">
                    <cellmlunits :units="units" :index="unitsIndex" :modelIndex="index"/>
                </div>
            </div>
            <ul class="component-children">
                <li class="component-container" v-for="(component, componentIndex) in getComponents(index, [])"
                     :key="'component_' + componentIndex">
                    <cellmlcomponent :component="component" :index="componentIndex" :indexPath="[]" :modelIndex="index"/>
                </li>
            </ul>
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
    import Component from "@/components/cellml/Component";

    export default {
        name: 'CellMLModel',
        props: ['model', 'index'],
        components: {
            clicktoedit: ClickToEdit,
            slidingmenu: SlidingMenu,
            modaldialog: ModalDialog,
            printpanel: PrintPanel,
            cellmlunits: Units,
            cellmlcomponent: Component,
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
                pendingLeave: false,
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getComponents: 'models/getComponents',
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
            validateClicked() {
                const validator = new this.$libcellml.Validator();
                validator.validateModel(this.model);
                console.log("Error count: " + validator.errorCount());
                for (let index = 0; index < validator.errorCount(); index++) {
                    const err = validator.error(index);
                    console.log(err.description());
                }
            },
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
                        const payload = {
                            sourceModel: sourceIndex,
                            targetModel: this.index,
                            unitsIndex: parseInt(index)
                        };
                        this.$store.commit('models/moveUnits', payload);
                    }
                } else if (index === '') {
                    // Adding new
                    this.$store.commit('models/addNewUnits', this.index);
                }
            },
            _dropComponent(event) {
                const sourceIndexPathStr = event.dataTransfer.getData('int/component-index-path');
                if (event.dataTransfer.effectAllowed === 'copy' && sourceIndexPathStr !== '') {
                    // Copying existing
                    const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const payload = {sourceModel: sourceIndex, sourcePath: sourceIndexPath,
                        targetModel: this.index, targetPath: []};
                    this.$store.commit('models/addClonedComponent', payload);
                } else if (sourceIndexPathStr !== '') {
                    // Moving existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                    const targetIndexPath = [sourceIndex];
                    const targetIndexPathStr = JSON.stringify(targetIndexPath.slice(0, sourceIndexPath.length));
                    if (!(sourceIndex === this.index && sourceIndexPathStr === targetIndexPathStr)) {
                        const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                        const payload = {
                            sourceModel: sourceIndex,
                            sourcePath: sourceIndexPath,
                            targetModel: this.index,
                            targetPath: [],
                        };
                        this.$store.commit('models/moveComponent', payload);
                    }
                } else if (sourceIndexPathStr === '') {
                    // Adding new
                    this.$store.commit('models/addNewComponent', {targetModel: this.index, targetPath: []});
                }
            },
            doDrop(event) {
                this.canAcceptDrop = false;
                let isComponent = event.dataTransfer.types.includes('component');
                let isUnits = event.dataTransfer.types.includes('units');
                if (isUnits) {
                    this._dropUnits(event);
                } else if (isComponent) {
                    this._dropComponent(event);
                }
                if (isUnits || isComponent) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            _standardDragHandler(event) {
                let isUnits = event.dataTransfer.types.includes('units');
                let isComponent = event.dataTransfer.types.includes('component');
                if (isUnits || isComponent) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.type === 'dragenter' || event.type === 'dragover') {
                        this.canAcceptDrop = true;
                        this.pendingLeave = false;
                    } else if (event.type === 'dragleave') {
                        setTimeout(function () {
                            if (this.pendingLeave) {
                                this.canAcceptDrop = false;
                            }
                        }.bind(this), 100);
                        this.pendingLeave = true;
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
            doDragStart(index, event) {
                event.dataTransfer.effectAllowed = 'copyMove';
                event.dataTransfer.setData('int/model-index', index);
                event.dataTransfer.setData('text/plain', 'model');
                event.dataTransfer.setData('model', null);
                this.$store.commit('ui/updateDraggingEntity', true);
                this.$store.commit('ui/setMovingEntity', true);
            },
            doDragEnd() {
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
        align-self: flex-start;
    }

    .menu {
        background-color: #318c61;
        margin-left: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .entity-menu {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .component-children {
        padding-inline-start: 1em;
        margin: 5px 0px;
    }

    .component-container {
        display: block;
        margin-bottom: 3px;
    }

</style>
