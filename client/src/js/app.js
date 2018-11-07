import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Affix from 'vue-affix'
import router from './router'

// Register Global Event
window.EventEmitter = new Vue()

// Vue Custom Filter
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueAnalytics, {
  id: 'UA-106958668-1',
  router
})

Vue.use(Affix);

// Application Initialize

import App from 'App.vue'
import Strap from 'vue-strap'
new Vue({
  router,
  template: '<App ref="app" />',
  components: {
    'App': App,
    'Strap' : Strap
  },

  
}).$mount('#app')