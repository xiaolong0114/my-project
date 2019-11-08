import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import DefaultInput from './views/Home.vue'
Vue.use(ElementUI)
const components = {
  DefaultInput
}
Vue.component('DefaultInput', DefaultInput)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
