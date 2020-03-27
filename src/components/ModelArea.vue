<template>
    <div class="display-flex">
        <div class="model-render display-flex" v-show=haveModels>
            <!--                 @dragover="allowDrop"-->
            <div v-for="(model, index) in models"
                 :key="index"
                 class="display-flex">
                <cellmlmodel :model="model" :index="index"/>
            </div>
        </div>
        <droparea :full="!haveModels" :slidable="dropTargetSlidable"/>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import CellMLModel from '@/components/cellml/Model';
    import DropArea from "@/components/utilities/DropArea";

    import store from '@/store';
    import models from '@/store/models'

    if (!store.state.models) store.registerModule(`models`, models);

    export default {
        name: 'ModelArea',
        components: {
            cellmlmodel: CellMLModel,
            droparea: DropArea,
        },
        data() {
            return {
                displayProgress: "hidden",
                files: [],
                uploadPercentage: 0,
            };
        },
        computed: {
            ...mapGetters({
                modelsCount: 'models/modelsCount',
                models: 'models/getModels',
            }),
            haveModels() {
                return this.modelsCount > 0;
            },
            dropTargetSlidable() {
                return this.models.length > 1;
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .model-render {
        justify-content: space-between;
        align-content: space-between;
        flex-grow: 0.1;
        flex-wrap: wrap;
    }

    progress {
        width: 66%;
        margin: 20px auto;
        /*display: block;*/
    }
</style>
