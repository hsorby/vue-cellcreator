<template>
    <li class="cellml-component clickable" :style="entityStyle('component')"
         :class="{'accepts-drop': acceptsDrop}"
         draggable="true"
         @dragstart="dragStart(index, $event)"
         @dragend="dragEnd"
         @dragenter="allowDrop"
         @drop="doDrop"
         @dragover="allowDrop"
         @dragleave="allowDrop">
        <div class="display-flex entity-menus-container">
            <clicktoedit v-model="name" class="self-aligned-start" :fit-content="true"
                         default-value="set component name here"></clicktoedit>
        </div>
        <div class="component-children">
            <ul class="component-container"
                 v-for="(component, componentIndex) in getComponents(modelIndex, [...indexPath, index])"
                 :key="'component_' + componentIndex">
                <CellMLComponent :component="component" :index="componentIndex" :indexPath="[...indexPath, index]"
                                 :modelIndex="modelIndex"/>
            </ul>
        </div>
    </li>
</template>

<script>
    import {mapGetters} from "vuex";
    import ClickToEdit from "@/components/utilities/ClickToEdit";

    export default {
        name: 'CellMLComponent',
        props: ['component', 'index', 'indexPath', 'modelIndex'],
        components: {
            clicktoedit: ClickToEdit,
        },
        data: function () {
            return {
                acceptsDrop: false,
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getComponents: 'models/getComponents',
            }),
            name: {
                get() {
                    return this.component.name();
                },
                set(value) {
                    this.component.setName(value);
                },
            },
            componentPath() {
                return this.indexPath;
            }
        },
        methods: {
            dragStart(index, event) {
                event.stopPropagation();
                event.dataTransfer.effectAllowed = 'copyMove';
                event.dataTransfer.setData('int/component-index-path', JSON.stringify([...this.indexPath, index]));
                event.dataTransfer.setData('int/model-index', this.modelIndex);
                event.dataTransfer.setData('text/plain', 'component');
                event.dataTransfer.setData('component', null);
                this.$store.commit('ui/updateDraggingEntity', true);
                this.$store.commit('ui/setMovingEntity', true);
            },
            dragEnd() {
                this.$store.commit('ui/updateDraggingEntity', false);
                this.$store.commit('ui/setMovingEntity', false);
            },
            _dropComponent(event) {
                const sourceIndexPathStr = event.dataTransfer.getData('int/component-index-path');
                if (event.dataTransfer.effectAllowed === 'copy' && sourceIndexPathStr !== '') {
                    // Copying existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                    const targetIndexPath = [...this.indexPath, parseInt(this.index)];
                    const payload = {
                        sourceModel: sourceIndex, sourcePath: sourceIndexPath,
                        targetModel: this.modelIndex, targetPath: targetIndexPath
                    };
                    this.$store.commit('models/addClonedComponent', payload);
                } else if (sourceIndexPathStr !== '') {
                    // Moving existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const targetIndexPath = [...this.indexPath, parseInt(this.index)];
                    const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                    const targetIndexPathStr = JSON.stringify([...targetIndexPath, sourceIndexPath[sourceIndexPath.length - 1]]);
                    if (!(sourceIndex === this.modelIndex && sourceIndexPathStr === targetIndexPathStr)) {
                        const payload = {
                            sourceModel: sourceIndex,
                            sourcePath: sourceIndexPath,
                            targetModel: this.modelIndex,
                            targetPath: targetIndexPath,
                        };
                        this.$store.commit('models/moveComponent', payload);
                    }
                } else if (sourceIndexPathStr === '') {
                    // Adding new
                    const indexPath = [...this.indexPath, this.index];
                    this.$store.commit('models/addNewComponent', {targetModel: this.modelIndex, targetPath: indexPath});
                }
            },
            doDrop(event) {
                this.acceptsDrop = false;
                let isComponent = event.dataTransfer.types.includes('component');
                if (isComponent) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._dropComponent(event);
                }
            },
            _standardDragHandler(event) {
                let isComponent = event.dataTransfer.types.includes('component');
                if (isComponent) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.type === 'dragenter') {
                        this.acceptsDrop = true;
                    } else if (event.type === 'dragleave') {
                        this.acceptsDrop = false;
                    }
                }
            },
            allowDrop(event) {
                this._standardDragHandler(event);
            },
        }
    }
</script>

<style scoped="true">
    .cellml-component {
        min-height: 30px;
        min-width: 30px;
        /*margin: 0px;*/
        margin-bottom: 2px;
        border-radius: 9%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .24), 0 0 0 rgba(0, 0, 0, .16);
        /*display: flex;*/
        align-items: center;
        justify-content: center;
        display: block;
    }

    ul {
        list-style-type: none;
        margin-left: 2em;
        margin-bottom: 3px;
        margin-right: 3px;
        padding: 0;
    }
</style>