<template>
    <div class="reset-panel">
        <h1>Define Reset</h1>
        <table>
            <tr>
                <th scope="row">Reset order:</th>
                <td>
                    <label class="advanced-tooltip-able" :tooltip="orderTooltip">
                        <input ref="orderInput" v-model.number="resetData.order" type="number" @focus="onOrderFocus"/>
                        <errortip type="error" :manual="true" :class="{'show-tooltip': validationErrors.order}">
                            <span>Must be {{ orderTooltip }}.</span>
                        </errortip>
                    </label>
                </td>
                <td><label :tooltip="isOrderSetTooltip"><input value="clear" type="button"
                                                               @click="onClearClicked"/></label></td>
            </tr>
            <tr>
                <th scope="row">Variable:</th>
                <td>
                    <label class="advanced-tooltip-able">
                        <input list="variable_names" name="variable_names" v-model="resetData.variableName" @focus="onVariableNameFocus"/>
                        <errortip type="error" :manual="true" :class="{'show-tooltip': validationErrors.variableName}">
                            <span>Must either be empty (not set) or <br>a variable name of the parent component.</span>
                        </errortip>
                    </label>
                    <datalist id="variable_names">
                        <option v-for="(variableName, index) in getVariableNames" :key="'variable_' + index"
                                :value="variableName"/>
                    </datalist>
                </td>
            </tr>
            <tr>
                <th scope="row">Test Variable:</th>
                <td>
                    <label class="advanced-tooltip-able">
                        <input list="test_variable_names" name="test_variable_names"
                               v-model="resetData.testVariableName" @focus="onTestVariableNameFocus"/>
                        <errortip type="error" :manual="true"
                                  :class="{'show-tooltip': validationErrors.testVariableName}">
                            <span>Must either be empty (not set) or <br>a variable name of the parent component.</span>
                        </errortip>
                    </label>
                    <datalist id="test_variable_names">
                        <option v-for="(variableName, index) in getVariableNames" :key="'test_variable_' + index"
                                :value="variableName"/>
                    </datalist>
                </td>
            </tr>
        </table>
        <button class="reset-panel-button" @click="onDone">Done</button>
    </div>
</template>

<script>

    import AdvancedTooltip from "@/components/utilities/AdvancedTooltip";

    export default {
        name: 'ResetPanel',
        components: {
            errortip: AdvancedTooltip,
        },
        props: {
            data: Object,
        },
        data() {
            return {
                reset: this.data.reset,
                model: this.data.model,
                resetData: {
                    order: '',
                    variableName: '',
                    testVariableName: '',
                    testMath: '',
                    resetMath: '',
                },
                validationErrors: {
                    order: false,
                    variableName: false,
                    testVariableName: false,
                },
                orderTooltip: "an integer in the range [-2147483648, 2147483647].",
                isOrderSetTooltip: "unset the order value for the reset.",
            }
        },
        created: function () {
            if (this.reset.isOrderSet()) {
                this.resetData.order = this.reset.order();
            }
            const variable = this.reset.variable();
            if (variable) {
                this.resetData.variableName = variable.name();
            }
            const testVariable = this.reset.testVariable();
            if (testVariable) {
                this.resetData.testVariableName = testVariable.name();
            }
        },
        computed: {
            getVariableNames() {
                let variableNames = [];
                const component = this.reset.parent();

                for (let index = 0; index < component.variableCount(); index++) {
                    const variable = component.variableByIndex(index);
                    variableNames.push(variable.name());
                }
                return variableNames;
            },
        },
        methods: {
            resetValidationError(property) {
                if (this.validationErrors[property]) {
                    setTimeout(function () {
                        this.validationErrors[property] = false;
                    }.bind(this), 1200);
                }
            },
            onTestVariableNameFocus() {
                this.resetValidationError('testVariableName')
            },
            onVariableNameFocus() {
                this.resetValidationError('variableName')
            },
            onOrderFocus() {
                this.resetValidationError('order')
            },
            isValidOrder() {
                console.log("is valid order");
                const order = parseInt(this.resetData.order);
                console.log(order);
                console.log(this.resetData.order)
                console.log(Number.isInteger(this.resetData.order))
                console.log(typeof this.resetData.order)
                if (Number.isInteger(this.resetData.order)) {
                    console.log(-2147483648 <= this.resetData.order);
                    console.log(this.resetData.order <= 2147483647);
                    return -2147483648 <= this.resetData.order && this.resetData.order <= 2147483647;
                } else if (this.resetData.order === '') {
                    console.log("empty string????");
                    return true;
                }
                console.log('clearly false.');
                return false;
            },
            isValidVariableName(name) {
                if (this.getVariableNames.includes(name)) {
                    return true;
                } else if (name === '') {
                    return true;
                }
                return false;
            },
            isValidData() {
                const validOrder = this.isValidOrder();
                this.validationErrors.order = !validOrder;
                const validVariableName = this.isValidVariableName(this.resetData.variableName);
                this.validationErrors.variableName = !validVariableName;
                const validTestVariableName = this.isValidVariableName(this.resetData.testVariableName);
                this.validationErrors.testVariableName = !validTestVariableName;
                return validOrder &&
                    validVariableName &&
                    validTestVariableName;
            },
            storeData() {
                const order = parseInt(this.resetData.order);
                if (Number.isInteger(order)) {
                    this.reset.setOrder(order);
                } else if (this.resetData.order === '') {
                    this.reset.unsetOrder();
                }
                const component = this.reset.parent();
                if (this.resetData.variableName.length > 0) {
                    const variable = component.variableByName(this.resetData.variableName);
                    this.reset.setVariable(variable);
                }
                if (this.resetData.testVariableName.length > 0) {
                    const variable = component.variableByName(this.resetData.testVariableName);
                    this.reset.setTestVariable(variable);
                }
            },
            showErrors() {
                if (!this.isValidOrder()) {
                    console.log("show text about valid order.")
                }
            },
            onDone(event) {
                event.stopPropagation();
                event.preventDefault();
                if (this.isValidData()) {
                    this.storeData();
                    this.$parent.$emit('close');
                } else {
                    this.showErrors();
                }
            },
            onClearClicked(event) {
                event.stopPropagation();
                event.preventDefault();
                this.resetData.order = '';
            },
        },
    }
</script>

<style scoped="true">

    .reset-panel-button {
        margin-top: 1em;
    }

    th {
        text-align: right;
    }

</style>
