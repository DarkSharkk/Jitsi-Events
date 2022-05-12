import Vue from 'vue'
import VueRouter from 'vue-router'
import MyEvents from "@/components/MyEvents";
import SearchEvents from "@/components/SearchEvents";
import Event from "@/components/Event";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: MyEvents
  },
  {
    path: '/search',
    name: 'search',
    component: SearchEvents
  },
  {
    path: '/event/:event_id',
    name: 'event-info',
    component: Event
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
