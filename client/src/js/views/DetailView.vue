<style lang="scss">
.l-list-body {
  // height: 210px;
}
</style>
<template lang="pug">

  //-   .row "test"
    //- <router-link :to="/">
    //- </router-link>
  .l-wrapper#newsDetail
    affix.l-nav-header(:offset="{ top: 0, bottom: 0 }" relative-element-selector="#newsDetail" )
      .center-block.text-left
        <router-link :to="{ name: 'index' }">
          i.fa.fa-fw.fa-arrow-left
          | TOP
        </router-link>

    .container-fluid.l-panel#example-content
      .row
        .col-xs-12.col-sm-8.col-sm-offset-2
          .l-item.l-item-title {{list.title}}
        .center-block.text-center.l-contents-image
          <img :src="list.image | image" width="300px" v-if="list.image" />
      .row
        .col-xs-12.col-sm-8.col-sm-offset-2
          .panel-body
            .row
              .col-xs-8.col-sm-10.l-item
                i.fa.fa-fw.fa-clock-o.fa-lg.l-item-day {{list.publishAt | day }} {{list.publishAt | time }}
              .col-xs-4.col-sm-2
                LikeButton(v-bind:count="list.like"   , type="like", icon="fa-smile-o")
                LikeButton(v-bind:count="list.dislike", type="dislike" , icon="fa-frown-o")
              .l-item.l-item-description {{list.description | tagDelete}}
                .row
                  .col-xs-12.l-item
                    i.fa.fa-fw.fa-globe.fa-lg.l-item-day {{list.site_name }}
              hr
              .text-center.center-block
                .col-xs-10.col-xs-offset-1
                  <a target="_blank" v-bind:href=list.url>
                    .l-button.text-center.read-more 続きを読む
                  </a>

      .col-xs-12.col-sm-8.col-sm-offset-2
        .row
          CommentPost
        .row
          CommentList 
</template>
<script lang="babel">
import {Action} from "constants"
import ViewList from "views/mixins/view-list"
import ViewCrud from "views/mixins/view-crud"
import CommentPost from "views/asset/comment/post.vue"
import CommentList from "views/asset/comment/list.vue"
import LikeButton from "views/asset/detail/like.vue"

import api from "api/asset"
export default {
  name: "detail",

  mixins: [ViewList,ViewCrud],
  components: {
    "CommentPost": CommentPost,
    "CommentList": CommentList,
    "LikeButton" : LikeButton,
  },
  mounted() {
    EventEmitter.$on(Action.UpdateAsset, v => this.search())
  },
  methods: {
    action(data, success, failure) {
      data.id = this.$route.params.id;
      api.getNewsDetail(data, success, failure)
    },

  }
}
</script>