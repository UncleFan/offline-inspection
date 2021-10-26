import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
// import MyVideo from "../views/myvideo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "离线巡检",
    },
  },
  // {
  //   path: "/",
  //   name: "MyVideo",
  //   component: MyVideo,
  //   meta: {
  //     title: "离线巡检",
  //   },
  // }
];

const router = new VueRouter({
  routes,
});

export default router;
