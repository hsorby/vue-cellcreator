<template>
    <div class="variable-panel">
        <h1>Define Variable</h1>
        <table>
            <tr>
                <th scope="row">Variable name:</th>
                <td><click-to-edit v-model="name" default-value="set variable name here"/></td>
            </tr>
        </table>
        <table>
            <tr>
                <th scope="row">Initial value:</th>
                <td><click-to-edit v-model="initialValue" default-value=""/></td>
            </tr>
            <tr>
                <th scope="row">Interface type:</th>
                <td>something</td>
            </tr>
        </table>
        <button class="variable-panel-button" @click.stop @click.prevent="$parent.$emit('close')">Done</button>
    </div>
</template>

<script>
    import ClickToEdit from "@/components/utilities/ClickToEdit";

    export default {
        name: 'VariablePanel',
        components: {ClickToEdit},
        props: {
            data: Object,
        },
        data() {
            return {
                variable: this.data.variable,
            }
        },
        mounted() {
            console.log(this.variable);
            console.log(this.variable.InterfaceType);
            console.log(this.variable.interfaceType());
        },
        computed: {
            name: {
                get() {
                    return this.variable.name();
                },
                set(value) {
                    this.variable.setName(value);
                },
            },
            initialValue: {
                get() {
                    return this.variable.initialValue();
                },
                set(value) {
                    this.variable.setInitialValueByString(value);
                },
            }
        }
    }
</script>

<style scoped="true">

    .variable-panel-button {
        margin-top: 1em;
    }

    th {
        text-align: right;
    }

</style>
