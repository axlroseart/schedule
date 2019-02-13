// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Api from './api'
import '../theme/index.css'
import ElementUI from 'element-ui'
import * as utils from './utils'
Vue.prototype.Api = Api
Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.mixin({
  methods: {
    _dateFormat: utils.dateFormat,
    _checkData: utils.checkData,
    _setCookie: utils.setCookie,
    _getCookie: utils.getCookie,
    _delCookie: utils.delCookie
  }
})
/* eslint-disable no-new */
const $vue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

export default $vue