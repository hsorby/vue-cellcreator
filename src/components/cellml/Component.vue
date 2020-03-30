<template>
    <li class="cellml-component clickable" :style="entityStyle('component')"
        :class="{'accepts-drop': canAcceptDrop}"
        @click="onClick"
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
            <div class="component-math" v-if="hasMath">
                <span class="sigma-span" :style="{backgroundImage: 'url(' + backgroundImage + ')'}"> </span>
            </div>
        </div>
        <div class="variable-children">
            <div class="variable-container"
                 v-for="(variable, variableIndex) in getVariables(modelIndex, [...indexPath, index])"
                 :key="'variable_' + variableIndex">
                <cellmlvariable :variable="variable" :index="variableIndex" :componentPath="[...indexPath, index]"
                                :modelIndex="modelIndex"/>
            </div>
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
    import Variable from "@/components/cellml/Variable";

    function isChildComponent(sourceModel, sourcePath, targetModel, targetPath) {
        // Is the target component a child of the source component?

        // Not if the models are different.
        if (sourceModel !== targetModel) {
            return false;
        }

        // Not if the target path does not start the same as the source path.
        const testTargetPath = targetPath.slice(0, sourcePath.length);
        const sourcePathStr = JSON.stringify(sourcePath);
        const testTargetPathStr = JSON.stringify(testTargetPath);
        return sourcePathStr === testTargetPathStr;
    }

    function isTargetParentComponent(sourceModel, sourcePath, targetModel, targetPath) {
        // Is the target component the parent of the source component?

        // Not if the models are different.
        if (sourceModel !== targetModel) {
            return false;
        }

        // Yes if the source path starts the same as the target path.
        const testSourcePath = sourcePath.slice(0, sourcePath.length - 1);
        const targetPathStr = JSON.stringify(targetPath);
        const testSourcePathStr = JSON.stringify(testSourcePath);
        return targetPathStr === testSourcePathStr;
    }

    export default {
        name: 'CellMLComponent',
        props: ['component', 'index', 'indexPath', 'modelIndex'],
        components: {
            clicktoedit: ClickToEdit,
            cellmlvariable: Variable,
        },
        data: function () {
            return {
                canAcceptDrop: false,
                pendingLeave: false,
            };
        },
        computed: {
            ...mapGetters({
                entityStyle: 'ui/cellMLEntityStyle',
                getComponents: 'models/getComponents',
                getVariables: 'models/getVariables',
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
            },
            hasMath() {
                return this.component.math.length === 0;
            },
            backgroundImage() {
                return require('@/assets/sigma.svg');
            },
            acceptsDrop() {
                return this.canAcceptDrop;
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
                    const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                    const targetIndexPath = [...this.indexPath, parseInt(this.index)];

                    const isChild = isChildComponent(sourceIndex, sourceIndexPath, this.modelIndex, targetIndexPath);
                    const isParent = isTargetParentComponent(sourceIndex, sourceIndexPath, this.modelIndex, targetIndexPath);
                    if (!isChild && !isParent) {
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
            _dropVariable(event) {
                const index = event.dataTransfer.getData('int/variable-index');
                // const variableIndex = event.
                if (event.dataTransfer.effectAllowed === 'copy' && index !== '') {
                    // Copying existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const sourceIndexPath = JSON.parse(event.dataTransfer.getData('int/component-index-path'));
                    const targetIndexPath = [...this.indexPath, parseInt(this.index)];
                    const payload = {
                        sourceModel: sourceIndex, sourcePath: sourceIndexPath,
                        targetModel: this.modelIndex, targetPath: targetIndexPath,
                        index: parseInt(index),
                    };
                    this.$store.commit('models/addClonedVariable', payload);
                } else if (index !== '') {
                    // Moving existing
                    const sourceIndex = parseInt(event.dataTransfer.getData('int/model-index'));
                    const sourceIndexPathStr = event.dataTransfer.getData('int/component-index-path');
                    const targetIndexPath = [...this.indexPath, parseInt(this.index)];
                    const sourceIndexPath = JSON.parse(sourceIndexPathStr);
                    const targetIndexPathStr = JSON.stringify([...targetIndexPath, sourceIndexPath[sourceIndexPath.length - 1]]);
                    if (!(sourceIndex === this.modelIndex && sourceIndexPathStr === targetIndexPathStr)) {
                        const payload = {
                            sourceModel: sourceIndex,
                            sourcePath: sourceIndexPath,
                            targetModel: this.modelIndex,
                            targetPath: targetIndexPath,
                            index: parseInt(index),
                        };
                        this.$store.commit('models/moveVariable', payload);
                    }
                } else if (index === '') {
                    // Adding new
                    const indexPath = [...this.indexPath, this.index];
                    this.$store.commit('models/addNewVariable', {targetModel: this.modelIndex, targetPath: indexPath});
                }
            },
            doDrop(event) {
                this.canAcceptDrop = false;
                let isComponent = event.dataTransfer.types.includes('component');
                let isVariable = event.dataTransfer.types.includes('variable');
                if (isComponent || isVariable) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                if (isComponent) {
                    this._dropComponent(event);
                } else if (isVariable) {
                    this._dropVariable(event);
                }
            },
            _standardDragHandler(event) {
                let isComponent = event.dataTransfer.types.includes('component');
                let isVariable = event.dataTransfer.types.includes('variable');
                if (isComponent || isVariable) {
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
            allowDrop(event) {
                this._standardDragHandler(event);
            },
            onClick(event) {
                console.log("On component click.");
                console.log(event);
            }
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

    .variable-children, .variable-container {
        display: flex;
    }

    ul {
        list-style-type: none;
        margin-left: 2em;
        margin-bottom: 3px;
        margin-right: 3px;
        padding: 0;
    }

    .component-math {
        min-height: 20px;
        min-width: 20px;
        margin: 3px 3px 3px auto;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .24), 0 0 0 rgba(0, 0, 0, .16);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
    }

    .sigma-span {
        width: 75%;
        height: 75%;
        background-repeat: no-repeat;
    }
</style>