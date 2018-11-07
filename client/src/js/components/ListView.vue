<style lang="scss">
.tab-pane {
  padding: 10px 0;
}
.l-panel-asset-info {
  .panel-body {
    height: 300px;
  }
}
/* Note: Try to remove the following lines to see the effect of CSS positioning */


</style>

<template lang="pug">

  .l-wrapper#newsList
    affix.l-nav-header(:offset="{ top: 0, bottom: 0 }" relative-element-selector="#newsList" )
      nav.navbar
        ul.nav.nav-tabs
          li.active: a(href="#new" data-toggle="tab") 
            .fa.fa-star-o  新着
          li: a(href="#topview" data-toggle="tab") 
            .fa.fa-heart-o 人気
    .container-fluid
        .row
          .l-list
            .col-md-10.col-md-offset-1.col-xs-12
              .tab-content
                .tab-pane.active#new
                  NewList
                .tab-pane#topview
                  TopViewList

</template>

<script lang="babel">
import {Action} from "constants"
import ViewBasic from "~/pages/mixins/view-basic"
import NewList from "~/pages/asset/list/new.vue"
import TopViewList from "~/pages/asset/list/topview.vue"
// import api from "api/asset"

export default {
  name: "keep-list-view",
  mixins: [ViewBasic],
  components: {
    "NewList": NewList,
    "TopViewList": TopViewList
  },

  activated() {
    scroll = JSON.parse(sessionStorage.getItem('indexScrollTop'));
    console.log(scroll);
    if (scroll !== undefined) {
      scrollTo(scroll.x , scroll.y);
    }
  }, 
  watch: {
    '$route' (to, from) {
      if (to.name === 'index' || from.name!=="index") {
        let positionStore = { 
          x: window.pageXOffset,
          y: window.pageYOffset
        };
        sessionStorage.setItem('indexScrollTop', JSON.stringify(positionStore));
      }

    }
  },
  methods : {
    onTab: function () {
      
    }
  }

}
</script>