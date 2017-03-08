import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import filter from './filter'
import wilddog from 'wilddog'
import WildVue from 'wildvue'

Vue.use(VueResource);

Vue.use(WildVue);

Vue.use(filter)
/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
