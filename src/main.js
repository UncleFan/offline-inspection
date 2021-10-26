/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "amfe-flexible";
import Vant, { Icon } from "vant";
import "vant/lib/index.css";
import VConsole  from "vconsole";
const vConsole  = new VConsole();

// document.addEventListener('click', function(e) {
//   if(e.target.id === "save") {
//     vConsole.destroy();
//   }
// }, false)

// ic.hideOptionMenu();

Vue.config.productionTip = false;
Vue.use(Vant);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
