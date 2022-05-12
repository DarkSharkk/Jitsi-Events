import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue } from "bootstrap-vue"
import axios from 'axios'
import VueAxios from 'vue-axios'
import DatePicker from "vue2-datepicker"
import 'vue2-datepicker/index.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
DatePicker.install(Vue);
DatePicker.locale('ru');

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
