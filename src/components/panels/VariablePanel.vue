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
                <th scope="row"><label for="variableInterfaceType">Interface type:</label></th>
                <td>
                    <select id="variableInterfaceType" v-model="interfaceType">
                        <option v-for="(item, index) in getInterfaceTypes" :key="index" :value="item">{{ item }}</option>
                </select>
                </td>
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
            },
            interfaceType: {
                get() {
                    return this.variable.interfaceType();
                },
                set(value) {
                    if (value === "NONE") {
                        this.variable.removeInterfaceType();
                    } else {
                        this.variable.setInterfaceTypeByString(value);
                    }
                }
            },
            getInterfaceTypes() {
                let types = [];
                for (let c in this.$libcellml.Variable_InterfaceType.values) {
                    const enumLongName = this.$libcellml.Variable_InterfaceType.values[c].constructor.name;
                    const splitNames = enumLongName.split('Variable_InterfaceType_');
                    types.push(splitNames[splitNames.length - 1]);
                }
                return types;
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
