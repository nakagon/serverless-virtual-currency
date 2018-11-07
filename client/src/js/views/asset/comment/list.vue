<template lang="pug">
  ListGroup(fixed=true, @bottom="next", :updating="updating").l-list-body
    .panel-body
      ul.list-group.clearfix(v-for="item in list")
        .row
          .col-xs-10.col-sm-10
            .l-item
              i.fa.fa-fw.fa-clock-o.fa-lg.l-item-day  {{item.createdAt | date }}
          //- .col-xs-2.col-sm-2
            //- .l-item.l-item-viewscore.pull-right  {{item.total_score}} views
          .col-xs-12.col-sm-12
            .l-item-comment(v-html="$options.filters.multiline(item.comment)") 
        hr

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
  name: "keep-list-newview",
  mixins: [ViewList],
  created() {
    EventEmitter.$on(Action.UpdateAsset, v => this.search())
  },

  methods: {
    action(data, success, failure) {
      data.article_id = this.$route.params.id
      api.findComment(data, success, failure)
    },

  },

}
</script>