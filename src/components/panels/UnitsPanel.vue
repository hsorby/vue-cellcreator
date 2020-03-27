<template>
    <div class="units-panel">
        <h1>Define Units</h1>
        <table>
            <tr>
                <th scope="row">Units name:</th>
                <td><click-to-edit v-model="name" default-value="set units name here"/></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        <cell-m-l-unit-entry :units="units"></cell-m-l-unit-entry>
        <button class="units-panel-button" @click.stop @click.prevent="$parent.$emit('close')">Done</button>
    </div>
</template>

<script>
    import ClickToEdit from "@/components/utilities/ClickToEdit";
    import CellMLUnitEntry from "@/components/widgets/UnitEntry";

    export default {
        name: 'UnitsPanel',
        components: {CellMLUnitEntry, ClickToEdit},
        props: {
            data: Object,
        },
        data() {
            return {
                units: this.data.units,
            }
        },
        computed: {
            name: {
                get() {
                    return this.units.name();
                },
                set(value) {
                    this.units.setName(value);
                }
            }
        }
    }
</script>

<style scoped="true">

    .units-panel-button {
        margin-top: 1em;
    }
</style>
