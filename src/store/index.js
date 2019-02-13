import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'

require('es6-promise').polyfill()

// To add to window
if (!window.Promise) {
  window.Promise = Promise
}

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common
  }
  // strict: debug
})
