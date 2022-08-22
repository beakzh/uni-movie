import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import {toast,toImg} from 'utils/common.js'
import {getLocal} from './utils/storage.js'

Vue.config.productionTip = false
Vue.prototype.$show = toast
Vue.prototype.$img = toImg
Vue.prototype.getLocal = getLocal
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif