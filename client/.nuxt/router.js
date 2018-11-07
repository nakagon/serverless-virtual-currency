import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _711e97f8 = () => import('../src/js/pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
const _d570647e = () => import('../src/js/pages/ListView.vue' /* webpackChunkName: "pages/ListView" */).then(m => m.default || m)
const _54ec4e18 = () => import('../src/js/pages/DetailView.vue' /* webpackChunkName: "pages/DetailView" */).then(m => m.default || m)
const _478db7a8 = () => import('../src/js/pages/asset/list/new.vue' /* webpackChunkName: "pages/asset/list/new" */).then(m => m.default || m)
const _51e6d7b0 = () => import('../src/js/pages/asset/detail/like.vue' /* webpackChunkName: "pages/asset/detail/like" */).then(m => m.default || m)
const _248e7fcb = () => import('../src/js/pages/asset/comment/list.vue' /* webpackChunkName: "pages/asset/comment/list" */).then(m => m.default || m)
const _017896cd = () => import('../src/js/pages/asset/comment/post.vue' /* webpackChunkName: "pages/asset/comment/post" */).then(m => m.default || m)
const _a8af6a7c = () => import('../src/js/pages/asset/list/list.vue' /* webpackChunkName: "pages/asset/list/list" */).then(m => m.default || m)
const _7d392d06 = () => import('../src/js/pages/asset/list/topview.vue' /* webpackChunkName: "pages/asset/list/topview" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/",
			component: _711e97f8,
			name: "index"
		},
		{
			path: "/ListView",
			component: _d570647e,
			name: "ListView"
		},
		{
			path: "/DetailView",
			component: _54ec4e18,
			name: "DetailView"
		},
		{
			path: "/asset/list/new",
			component: _478db7a8,
			name: "asset-list-new"
		},
		{
			path: "/asset/detail/like",
			component: _51e6d7b0,
			name: "asset-detail-like"
		},
		{
			path: "/asset/comment/list",
			component: _248e7fcb,
			name: "asset-comment-list"
		},
		{
			path: "/asset/comment/post",
			component: _017896cd,
			name: "asset-comment-post"
		},
		{
			path: "/asset/list/list",
			component: _a8af6a7c,
			name: "asset-list-list"
		},
		{
			path: "/asset/list/topview",
			component: _7d392d06,
			name: "asset-list-topview"
		}
    ],
    fallback: false
  })
}
