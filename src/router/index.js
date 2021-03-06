import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const routes = [{
  path: '/',
  name: 'Home',
  redirect: {
    name: 'home'
  }
},
{
  path: '/home',
  name: 'home',
  component: () => import('@/views/Home.vue')
},
{
  path: '/placeList',
  name: 'placeList',
  component: () => import('@/views/PlaceList.vue')
},
{
  path: '/joinMember',
  name: 'joinMember',
  component: () => import('@/views/JoinMember.vue')
},
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
