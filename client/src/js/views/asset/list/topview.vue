
<template lang="pug">
  ListGroup(fixed=true, @bottom="next", :updating="updating").l-list-body
    ul.list-group.clearfix(v-for="item in list")
        li.list-group-item.clearfix
          <router-link :to="{ name: 'newsDetail', params: { id: item.id }}">
            .row
              .col-xs-10.col-sm-10
                .l-item
                  i.fa.fa-fw.fa-clock-o.fa-lg.l-item-day  {{item.publishAt | date }}
              .col-xs-2.col-sm-2
                .l-item.l-item-viewscore.pull-right  {{item.total_score}} views
            hr
            .row.l-item-detail
              .col-xs-12.col-sm-12
                .l-item.l-item-image
                  <img :src="item.image | image" height="80px" width="110px" v-if="item.image" />
                .l-item
                    .l-item.l-item-sitename
                      .label.label-primary {{item.site_name}}
                    .l-item.l-item-title {{item.title}}
                  
            </router-link>

    <infinite-loading @infinite="infiniteHandler" :distance="distance" ref="infiniteLoading">
      <span slot="no-more">
      </span> 
    </infinite-loading>

</template>

<script lang="babel">
import {Action} from "constants"
import ViewList from "views/mixins/view-list"
import api from "api/asset"
export default {
  name: "keep-list-topview",
  mixins: [ViewList],
  mounted() {
    EventEmitter.$on(Action.UpdateAsset, v => this.search())
  },
  methods: {
    action(data, success, failure) {
      api.findNewsTopView(data, success, failure)
    },
  }
}
</script>