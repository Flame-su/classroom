// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './_vuex/store'
Vue.config.productionTip = false
import vueTap from 'v-tap'; //修改click为tap事件
Vue.use(vueTap);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, //
  store,
  template: '<App/>',
  components: {
    App
  }
})
