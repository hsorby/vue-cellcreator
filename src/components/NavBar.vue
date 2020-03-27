<template>
    <div class="nav-bar"><h1>Cell Creator</h1>
        <p>[with libCellML version {{ version }}]</p>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const { mapState: mapStatusesState } = createNamespacedHelpers('statuses')

    export default {

        name: 'NavBar',
        computed: {
            ...mapStatusesState({
                isLibCellMLReady: state => state.libcellml,
            }),
            version() {
                return this.isLibCellMLReady ? this.$libcellml.versionString() : "A.B.C";
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .nav-bar {
        background: linear-gradient(90deg, #dd0f28 65%, #cdd7dd 85%, #0b0b0b 99%);
        height: 60px;
        margin-bottom: 15px;
        text-align: left;
        vertical-align: middle;
        line-height: 60px;
    }

    h1, p {
        display: inline;
        margin-left: 15px;
    }
</style>
