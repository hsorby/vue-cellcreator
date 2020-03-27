import Vue from 'vue';
import Vuex from 'vuex';

import {ui} from "@/store/ui";
import {statuses} from "@/store/statuses";

Vue.use(Vuex);

export default new Vuex.Store({
    // Making sure that we're doing
    // everything correctly by enabling
    // strict mode in the dev environment.
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        'ui': ui,
        'statuses': statuses,
    }
});
