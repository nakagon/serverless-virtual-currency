
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import ListView from "views/ListView.vue"
import DetailView from "views/DetailView.vue"
var router = new Router({
  base: '/',
  routes: [
    {name: 'index' , path: '/', component: ListView, meta: {anonymous: true}},
    {name: 'newsDetail', path: '/newsDetail/:id',   component: DetailView, meta: {anonymous: true}},

    {path: '*',        redirect: '/'}
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      // savedPosition.x = 1
      return savedPosition
    } else {
      // return { x: 0, y: 0 }
    }
  },

})

export default router
