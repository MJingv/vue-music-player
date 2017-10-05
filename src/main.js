// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
// Vue.config.productionTip = false

import 'common/stylus/index.styl'
import vConsole from 'vconsole'

console.log('test');

fastclick.attach(document.body)

Vue.use(VueLazyload,{
  loading:require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
