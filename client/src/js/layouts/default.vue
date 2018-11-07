<template lang="pug">
  .l-container-main
    //- nav.navbar.navbar-default.navbar-static-top.l-nav-header(v-if="logined")
    //-   .navbar-header
    //-     a.navbar-brand(href="/") App
    //-   ul.nav.navbar-nav
    //-     li: router-link(to="/top") "取扱い商品名 (TOP)" 
    //-     li: router-link(to="/trade") 取引情報
    //-     li: router-link(to="/asset") 口座資産
    //-   ul.nav.navbar-nav.navbar-right
    //-     li.dropdown
    //-       a.dropdown-toggle(href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false")
    //-         span(v-text="user.name")
    //-         |  様 
    //-         span.caret
    //-       ul.dropdown-menu(role="menu")
    //-         li: a
    //-           i.fa.fa-fw.fa-user
    //-           |  アカウント情報
    //-         li.divider
    //-         li: a(href="#" @click.prevent="logout")
    //-           i.fa.fa-fw.fa-sign-out
    //-           |  ログアウト
    nav.navbar.navbar-default.l-header
      a.navbar-brand(href="/") 仮想通貨PRO!
      ul.nav.navbar-nav.navbar-right
        //- li.dropdown
        //-   a.dropdown-toggle(href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false")
        //-     span.caret
        //-   ul.dropdown-menu(role="menu")
        //-     li: a
        //-       i.fa.fa-fw.fa-user
        //-       |  アカウント情報
        //-     li.divider
        //-     li: a(href="#" @click.prevent="logout")
        //-       i.fa.fa-fw.fa-sign-out
        //-       |  ログアウト

    <transition name="slide-fade">
      <keep-alive :include="/^keep.*/">
        <router-view></router-view>
      </keep-alive>
    </transition>
</template>
