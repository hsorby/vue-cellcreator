<template>
    <div class="load-file-panel">
        <div v-for="(file, key) in files" :key="key" class="file-listing">
            {{ file.name }}
            <progress max="100" :style="{ visibility: displayProgress }" :value.prop="uploadPercentage"></progress>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'LoadFilePanel',
        props: {
            data: Object,
        },
        data() {
            return {
                files: this.data.files,
                displayProgress: "hidden",
                uploadPercentage: 0,
            }
        },
        computed: {},
        mounted() {
            this.submitFiles();
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
                        // console.log(reader.result);
                        this.$store.commit('models/loadModel', reader.result);
                        this.$parent.$emit('close')
                    }.bind(this), false);

                    reader.readAsText(this.files[i]);
                }
            },
        },
    }
</script>

<style scoped="true">
</style>
