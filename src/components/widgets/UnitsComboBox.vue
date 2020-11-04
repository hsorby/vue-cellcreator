<template>
    <div class="units-combo-box" @click="onClick">
        <label>
            <input list="units_names" name="units_names" v-model="name"/>
        </label>
        <datalist id="units_names">
            <option v-for="(unitsName, index) in getStandardUnitsNames" :key="index" :value="unitsName"/>
        </datalist>
    </div>
</template>

<script>

    export default {
        name: 'UnitsComboBox',
        props: {
            'variable': {
              type: Object,
              required: true,
            },
            'model': {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
            };
        },
        computed: {
            name: {
                get() {
                    const u = this.variable.units();
                    if (u) {
                        return u.name();
                    }
                    return '';
                },
                set(value) {
                    const u = this.model.unitsByName(value);
                    if (u) {
                        this.variable.setUnitsByUnits(u);
                    }
                    this.variable.setUnitsByName(value);
                },
            },
            getStandardUnitsNames() {
                let standardUnitsNames = [];
                for (let c in this.$libcellml.StandardUnit.values) {
                    const enumLongName = this.$libcellml.StandardUnit.values[c].constructor.name;
                    const splitNames = enumLongName.split('StandardUnit_');
                    standardUnitsNames.push(splitNames[splitNames.length - 1].toLowerCase());
                }
                return standardUnitsNames;
            },
        },
        methods: {
            onClick(event) {
                event.stopPropagation();
                event.preventDefault();
            },
        },
    }
</script>

<style scoped="true">
</style>
