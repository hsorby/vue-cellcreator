import Vue from 'vue'
import App from './App.vue'
// import Vuex from 'vuex';

// import {uiData, data, uiState, jsModules} from '@/js/model';
import "@/assets/common.css"
import "@/assets/zindex.css"
import "@/assets/infotip.css"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus, faMinus);

Vue.config.productionTip = false;

import store from "@/store"
import libCellML from "@/js/libcellml";
// Vue.use(Vuex);

Vue.prototype.$libcellml = null;

Vue.component('font-awesome-icon', FontAwesomeIcon);
// Replaces the Vue store.
// const store = new Vuex.Store({
//   statuses.js: {
//     data: data,
//     uiData: uiData,
//     uiState: uiState,
//     jsModules: jsModules,
//   },
//   state: {},
//   mutations: {},
//   getters: {},
//   actions: {
//     moduleReady(context, payload) {
//       if (payload.name === 'libcellml') {
//         context.commit('data/setLibCellMLVersion', this.state.jsModules.libcellml.versionString())
//       }
//     }
//   }
// });

new Vue({
  store,
  render: h => h(App),
  beforeCreate() {
    if (this.$libcellml === null) {
      new libCellML().then((libCellMLModule) => {
        Vue.prototype.$libcellml = libCellMLModule;
        this.$store.commit("statuses/setLibCellMLReady");
      });
    // } else {
    //   console.log(" =========== We don't come here twice right?????")
    }
  },
}).$mount('#app');

// store.dispatch('jsModules/load').then(() => {
//   // Ignoring.
// });
