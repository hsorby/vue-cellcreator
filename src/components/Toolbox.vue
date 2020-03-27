<template>
    <div class="toolbox column-centered display-flex">
        <span class="bold margin-3px">Model Entities</span>
        <div class="toolbox-item toolbox-item-z-index"
             v-for="(item, index) in entities"
             :key="index"
             :style="{backgroundColor: item.backgroundColor}"
             draggable="true"
             @dragstart='startDrag($event, item)'>
            <span>{{ item.title }}</span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'Toolbox',
        components: {},
        computed: {
            ...mapGetters({
                entities: 'ui/cellMLEntities',
            })
        },
        methods: {
            startDrag(evt, item) {
                evt.dataTransfer.effectAllowed = 'copy';
                evt.dataTransfer.setData('object', item);
                evt.dataTransfer.setData("text/plain", item.name);
                evt.dataTransfer.setData(item.name, null);
                this.$store.commit('ui/updateDraggingEntity', true);
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .toolbox {
        border-width: 1px;
        border-style: solid;
        align-self: flex-start;
    }

    .toolbox-item {
        /*position: absolute;*/
        height: 50px;
        width: 50px;
        margin: 5px;
        border-radius: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-transition: all .2s ease;
        transition: all .2s ease;
        -webkit-transform: none;
        transform: none;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .24), 0 0 0 rgba(0, 0, 0, .16);
        box-shadow: 0 1px 3px rgba(0, 0, 0, .24), 0 0 0 rgba(0, 0, 0, .16);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-size: 16px;
    }
</style>
