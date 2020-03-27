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
        methods: {
            submitFiles() {
                let formData = new FormData();
                for (let i = 0; i < this.files.length; i++) {
                    let file = this.files[i];
                    formData.append('files[' + i + ']', file);

                    let reader = new FileReader();
                    /*
                      Add an event listener for when the file has been loaded.
                    */
                    reader.addEventListener("progress", function (progressEvent) {
                        this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    }.bind(this));
                    reader.addEventListener("loadstart", function () {
                        this.displayProgress = "visible";
                    }.bind(this));
                    reader.addEventListener("loadend", function () {
                        setTimeout(function () {
                            this.displayProgress = "hidden";
                        }.bind(this), 750);
                    }.bind(this));
                    reader.addEventListener("load", function () {
                        console.log(reader.result);
                    }.bind(this), false);

                    reader.readAsText(this.files[i]);
                }
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
