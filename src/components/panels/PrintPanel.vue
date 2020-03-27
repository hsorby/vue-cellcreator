<template>
    <div class="print-panel">
        <h1>Printed Model</h1>
        <label class="print-panel-label">
            <textarea class="printed-model-text-area" v-model="printedModel" readonly :rows="lineCount" cols="108"/>
        </label>
        <button class="print-panel-button" @click="onSave">Download</button>
    </div>
</template>

<script>

    export default {
        name: 'PrintPanel',
        components: {
        },
        props: {
            data: Object,
        },
        data() {
            return {
                name: this.data.name,
                printedModel: this.data.printedModel,
            }
        },
        computed: {
            lineCount() {
                return this.printedModel.split(/\r\n|\r|\n/).length;
            },
        },
        methods: {
            onSave() {
                const baseName = this.name.length > 0 ? this.name : 'model';
                const modelName = baseName + '.cellml';
                this.save(modelName, this.printedModel);
            },
            save: function(filename, data) {
                let blob = new Blob([data], {type: 'application/xml'});
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    let elem = document.createElement('a');
                    elem.href = URL.createObjectURL(blob);
                    elem.download = filename;
                    document.body.appendChild(elem);
                    elem.click();
                    document.body.removeChild(elem);
                    URL.revokeObjectURL(elem.href);
                }
            }
        },
    }
</script>

<style scoped="true">
    .printed-model-text-area {
        max-width: 100%;
        resize: vertical;
    }

    .print-panel-label {
        display: flex;
    }

    .print-panel-button {
        margin-top: 1em;
    }

</style>
