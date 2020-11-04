<template>
    <div class="cellml-unit-entry">
        <table class="unit-table">
            <tr class="cellml-unit" v-for="(unit, index) in unitEntries" :key="index">
                <th scope="row">unit:</th>
                <td><click-to-edit v-model="unit.reference" default-value="reference"/></td>
                <td><click-to-edit v-model="unit.prefix" :fit-content="true" default-value="1"/></td>
                <td><click-to-edit v-model="unit.exponent" :fit-content="true" default-value="1.0"/></td>
                <td><click-to-edit v-model="unit.multiplier" :fit-content="true" default-value="1.0"/></td>
                <td><button @click="onRemove(index)"><font-awesome-icon class="remove-colour" icon="minus"/></button></td>
            </tr>
            <tr class="border-me">
                <th scope="row"></th>
                <td colspan="100%"></td>
            </tr>
            <tr>
                <th scope="row">Add unit:</th>
                <td><click-to-edit v-model="reference" default-value="reference"/></td>
                <td><click-to-edit v-model="prefix" :fit-content="true" tooltip="prefix"/></td>
                <td><click-to-edit v-model="exponent" :fit-content="true" tooltip="exponent"/></td>
                <td><click-to-edit v-model="multiplier" :fit-content="true" tooltip="multiplier"/></td>
                <td><button @click="onAdd"><font-awesome-icon class="add-colour" icon="plus"/></button></td>
            </tr>
        </table>
    </div>
</template>

<script>
    import ClickToEdit from "@/components/utilities/ClickToEdit";

    export default {
        name: 'CellMLUnitEntry',
        props: ['units'],
        components: {ClickToEdit},
        data() {
            return {
                empty: true,
                ref: '',
                pre: '1',
                exp: '1.0',
                mul: '1.0',
                unitEntries: [],
            };
        },
        computed: {
            reference: {
                get() {
                    return this.ref;
                },
                set(value) {
                    this.ref = value;
                }
            },
            prefix: {
                get() {
                    return this.pre;
                },
                set(value) {
                    this.pre = value;
                    this.preWidth = value.length + 2;
                }
            },
            exponent: {
                get() {
                    return this.exp;
                },
                set(value) {
                    this.exp = value;
                }
            },
            multiplier: {
                get() {
                    return this.mul;
                },
                set(value) {
                    this.mul = value;
                }
            },
        },
        mounted() {
            this.initialiseUnitEntries();
        },
        beforeDestroy() {
            this.updateUnits();
        },
        methods: {
            initialiseUnitEntries() {
                this.unitEntries = [];
                for (let index = 0; index < this.units.unitCount(); index++) {
                    this.unitEntries.push(this.getUnitEntry(index));
                }
            },
            updateUnits() {
                this.units.removeAllUnits();
                this.unitEntries.forEach((unit) => {this.units.addUnit(unit.reference, parseInt(unit.prefix), parseFloat(unit.exponent), parseFloat(unit.multiplier), '')});
            },
            onAdd() {
                const unit = {reference: this.ref, prefix: this.pre, exponent: this.exp, multiplier: this.mul};
                this.unitEntries.push(unit);
                this.units.addUnit(this.ref, parseInt(this.pre), parseFloat(this.exp), parseFloat(this.mul), '');
                this.ref = '';
                this.prefix = '1';
                this.exponent = '1.0';
                this.multiplier = '1.0';
            },
            onRemove(index) {
                this.unitEntries.splice(index, 1);
                this.units.removeUnitByIndex(index);
            },
            getUnitEntry(index) {
                const ref = this.units.unitAttributeReferenceByIndex(index);
                const pre = this.units.unitAttributePrefixByIndex(index).toString();
                const exp = this.units.unitAttributeExponentByIndex(index).toString();
                const mul = this.units.unitAttributeMultiplierByIndex(index).toString();
                return {
                    reference: ref,
                    prefix: pre,
                    exponent: exp,
                    multiplier: mul,
                };
            },
        },
    }
</script>

<style scoped="true">
    .add-colour {
        color: green;
    }

    .remove-colour {
        color: red;
    }

    .border-me {
        border-top-style: dashed;
        border-top-width: 1px;
    }

    .unit-table {
        border-collapse: collapse;
    }

    th {
        text-align: right;
    }
</style>
